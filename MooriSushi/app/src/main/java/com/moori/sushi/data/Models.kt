package com.moori.sushi.data

import org.json.JSONArray
import org.json.JSONObject

data class SushiItem(
    val id: String,
    val name: String,
    val japaneseName: String?,
    val description: String,
    val price: Double,
    val category: String,
    val image: String,
    val pieces: String?,
    val spicy: Boolean,
    val popular: Boolean,
    val isChefSpecial: Boolean,
)

data class CartOptions(
    val spiciness: String = "Mild",
    val extraWasabi: Boolean = false,
    val extraGinger: Boolean = false,
    val riceType: String = "Traditional White",
    val notes: String = "",
)

data class CartItem(
    val cartItemId: String,
    val item: SushiItem,
    val quantity: Int,
    val options: CartOptions,
)

data class Order(
    val id: String,
    val createdAt: String,
    val createdAtMs: Long,
    val items: List<CartItem>,
    val subtotal: Double,
    val discount: Double,
    val deliveryFee: Double,
    val total: Double,
    val status: String,
    val customerName: String,
    val phone: String,
    val deliveryAddress: String,
    val paymentMethod: String,
    val estimatedMinutes: Int,
)

data class AuthUser(
    val id: Int,
    val name: String,
    val email: String,
    val number: String,
    val role: String,
) {
    val isAdmin: Boolean get() = role == "admin"
}

enum class ThemeMode { SYSTEM, LIGHT, DARK }

val ORDER_FLOW = listOf("Received", "Kitchen", "Seared", "Delivery", "Delivered")

val STAGE_LABELS = mapOf(
    "Received" to "Order Confirmed",
    "Kitchen" to "Chef Rolling",
    "Seared" to "Torch Seared & Plated",
    "Delivery" to "Driver En Route",
    "Delivered" to "Delivered",
)

// ---- JSON parsing (server -> app) ----------------------------------------------------------

internal fun JSONObject.strOrNull(key: String): String? =
    if (has(key) && !isNull(key)) getString(key) else null

internal fun JSONArray.objects(): List<JSONObject> = List(length()) { getJSONObject(it) }

fun JSONObject.toSushiItem() = SushiItem(
    id = getString("id"),
    name = getString("name"),
    japaneseName = strOrNull("japaneseName"),
    description = optString("description"),
    price = getDouble("price"),
    category = optString("category"),
    image = optString("image"),
    pieces = strOrNull("pieces"),
    spicy = optBoolean("spicy"),
    popular = optBoolean("popular"),
    isChefSpecial = optBoolean("isChefSpecial"),
)

fun JSONObject.toCartItem(): CartItem {
    val o = optJSONObject("options") ?: JSONObject()
    return CartItem(
        cartItemId = optString("cartItemId"),
        item = getJSONObject("sushiItem").toSushiItem(),
        quantity = optInt("quantity", 1),
        options = CartOptions(
            spiciness = o.optString("spiciness", "Mild"),
            extraWasabi = o.optBoolean("extraWasabi"),
            extraGinger = o.optBoolean("extraGinger"),
            riceType = o.optString("riceType", "Traditional White"),
            notes = o.optString("notes"),
        ),
    )
}

fun JSONObject.toOrder() = Order(
    id = getString("id"),
    createdAt = optString("createdAt"),
    createdAtMs = optLong("createdAtMs", 0L),
    items = getJSONArray("items").objects().map { it.toCartItem() },
    subtotal = getDouble("subtotal"),
    discount = optDouble("discount", 0.0),
    deliveryFee = optDouble("deliveryFee", 0.0),
    total = getDouble("total"),
    status = optString("status", "Received"),
    customerName = optString("customerName"),
    phone = optString("phone"),
    deliveryAddress = optString("deliveryAddress"),
    paymentMethod = optString("paymentMethod"),
    estimatedMinutes = optInt("estimatedMinutes", 35),
)

fun JSONObject.toAuthUser() = AuthUser(
    id = getInt("id"),
    name = getString("name"),
    email = getString("email"),
    number = optString("number"),
    role = getString("role"),
)
