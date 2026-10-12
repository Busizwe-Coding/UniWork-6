package com.moori.sushi.ui

import android.app.Application
import android.content.Context
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.credentials.CredentialManager
import androidx.credentials.CustomCredential
import androidx.credentials.GetCredentialRequest
import androidx.credentials.exceptions.GetCredentialCancellationException
import androidx.credentials.exceptions.GetCredentialException
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.google.android.libraries.identity.googleid.GetSignInWithGoogleOption
import com.google.android.libraries.identity.googleid.GoogleIdTokenCredential
import com.google.android.libraries.identity.googleid.GoogleIdTokenParsingException
import com.moori.sushi.data.ApiException
import com.moori.sushi.data.AuthUser
import com.moori.sushi.data.CartItem
import com.moori.sushi.data.CartOptions
import com.moori.sushi.data.MooriApi
import com.moori.sushi.data.ORDER_FLOW
import com.moori.sushi.data.Order
import com.moori.sushi.data.SushiItem
import com.moori.sushi.data.ThemeMode
import com.moori.sushi.data.ThemeStore
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import java.util.UUID

enum class Screen { Home, Menu, Cart, Checkout, Orders, Kitchen, Settings }

const val PROMO_CODE = "MOORI20"

class AppViewModel(app: Application) : AndroidViewModel(app) {
    private val api = MooriApi(app)
    private val themeStore = ThemeStore(app)

    // ---- App / auth state ---------------------------------------------------------------------
    var booting by mutableStateOf(true); private set
    var user by mutableStateOf<AuthUser?>(null); private set
    var googleClientId by mutableStateOf<String?>(null); private set
    var serverError by mutableStateOf<String?>(null); private set
    var authBusy by mutableStateOf(false); private set
    var authError by mutableStateOf<String?>(null); private set
    var themeMode by mutableStateOf(themeStore.load()); private set
    var screen by mutableStateOf(Screen.Home); private set

    // ---- Menu ---------------------------------------------------------------------------------
    var seasonal by mutableStateOf<List<SushiItem>>(emptyList()); private set
    var fullMenu by mutableStateOf<List<SushiItem>>(emptyList()); private set
    val allItems: List<SushiItem> get() = (seasonal + fullMenu).distinctBy { it.id }

    // ---- Cart & checkout ----------------------------------------------------------------------
    val cart = mutableStateListOf<CartItem>()
    var promoApplied by mutableStateOf(false); private set
    var promoError by mutableStateOf<String?>(null); private set
    var checkoutBusy by mutableStateOf(false); private set
    var checkoutError by mutableStateOf<String?>(null); private set

    val subtotal: Double get() = cart.sumOf { it.item.price * it.quantity }
    val discount: Double get() = if (promoApplied) subtotal * 0.20 else 0.0
    val deliveryFee: Double get() = if (subtotal == 0.0 || subtotal >= 500.0) 0.0 else 50.0
    val total: Double get() = maxOf(0.0, subtotal - discount + deliveryFee)
    val cartCount: Int get() = cart.sumOf { it.quantity }

    // ---- Orders -------------------------------------------------------------------------------
    var orders by mutableStateOf<List<Order>>(emptyList()); private set
    var selectedOrderId by mutableStateOf<String?>(null)

    init {
        viewModelScope.launch { boot() }
        // Refresh orders every 5 seconds: the admin's Kitchen KDS sees new orders,
        // and customers see their order move through the stages.
        viewModelScope.launch {
            while (true) {
                if (user != null) refreshOrders()
                delay(5000)
            }
        }
    }

    // ---- Startup ------------------------------------------------------------------------------
    private suspend fun boot() {
        serverError = null
        try {
            googleClientId = api.googleClientId()
            user = api.me()
            loadMenu()
            if (user != null) refreshOrders()
        } catch (e: ApiException) {
            serverError = e.message
        }
        booting = false
    }

    fun retry() {
        booting = true
        viewModelScope.launch { boot() }
    }

    private suspend fun loadMenu() {
        val (s, f) = api.menu()
        seasonal = s
        fullMenu = f
    }

    suspend fun refreshOrders() {
        try {
            val list = api.orders()
            orders = list
        } catch (e: ApiException) {
            if (e.code == 401) clearSession()
        }
    }

    // ---- Auth ---------------------------------------------------------------------------------
    fun clearAuthError() {
        authError = null
    }

    private suspend fun onSignedIn(u: AuthUser) {
        user = u
        screen = Screen.Home
        serverError = null
        if (allItems.isEmpty()) {
            try {
                loadMenu()
            } catch (e: ApiException) {
                serverError = e.message
            }
        }
        refreshOrders()
    }

