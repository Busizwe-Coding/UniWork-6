package com.moori.sushi.data

import android.content.Context

/** Remembers the light / dark / system choice between app launches. */
class ThemeStore(context: Context) {
    private val prefs = context.getSharedPreferences("moori_settings", Context.MODE_PRIVATE)

    fun load(): ThemeMode =
        runCatching { ThemeMode.valueOf(prefs.getString("theme", ThemeMode.SYSTEM.name) ?: ThemeMode.SYSTEM.name) }
            .getOrDefault(ThemeMode.SYSTEM)

    fun save(mode: ThemeMode) {
        prefs.edit().putString("theme", mode.name).apply()
    }
}
