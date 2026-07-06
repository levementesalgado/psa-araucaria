package com.psaaraucaria.sync

import android.content.Context
import androidx.work.*
import com.psaaraucaria.data.local.AppDatabase
import com.psaaraucaria.data.remote.api.RetrofitClient
import com.psaaraucaria.data.remote.api.TreeBatchItem
import java.util.concurrent.TimeUnit

class SyncWorker(context: Context, params: WorkerParameters) : CoroutineWorker(context, params) {

    override suspend fun doWork(): Result {
        val db = AppDatabase.getInstance(applicationContext)
        val api = RetrofitClient.api
        val pendingTrees = db.treeDao().getPendingSync()

        if (pendingTrees.isEmpty()) return Result.success()

        try {
            val batch = pendingTrees.map { t ->
                TreeBatchItem(contractId = t.contractId, producerId = t.producerId, latitude = t.latitude, longitude = t.longitude)
            }

            val response = api.createBatch(BatchTreeRequest(batch))

            pendingTrees.forEach { tree ->
                db.treeDao().markSynced(tree.localId, tree.remoteId ?: "")
            }

            return Result.success()
        } catch (e: Exception) {
            return Result.retry()
        }
    }

    companion object {
        fun enqueue(context: Context) {
            val constraints = Constraints.Builder()
                .setRequiredNetworkType(NetworkType.CONNECTED)
                .build()

            val request = OneTimeWorkRequestBuilder<SyncWorker>()
                .setConstraints(constraints)
                .setBackoffCriteria(BackoffPolicy.EXPONENTIAL, 10, TimeUnit.SECONDS)
                .build()

            WorkManager.getInstance(context).enqueue(request)
        }
    }
}
