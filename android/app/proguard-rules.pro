# -----------------------------
# React Native / Hermes support
# -----------------------------

# Keep all Hermes classes (avoid breaking JS engine)
-dontwarn com.facebook.hermes.**
-keep class com.facebook.hermes.** { *; }

# Keep core React Native classes
-keep class com.facebook.react.** { *; }
-dontwarn com.facebook.react.**

# Keep JNI (Java Native Interface) code
-keep class com.facebook.jni.** { *; }
-dontwarn com.facebook.jni.**

# Keep native methods used by the app
-keepclassmembers class * {
    native <methods>;
}

# Keep required members used by reflection
-keepclassmembers class * {
    @com.facebook.react.uimanager.annotations.ReactProp <methods>;
}
-keepclassmembers class * {
    @com.facebook.react.uimanager.annotations.ReactPropGroup <methods>;
}

# Keep React Native's MainActivity & MainApplication (or your custom names)
-keep class com.saralchems.MainActivity { *; }
-keep class com.saralchems.MainApplication { *; }

# -----------------------------
# General Optimizations
# -----------------------------

# Strip logging (optional, reduces size)
-assumenosideeffects class android.util.Log {
    public static *** d(...);
    public static *** v(...);
    public static *** i(...);
    public static *** w(...);
    public static *** e(...);
}

# Keep Kotlin metadata if you use Kotlin
-keep class kotlin.Metadata { *; }

# -----------------------------
# Optional: react-native-vector-icons
# -----------------------------
-keep class com.oblador.vectoricons.** { *; }
-dontwarn com.oblador.vectoricons.**

# -----------------------------
# Optional: Firebase (add if used)
# -----------------------------
# -keep class com.google.firebase.** { *; }
# -dontwarn com.google.firebase.**

# -----------------------------
# Optional: Add libraries you use
# -----------------------------
# Example for Glide:
# -keep class com.bumptech.glide.** { *; }
# -dontwarn com.bumptech.glide.**

# Example for Retrofit:
# -keep class retrofit2.** { *; }
# -dontwarn retrofit2.**

# -----------------------------
# Catch-all rules (safe)
# -----------------------------
-dontwarn okhttp3.**
-dontwarn okio.**
-dontwarn javax.annotation.Nullable
-dontwarn javax.annotation.ParametersAreNonnullByDefault
