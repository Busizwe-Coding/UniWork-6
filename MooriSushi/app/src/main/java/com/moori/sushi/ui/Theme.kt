package com.moori.sushi.ui

import android.app.Activity
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Typography
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat
import com.moori.sushi.data.ThemeMode

val MooriRed = Color(0xFFBC001F)

private val LightColors = lightColorScheme(
    primary = MooriRed,
    onPrimary = Color.White,
    primaryContainer = Color(0xFFFFDAD7),
    onPrimaryContainer = Color(0xFF410006),
    secondary = Color(0xFF5F5E5E),
    background = Color(0xFFF9F9F9),
    onBackground = Color(0xFF1A1C1C),
    surface = Color.White,
    onSurface = Color(0xFF1A1C1C),
    surfaceVariant = Color(0xFFEEEEEE),
    onSurfaceVariant = Color(0xFF5F5E5E),
    outline = Color(0xFFE7BCB9),
    tertiary = Color(0xFF2E7D32),
    error = Color(0xFFB3261E),
)

private val DarkColors = darkColorScheme(
    primary = Color(0xFFFF5A6E),
    onPrimary = Color(0xFF3A0008),
    primaryContainer = Color(0xFF93001A),
    onPrimaryContainer = Color(0xFFFFDAD7),
    secondary = Color(0xFFC9C6C5),
    background = Color(0xFF121212),
    onBackground = Color(0xFFEDEDED),
    surface = Color(0xFF1E1E1E),
    onSurface = Color(0xFFEDEDED),
    surfaceVariant = Color(0xFF2B2B2B),
    onSurfaceVariant = Color(0xFFC9C6C5),
    outline = Color(0xFF5A3F3E),
    tertiary = Color(0xFF66BB6A),
    error = Color(0xFFFFB4AB),
)

@Composable
fun MooriTheme(mode: ThemeMode, content: @Composable () -> Unit) {
    val dark = when (mode) {
        ThemeMode.SYSTEM -> isSystemInDarkTheme()
        ThemeMode.LIGHT -> false
        ThemeMode.DARK -> true
    }
    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = !dark
        }
    }
    MaterialTheme(
        colorScheme = if (dark) DarkColors else LightColors,
        typography = Typography(),
        content = content,
    )
}
