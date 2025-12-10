export async function compressImage(file: File, maxWidth = 1920, quality = 0.7): Promise<string> {
  return new Promise((resolve, reject) => {
    // Validate file size before processing
    if (file.size > 10 * 1024 * 1024) {
      reject(new Error("File size exceeds 10MB limit"))
      return
    }

    const reader = new FileReader()

    reader.onload = (e) => {
      const img = new Image()

      img.onload = () => {
        try {
          // Create canvas
          const canvas = document.createElement("canvas")
          let width = img.width
          let height = img.height

          // Calculate new dimensions
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }

          // Ensure dimensions are reasonable
          if (width > 2000 || height > 2000) {
            const scale = Math.min(2000 / width, 2000 / height)
            width = Math.floor(width * scale)
            height = Math.floor(height * scale)
          }

          canvas.width = width
          canvas.height = height

          // Draw and compress
          const ctx = canvas.getContext("2d", { alpha: false })
          if (!ctx) {
            reject(new Error("Failed to get canvas context"))
            return
          }

          // Use better image smoothing
          ctx.imageSmoothingEnabled = true
          ctx.imageSmoothingQuality = "high"

          ctx.drawImage(img, 0, 0, width, height)

          // Convert to base64 with compression
          const compressedBase64 = canvas.toDataURL("image/jpeg", quality)

          // Check if compressed size is reasonable (< 2MB base64)
          if (compressedBase64.length > 2 * 1024 * 1024) {
            // Try again with lower quality
            const lowerQualityBase64 = canvas.toDataURL("image/jpeg", 0.5)
            resolve(lowerQualityBase64)
          } else {
            resolve(compressedBase64)
          }

          // Clean up
          canvas.remove()
        } catch (error) {
          reject(new Error("Failed to compress image: " + (error as Error).message))
        }
      }

      img.onerror = () => reject(new Error("Failed to load image. Please try a different file."))

      const result = e.target?.result
      if (typeof result === "string") {
        img.src = result
      } else {
        reject(new Error("Failed to read file"))
      }
    }

    reader.onerror = () => reject(new Error("Failed to read file"))
    reader.readAsDataURL(file)
  })
}