    private fun authAction(block: suspend () -> AuthUser) {
        viewModelScope.launch {
            authBusy = true
            authError = null
            try {
                onSignedIn(block())
            } catch (e: ApiException) {
                authError = e.message
            } finally {
                authBusy = false
            }
        }
    }

    fun login(email: String, password: String) = authAction { api.login(email.trim(), password) }

    fun register(name: String, email: String, number: String, password: String) =
        authAction { api.register(name.trim(), email.trim(), number.trim(), password) }

    /** Google single sign-on. [context] must be the Activity. */
    fun signInWithGoogle(context: Context) {
        val clientId = googleClientId ?: return
        viewModelScope.launch {
            authBusy = true
            authError = null
            try {
                val option = GetSignInWithGoogleOption.Builder(clientId).build()
                val request = GetCredentialRequest.Builder().addCredentialOption(option).build()
                val result = CredentialManager.create(context).getCredential(context, request)
                val credential = result.credential
                if (credential is CustomCredential &&
                    credential.type == GoogleIdTokenCredential.TYPE_GOOGLE_ID_TOKEN_CREDENTIAL
                ) {
                    val idToken = GoogleIdTokenCredential.createFrom(credential.data).idToken
                    onSignedIn(api.google(idToken))
                } else {
                    authError = "Google sign-in returned an unexpected result."
                }
            } catch (e: GetCredentialCancellationException) {
                // The person closed the Google sheet - nothing to show.
            } catch (e: GetCredentialException) {
                authError = "Google sign-in failed: ${e.message ?: "unknown error"}"
            } catch (e: GoogleIdTokenParsingException) {
                authError = "Google sign-in failed. Please try again."
            } catch (e: ApiException) {
                authError = e.message
            } finally {
                authBusy = false
            }
        }
    }

    fun logout() {
        viewModelScope.launch {
            try {
                api.logout()
            } catch (e: ApiException) {
                // Even if the server can't be reached, sign out on this phone.
            }
            clearSession()
        }
    }

    private fun clearSession() {
        user = null
        orders = emptyList()
        cart.clear()
        promoApplied = false
        selectedOrderId = null
        screen = Screen.Home
    }

    // ---- Settings -----------------------------------------------------------------------------
    fun setTheme(mode: ThemeMode) {
        themeMode = mode
        themeStore.save(mode)
    }

    fun navigate(target: Screen) {
        screen = target
    }

    // ---- Cart ---------------------------------------------------------------------------------
    fun addToCart(item: SushiItem, quantity: Int, options: CartOptions) {
        cart.add(CartItem(UUID.randomUUID().toString(), item, quantity, options))
    }

    fun updateQuantity(cartItemId: String, quantity: Int) {
        val index = cart.indexOfFirst { it.cartItemId == cartItemId }
        if (index < 0) return
        if (quantity <= 0) cart.removeAt(index) else cart[index] = cart[index].copy(quantity = quantity)
    }

    fun applyPromo(code: String) {
        if (code.trim().uppercase() == PROMO_CODE) {
            promoApplied = true
            promoError = null
        } else {
            promoApplied = false
            promoError = "Invalid code. Try \"$PROMO_CODE\" for 20% off."
        }
    }

    // ---- Orders -------------------------------------------------------------------------------
    fun placeOrder(name: String, phone: String, address: String, payment: String) {
        viewModelScope.launch {
            checkoutBusy = true
            checkoutError = null
            try {
                val saved = api.createOrder(cart.toList(), discount, name.trim(), phone.trim(), address.trim(), payment)
                orders = listOf(saved) + orders.filter { it.id != saved.id }
                selectedOrderId = saved.id
                cart.clear()
                promoApplied = false
                screen = Screen.Orders
            } catch (e: ApiException) {
                checkoutError = e.message
            } finally {
                checkoutBusy = false
            }
        }
    }

    /** Admin only: move an order to its next stage in the kitchen. */
    fun advanceOrder(order: Order) {
        val index = ORDER_FLOW.indexOf(order.status)
        if (index < 0 || index >= ORDER_FLOW.lastIndex) return
        val next = ORDER_FLOW[index + 1]
        val previous = orders
        orders = orders.map { if (it.id == order.id) it.copy(status = next) else it }
        viewModelScope.launch {
            try {
                api.setStatus(order.id, next)
            } catch (e: ApiException) {
                orders = previous
            }
        }
    }
}
