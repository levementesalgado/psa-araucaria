package com.psaaraucaria.ui.theme

import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val DarkColors = darkColorScheme(
    primary = Color(0xFF16a34a),
    secondary = Color(0xFF22c55e),
    surface = Color(0xFF09090b),
    background = Color(0xFF09090b),
    onPrimary = Color.White,
    onSurface = Color(0xFFf1f5f9),
)

@Composable
fun PSAAraucariaTheme(content: @Composable () -> Unit) {
    MaterialTheme(colorScheme = DarkColors, content = content)
}
