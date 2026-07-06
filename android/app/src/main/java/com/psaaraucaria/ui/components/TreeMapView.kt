package com.psaaraucaria.ui.components

import android.annotation.SuppressLint
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import com.psaaraucaria.data.local.entity.TreeEntity

@SuppressLint("MissingPermission")
@Composable
fun TreeMapView(
    trees: List<TreeEntity>,
    onMapClick: (Double, Double) -> Unit,
    modifier: Modifier = Modifier
) {
    // Em produção: usar Mapbox/MapLibre aqui
    androidx.compose.foundation.layout.Box(modifier = modifier.fillMaxSize()) {
        Text("Mapa offline (Mapbox)")
    }
}
