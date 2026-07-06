package com.psaaraucaria.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import com.psaaraucaria.data.local.dao.TreeDao
import com.psaaraucaria.data.local.entity.ContractEntity
import com.psaaraucaria.data.local.entity.PhotoEntity
import com.psaaraucaria.data.local.entity.TreeEntity

@Database(entities = [TreeEntity::class, ContractEntity::class, PhotoEntity::class], version = 1)
abstract class AppDatabase : RoomDatabase() {
    abstract fun treeDao(): TreeDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getInstance(context: Context): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(context.applicationContext, AppDatabase::class.java, "psa_araucaria_db").build()
                INSTANCE = instance
                instance
            }
        }
    }
}
