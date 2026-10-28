package expo.modules.backgroundremover

import expo.modules.kotlin.exception.CodedException
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

// TODO: ML Kit Subject Segmentation ile Android desteği. Şimdilik sadece iOS'ta çalışıyor.
class BackgroundRemoverModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("BackgroundRemover")

    Function("isSupported") { false }

    AsyncFunction("removeBackgroundAsync") { _: String ->
      throw CodedException("Arka plan silme Android'de henüz desteklenmiyor.")
    }
  }
}
