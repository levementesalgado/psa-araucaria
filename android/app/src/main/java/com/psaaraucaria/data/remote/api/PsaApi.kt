package com.psaaraucaria.data.remote.api

import retrofit2.Response
import retrofit2.http.*

data class LoginRequest(val email: String, val password: String)
data class LoginResponse(val accessToken: String, val refreshToken: String, val user: UserInfo)
data class UserInfo(val id: String, val name: String, val email: String)

data class TreeRequest(val contractId: String, val latitude: Double, val longitude: Double)
data class BatchTreeRequest(val trees: List<TreeBatchItem>)
data class TreeBatchItem(val contractId: String, val producerId: String, val latitude: Double, val longitude: Double)
data class ContractResponse(val id: String, val modality: String, val status: String, val producer: UserInfo)

interface PsaApi {
    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): LoginResponse

    @POST("auth/refresh")
    suspend fun refresh(@Body body: Map<String, String>): Map<String, String>

    @GET("contracts/active")
    suspend fun getActiveContracts(): List<ContractResponse>

    @GET("contracts/producer/{producerId}")
    suspend fun getContractsByProducer(@Path("producerId") producerId: String): List<ContractResponse>

    @GET("trees/contract/{contractId}")
    suspend fun getTreesByContract(@Path("contractId") contractId: String): List<TreeRequest>

    @POST("trees")
    suspend fun createTree(@Body tree: TreeRequest): Map<String, Any>

    @POST("trees/batch")
    suspend fun createBatch(@Body batch: BatchTreeRequest): Map<String, Any>

    @PUT("trees/{id}/verify")
    suspend fun verifyTree(@Path("id") id: String, @Body body: Map<String, String>): Map<String, Any>

    @Multipart
    @POST("media/upload")
    suspend fun uploadPhoto(@Part file: okhttp3.MultipartBody.Part): Map<String, String>

    @GET("payments/upcoming/{producerId}")
    suspend fun getUpcomingPayments(@Path("producerId") producerId: String): List<PaymentResponse>
}

data class PaymentResponse(val id: String, val parcel: String, val amount: Double, val dueDate: String, val status: String)
