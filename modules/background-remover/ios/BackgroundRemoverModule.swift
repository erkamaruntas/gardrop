import ExpoModulesCore
import UIKit
import Vision

public class BackgroundRemoverModule: Module {
  public func definition() -> ModuleDefinition {
    Name("BackgroundRemover")

    /// Vision'ın nesne maskesi iOS 17+ ve gerçek cihaz (Neural Engine) gerektirir.
    Function("isSupported") { () -> Bool in
      #if targetEnvironment(simulator)
      return false
      #else
      if #available(iOS 17.0, *) { return true }
      return false
      #endif
    }

    /// Görseldeki ana nesneyi keser; şeffaf arka planlı, nesneye kırpılmış bir PNG'nin file:// URI'sini döner.
    AsyncFunction("removeBackgroundAsync") { (uri: URL) -> String in
      guard #available(iOS 17.0, *) else {
        throw UnsupportedException()
      }
      return try SubjectCutout.cutout(imageAt: uri).absoluteString
    }
  }
}

@available(iOS 17.0, *)
enum SubjectCutout {
  /// Büyük fotoğraflar hem yavaş işlenir hem de devasa PNG üretir; uzun kenar bununla sınırlanır.
  static let maxDimension: CGFloat = 1600

  static func cutout(imageAt url: URL) throws -> URL {
    guard let original = UIImage(contentsOfFile: url.path) else {
      throw ImageLoadException(url.absoluteString)
    }
    guard let input = normalized(original).cgImage else {
      throw ImageLoadException(url.absoluteString)
    }

    let request = VNGenerateForegroundInstanceMaskRequest()
    let handler = VNImageRequestHandler(cgImage: input, orientation: .up)
    try handler.perform([request])

    guard let observation = request.results?.first, !observation.allInstances.isEmpty else {
      throw NoSubjectException()
    }

    let masked = try observation.generateMaskedImage(
      ofInstances: observation.allInstances,
      from: handler,
      croppedToInstancesExtent: true
    )

    let ciImage = CIImage(cvPixelBuffer: masked)
    guard
      let cgImage = CIContext().createCGImage(ciImage, from: ciImage.extent),
      let png = UIImage(cgImage: cgImage).pngData()
    else {
      throw EncodingException()
    }

    let output = FileManager.default.temporaryDirectory
      .appendingPathComponent("cutout-\(UUID().uuidString)")
      .appendingPathExtension("png")
    try png.write(to: output)
    return output
  }

  /// EXIF yönünü piksellere uygular ve görseli küçültür; Vision'a her zaman dik (.up) bir görsel gider.
  private static func normalized(_ image: UIImage) -> UIImage {
    let longest = max(image.size.width, image.size.height)
    let scale = min(1, maxDimension / longest)
    let size = CGSize(width: image.size.width * scale, height: image.size.height * scale)

    let format = UIGraphicsImageRendererFormat.default()
    format.scale = 1
    return UIGraphicsImageRenderer(size: size, format: format).image { _ in
      image.draw(in: CGRect(origin: .zero, size: size))
    }
  }
}

final class UnsupportedException: Exception {
  override var reason: String {
    "Arka plan silme bu cihazda desteklenmiyor (iOS 17+ gerekli)."
  }
}

final class ImageLoadException: GenericException<String> {
  override var reason: String {
    "Görsel okunamadı: \(param)"
  }
}

final class NoSubjectException: Exception {
  override var reason: String {
    "Fotoğrafta belirgin bir nesne bulunamadı."
  }
}

final class EncodingException: Exception {
  override var reason: String {
    "Kesilmiş görsel kaydedilemedi."
  }
}
