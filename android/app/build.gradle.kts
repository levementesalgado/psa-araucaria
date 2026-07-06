plugins {
  id("com.android.application")
  id("org.jetbrains.kotlin.android")
  id("com.google.devtools.ksp")
}

android {
  namespace = "com.psaaraucaria"
  compileSdk = 34

  defaultConfig {
    applicationId = "com.psaaraucaria"
    minSdk = 26
    targetSdk = 34
    versionCode = 1
    versionName = "1.0"
  }

  buildFeatures {
    compose = true
  }

  composeOptions {
    kotlinCompilerExtensionVersion = "1.5.5"
  }

  kotlinOptions {
    jvmTarget = "17"
  }
}

dependencies {
  implementation(platform("androidx.compose:compose-bom:2024.01.00"))
  implementation("androidx.compose.ui:ui")
  implementation("androidx.compose.material3:material3")
  implementation("androidx.compose.ui:ui-tooling-preview")
  implementation("androidx.activity:activity-compose:1.8.2")
  implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.7.0")
  implementation("androidx.navigation:navigation-compose:2.7.6")

  // Room
  implementation("androidx.room:room-runtime:2.6.1")
  implementation("androidx.room:room-ktx:2.6.1")
  ksp("androidx.room:room-compiler:2.6.1")

  // Retrofit
  implementation("com.squareup.retrofit2:retrofit:2.9.0")
  implementation("com.squareup.retrofit2:converter-gson:2.9.0")
  implementation("com.squareup.okhttp3:logging-interceptor:4.12.0")

  // WorkManager
  implementation("androidx.work:work-runtime-ktx:2.9.0")

  // CameraX
  implementation("androidx.camera:camera-core:1.3.1")
  implementation("androidx.camera:camera-camera2:1.3.1")
  implementation("androidx.camera:camera-lifecycle:1.3.1")
  implementation("androidx.camera:camera-view:1.3.1")

  // Mapbox
  implementation("org.maplibre.gl:android-sdk:10.2.0")
  implementation("org.maplibre.gl:android-plugin-annotation-v9:1.0.0")
}
