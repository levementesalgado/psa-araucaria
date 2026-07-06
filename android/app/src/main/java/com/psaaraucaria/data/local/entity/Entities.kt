package com.psaaraucaria.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "trees")
data class TreeEntity(
    @PrimaryKey(autoGenerate = true) val localId: Long = 0,
    val remoteId: String? = null,
    val contractId: String,
    val producerId: String,
    val latitude: Double,
    val longitude: Double,
    val plantedDate: String? = null,
    val photoPath: String? = null,
    val isVerified: Boolean = false,
    val syncStatus: String = "PENDING"
)

@Entity(tableName = "contracts")
data class ContractEntity(
    @PrimaryKey val id: String,
    val modality: String,
    val status: String,
    val producerName: String,
    val totalPaymentExpected: Double? = null
)

@Entity(tableName = "photos")
data class PhotoEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val treeLocalId: Long,
    val filePath: String,
    val syncStatus: String = "PENDING"
)
