package com.moori.sushi.data

import android.content.Context
import com.moori.sushi.BuildConfig
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONArray
import org.json.JSONObject
import java.io.IOException
import java.util.concurrent.TimeUnit

class ApiException(message: String, val code: Int = 0) : Exception(message)

/**
 * Talks to the same Moori server (and database) as the website:
 *   - customer accounts and the ADMIN account
 *   - Google single sign-on
 *   - the menu and every order
 */
class MooriApi(context: Context) {
    private val cookies = SessionCookieJar(context.applicationContext)
    private val client = OkHttpClient.Builder()
        .cookieJar(cookies)
        .connectTimeout(15, TimeUnit.SECONDS)
        .readTimeout(20, TimeUnit.SECONDS)
        .build()
    private val jsonType = "application/json; charset=utf-8".toMediaType()

    private suspend fun call(method: String, path: String, body: JSONObject? = null): JSONObject =
        withContext(Dispatchers.IO) {
            val requestBody = if (method == "GET") null else (body?.toString() ?: "{}").toRequestBody(jsonType)
            val request = Request.Builder()
                .url(BuildConfig.BASE_URL + path)
                .method(method, requestBody)
                .build()
            try {
                client.newCall(request).execute().use { response ->
                    val text = response.body?.string().orEmpty()
                    val json = try {
                        JSONObject(text)
                    } catch (e: Exception) {
                        JSONObject()
                    }
                    if (!response.isSuccessful) {
                        throw ApiException(
                            json.optString("error", "Something went wrong. Please try again."),
                            response.code,
                        )
                    }
                    json
                }
            } catch (e: IOException) {
                throw ApiException("Can't reach the server. Check your internet connection.")
            }
        }

    // ---- Auth ------------------------------------------------------------------------------

    /** The Google "web" client ID the server uses to check SSO tokens (null = SSO not set up). */
    suspend fun googleClientId(): String? {
        val j = call("GET", "/api/auth/config")
        return if (j.isNull("googleClientId")) null else j.getString("googleClientId")
    }

    suspend fun me(): AuthUser? {
        val j = call("GET", "/api/auth/me")
        return if (j.isNull("user")) null else j.getJSONObject("user").toAuthUser()
    }

    suspend fun login(email: String, password: String): AuthUser {
        val body = JSONObject().put("email", email).put("password", password)
        return call("POST", "/api/auth/login", body).getJSONObject("user").toAuthUser()
    }

    suspend fun register(name: String, email: String, number: String, password: String): AuthUser {
        val body = JSONObject()
            .put("name", name).put("email", email).put("number", number).put("password", password)
        return call("POST", "/api/auth/register", body).getJSONObject("user").toAuthUser()
    }

    suspend fun google(idToken: String): AuthUser {
        val body = JSONObject().put("credential", idToken)
        return call("POST", "/api/auth/google", body).getJSONObject("user").toAuthUser()
    }

    suspend fun logout() {
        try {
            call("POST", "/api/auth/logout", JSONObject())
        } finally {
            cookies.clear()
        }
    }

    // ---- Menu & orders -------------------------------------------------------------------------

    suspend fun menu(): Pair<List<SushiItem>, List<SushiItem>> {
        val j = call("GET", "/api/menu")
        val seasonal = j.getJSONArray("seasonal").objects().map { it.toSushiItem() }
        val full = j.getJSONArray("full").objects().map { it.toSushiItem() }
        return seasonal to full
    }

    suspend fun orders(): List<Order> =
        call("GET", "/api/orders").getJSONArray("orders").objects().map { it.toOrder() }

    suspend fun createOrder(
        cart: List<CartItem>,
        discount: Double,
        name: String,
        phone: String,
        address: String,
        payment: String,
    ): Order {
        val items = JSONArray()
        for (c in cart) {
            items.put(
                JSONObject()
                    .put("cartItemId", c.cartItemId)
                    .put("sushiItem", JSONObject().put("id", c.item.id))
                    .put("quantity", c.quantity)
                    .put(
                        "options",
                        JSONObject()
                            .put("spiciness", c.options.spiciness)
                            .put("extraWasabi", c.options.extraWasabi)
                            .put("extraGinger", c.options.extraGinger)
                            .put("riceType", c.options.riceType)
                            .put("notes", c.options.notes),
                    ),
            )
        }
        val body = JSONObject()
            .put("items", items)
            .put("discount", discount)
            .put("customerName", name)
            .put("email", "")
            .put("phone", phone)
            .put("deliveryAddress", address)
            .put("paymentMethod", payment)
        return call("POST", "/api/orders", body).getJSONObject("order").toOrder()
    }

    suspend fun setStatus(orderId: String, status: String) {
        call("PATCH", "/api/orders/${java.net.URLEncoder.encode(orderId, "UTF-8")}/status", JSONObject().put("status", status))
    }
}
