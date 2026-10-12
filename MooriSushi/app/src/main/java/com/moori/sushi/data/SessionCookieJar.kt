package com.moori.sushi.data

import android.content.Context
import com.moori.sushi.BuildConfig
import okhttp3.Cookie
import okhttp3.CookieJar
import okhttp3.HttpUrl
import okhttp3.HttpUrl.Companion.toHttpUrl

/**
 * Keeps the server's login cookie ("moori_session") and stores it on the phone,
 * so the user stays signed in after closing the app.
 */
class SessionCookieJar(context: Context) : CookieJar {
    private val prefs = context.getSharedPreferences("moori_cookies", Context.MODE_PRIVATE)
    private val baseUrl: HttpUrl = BuildConfig.BASE_URL.toHttpUrl()
    private val store = mutableListOf<Cookie>()

    init {
        prefs.getStringSet("cookies", emptySet())?.forEach { raw ->
            Cookie.parse(baseUrl, raw)?.let { store.add(it) }
        }
    }

    @Synchronized
    override fun saveFromResponse(url: HttpUrl, cookies: List<Cookie>) {
        for (c in cookies) {
            store.removeAll { it.name == c.name && it.domain == c.domain && it.path == c.path }
            if (c.expiresAt > System.currentTimeMillis()) store.add(c)
        }
        persist()
    }

    @Synchronized
    override fun loadForRequest(url: HttpUrl): List<Cookie> {
        val now = System.currentTimeMillis()
        val removed = store.removeAll { it.expiresAt <= now }
        if (removed) persist()
        return store.filter { it.matches(url) }
    }

    @Synchronized
    fun clear() {
        store.clear()
        persist()
    }

    private fun persist() {
        prefs.edit().putStringSet("cookies", store.map { it.toString() }.toSet()).apply()
    }
}
