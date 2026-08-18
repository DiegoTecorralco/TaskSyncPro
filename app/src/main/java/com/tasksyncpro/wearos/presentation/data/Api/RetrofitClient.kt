package com.tasksyncpro.wearos.presentation.data.api

import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object RetrofitClient {

    private val retrofit: Retrofit by lazy {

        Retrofit.Builder()
            .baseUrl(ApiConfig.BASE_URL)
            .addConverterFactory(
                GsonConverterFactory.create()
            )
            .build()
    }

    val api: TaskSyncApi by lazy {

        retrofit.create(
            TaskSyncApi::class.java
        )
    }
}