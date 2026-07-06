package com.psaaraucaria.ui.screens

import android.content.Context
import android.location.Location
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.google.android.gms.location.LocationServices
import com.psaaraucaria.data.local.AppDatabase
import com.psaaraucaria.data.local.entity.TreeEntity
import com.psaaraucaria.sync.SyncWorker
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

data class MapUiState(
    val trees: List<TreeEntity> = emptyList(),
    val pendingTrees: List<TreeEntity> = emptyList(),
    val currentLocation: Location? = null
)

class MapViewModel : ViewModel() {
    private val _state = MutableStateFlow(MapUiState())
    val state: StateFlow<MapUiState> = _state.asStateFlow()

    private var db: AppDatabase? = null
    private var contractId: String = ""

    fun init(database: AppDatabase, contractId: String) {
        this.db = database
        this.contractId = contractId
        viewModelScope.launch {
            database.treeDao().findByContract(contractId).collect { trees ->
                _state.update { it.copy(trees = trees, pendingTrees = trees.filter { t -> t.syncStatus == "PENDING" }) }
            }
        }
    }

    fun requestLocation(context: Context) {
        try {
            val client = LocationServices.getFusedLocationProviderClient(context)
            client.lastLocation.addOnSuccessListener { loc ->
                _state.update { it.copy(currentLocation = loc) }
            }
        } catch (_: Exception) {}
    }

    fun addTree(latitude: Double, longitude: Double) {
        viewModelScope.launch {
            db?.treeDao()?.insert(
                TreeEntity(contractId = contractId, producerId = "", latitude = latitude, longitude = longitude)
            )
        }
    }

    fun sync() {
        db?.let { SyncWorker.enqueue(it) }
    }
}
