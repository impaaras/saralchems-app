package com.saralchems

import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(null) // Pass null to prevent state restoration
        window.statusBarColor = android.graphics.Color.parseColor("#3C5D87")
        window.setBackgroundDrawableResource(android.R.color.transparent)
    }

    override fun getMainComponentName(): String = "SaralChems"

    override fun createReactActivityDelegate(): ReactActivityDelegate =
        DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}