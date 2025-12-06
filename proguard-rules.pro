# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.

# Keep React Native classes
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.jni.** { *; }

# Keep Expo modules
-keep class expo.modules.** { *; }
-keep class org.unimodules.** { *; }

# Keep Supabase classes
-keep class io.supabase.** { *; }
-keep class com.supabase.** { *; }
-dontwarn io.supabase.**
-dontwarn com.supabase.**

# Keep React Native URL polyfill
-keep class com.github.kevinsawicki.** { *; }

# Keep AsyncStorage
-keep class com.reactnativecommunity.asyncstorage.** { *; }

# Keep SecureStore
-keep class expo.modules.securestore.** { *; }

# Keep Local Authentication
-keep class expo.modules.localauthentication.** { *; }

# Keep Image Picker
-keep class expo.modules.imagepicker.** { *; }

# Keep Gesture Handler
-keep class com.swmansion.gesturehandler.** { *; }
-keep class com.swmansion.reanimated.** { *; }

# Keep Safe Area Context
-keep class com.th3rdwave.safeareacontext.** { *; }

# Keep Screens
-keep class com.swmansion.rnscreens.** { *; }

# Keep NetInfo
-keep class com.reactnativecommunity.netinfo.** { *; }
-dontwarn com.reactnativecommunity.netinfo.**

# Keep Hermes
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }

# Keep native methods
-keepclasseswithmembernames class * {
    native <methods>;
}

# Keep JavaScript interface
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Keep Parcelable implementations
-keepclassmembers class * implements android.os.Parcelable {
    public static final android.os.Parcelable$Creator CREATOR;
}

# Keep Serializable classes
-keepclassmembers class * implements java.io.Serializable {
    static final long serialVersionUID;
    private static final java.io.ObjectStreamField[] serialPersistentFields;
    private void writeObject(java.io.ObjectOutputStream);
    private void readObject(java.io.ObjectInputStream);
    java.lang.Object writeReplace();
    java.lang.Object readResolve();
}

# Keep annotations
-keepattributes *Annotation*
-keepattributes Signature
-keepattributes Exceptions
-keepattributes InnerClasses
-keepattributes EnclosingMethod

# Keep line numbers for debugging
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# Keep native method names
-keepclasseswithmembernames,includedescriptorclasses class * {
    native <methods>;
}

# Keep JavaScript interface
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Remove logging in release
-assumenosideeffects class android.util.Log {
    public static *** d(...);
    public static *** v(...);
    public static *** i(...);
}

# Keep custom exceptions
-keep public class * extends java.lang.Exception

# Keep React Native classes
-keep,allowobfuscation @interface com.facebook.proguard.annotations.DoNotStrip
-keep,allowobfuscation @interface com.facebook.proguard.annotations.KeepGettersAndSetters
-keep @com.facebook.proguard.annotations.DoNotStrip class *
-keepclassmembers class * {
    @com.facebook.proguard.annotations.DoNotStrip *;
}
-keepclassmembers @com.facebook.proguard.annotations.KeepGettersAndSetters class * {
    void set*(***);
    *** get*();
}

# Keep React Native bridge
-keepclassmembers class * {
    @com.facebook.react.bridge.ReactMethod *;
}

# Keep React Native view managers
-keep class * extends com.facebook.react.uimanager.ViewManager {
    public <init>(...);
}

# Keep React Native modules
-keep class * extends com.facebook.react.bridge.ReactContextBaseJavaModule {
    public <init>(...);
}

# Keep React Native packages
-keep class * implements com.facebook.react.ReactPackage {
    public <init>(...);
}

# Keep Hermes
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }

# Keep Expo modules
-keep class expo.modules.core.** { *; }
-keep class expo.modules.core.interfaces.** { *; }

# Keep all native methods
-keepclasseswithmembernames class * {
    native <methods>;
}

# Keep JavaScript interface
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Keep Parcelable implementations
-keepclassmembers class * implements android.os.Parcelable {
    public static final android.os.Parcelable$Creator CREATOR;
}

# Keep Serializable classes
-keepclassmembers class * implements java.io.Serializable {
    static final long serialVersionUID;
    private static final java.io.ObjectStreamField[] serialPersistentFields;
    private void writeObject(java.io.ObjectOutputStream);
    private void readObject(java.io.ObjectInputStream);
    java.lang.Object writeReplace();
    java.lang.Object readResolve();
}

# Keep annotations
-keepattributes *Annotation*
-keepattributes Signature
-keepattributes Exceptions
-keepattributes InnerClasses
-keepattributes EnclosingMethod

# Keep line numbers for debugging
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

