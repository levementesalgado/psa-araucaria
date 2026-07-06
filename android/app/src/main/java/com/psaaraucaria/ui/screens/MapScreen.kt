package com.psaaraucaria.ui.screens

import android.Manifest
import android.content.pm.PackageManager
import android.location.Location
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.core.content.ContextCompat
import androidx.lifecycle.viewmodel.compose.viewModel
import com.psaaraucaria.ui.components.TreeMapView
import com.psaaraucaria.ui.theme.PSAAraucariaTheme

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MapScreen(viewModel: MapViewModel = viewModel()) {
    val context = LocalContext.current
    val state by viewModel.state.collectAsState()
    var location by remember { mutableStateOf<Location?>(null) }

    val locationPermissionLauncher = rememberLauncherForActivityResult(ActivityResultContracts.RequestPermission()) { granted ->
        if (granted) viewModel.requestLocation(context)
    }

    LaunchedEffect(Unit) {
        if (ContextCompat.checkSelfPermission(context, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
            viewModel.requestLocation(context)
        } else {
            locationPermissionLauncher.launch(Manifest.permission.ACCESS_FINE_LOCATION)
        }
    }

    PSAAraucariaTheme {
        Scaffold(topBar = { TopAppBar(title = { Text("Georreferenciamento") }) }) { padding ->
            Column(modifier = Modifier.fillMaxSize().padding(padding)) {
                Box(modifier = Modifier.weight(1f)) {
                    TreeMapView(
                        trees = state.trees,
                        onMapClick = { lat, lng -> viewModel.addTree(lat, lng) }
                    )
                }
                if (state.pendingTrees.isNotEmpty()) {
                    Card(modifier = Modifier.fillMaxWidth().padding(16.dp)) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Text("${state.pendingTrees.size} árvore(s) pendente(s) de sincronização", style = MaterialTheme.typography.bodyMedium)
                            Spacer(Modifier.height(8.dp))
                            Button(onClick = { viewModel.sync() }) { Text("Sincronizar") }
                        }
                    }
                }
            }
        }
    }
}
