package com.psaaraucaria.data.local.dao

import androidx.room.*
import com.psaaraucaria.data.local.entity.TreeEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface TreeDao {
    @Query("SELECT * FROM trees WHERE contractId = :contractId ORDER BY localId DESC")
    fun findByContract(contractId: String): Flow<List<TreeEntity>>

    @Query("SELECT * FROM trees WHERE syncStatus = 'PENDING'")
    suspend fun getPendingSync(): List<TreeEntity>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(tree: TreeEntity): Long

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertBatch(trees: List<TreeEntity>)

    @Update
    suspend fun update(tree: TreeEntity)

    @Query("UPDATE trees SET syncStatus = 'SYNCED', remoteId = :remoteId WHERE localId = :localId")
    suspend fun markSynced(localId: Long, remoteId: String)

    @Query("SELECT COUNT(*) FROM trees WHERE contractId = :contractId")
    fun countByContract(contractId: String): Flow<Int>
}
