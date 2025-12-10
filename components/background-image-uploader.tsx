"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, X, Loader2, AlertCircle } from "lucide-react"
import { compressImage } from "@/lib/image-compressor"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface BackgroundImageUploaderProps {
  open: boolean
  onClose: () => void
  onSave: (imageData: {
    backgroundImage: string
    backgroundFit: "cover" | "contain" | "fill"
    backgroundPosition: "center" | "top" | "bottom" | "left" | "right"
  }) => void
  currentImage?: string
  currentFit?: "cover" | "contain" | "fill"
  currentPosition?: "center" | "top" | "bottom" | "left" | "right"
}

export function BackgroundImageUploader({
  open,
  onClose,
  onSave,
  currentImage,
  currentFit = "cover",
  currentPosition = "center",
}: BackgroundImageUploaderProps) {
  const [imageData, setImageData] = useState<string>(currentImage || "")
  const [fit, setFit] = useState<"cover" | "contain" | "fill">(currentFit)
  const [position, setPosition] = useState<"center" | "top" | "bottom" | "left" | "right">(currentPosition)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file (JPG, PNG, etc.)")
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("Image size must be less than 10MB. Please choose a smaller image.")
      return
    }

    setIsUploading(true)
    setUploadError("")

    try {
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("Image processing timed out. Please try a smaller image.")), 30000)
      })

      const compressedBase64 = await Promise.race([compressImage(file, 1920, 0.7), timeoutPromise])

      setImageData(compressedBase64)
      setUploadError("")
    } catch (error) {
      console.error("Image compression failed:", error)
      setUploadError(
        error instanceof Error
          ? error.message
          : "Failed to process image. Please try a different file or a smaller image.",
      )
      setImageData("")
    } finally {
      setIsUploading(false)
    }
  }

  const handleSave = () => {
    if (!imageData) {
      setUploadError("Please select an image first")
      return
    }

    try {
      onSave({
        backgroundImage: imageData,
        backgroundFit: fit,
        backgroundPosition: position,
      })
      onClose()
    } catch (error) {
      setUploadError("Failed to save background. Please try again.")
    }
  }

  const handleClear = () => {
    setImageData("")
    setUploadError("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleClose = () => {
    if (!isUploading) {
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Custom Background Image</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* File Upload Section */}
          <div className="space-y-3">
            <Label>Select Image</Label>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex-1"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing image...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Image
                  </>
                )}
              </Button>
              {imageData && !isUploading && (
                <Button variant="outline" size="icon" onClick={handleClear}>
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />

            {uploadError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{uploadError}</AlertDescription>
              </Alert>
            )}

            <p className="text-xs text-muted-foreground">
              Recommended: 1920x1080px or larger. Max file size: 10MB. Images will be automatically optimized for web.
            </p>
          </div>

          {/* Preview Section */}
          {imageData && !isUploading && (
            <>
              <div className="space-y-3">
                <Label>Preview</Label>
                <div
                  className="w-full h-64 border rounded-lg overflow-hidden bg-gray-100"
                  style={{
                    backgroundImage: `url(${imageData})`,
                    backgroundSize: fit,
                    backgroundPosition: position,
                    backgroundRepeat: "no-repeat",
                  }}
                />
              </div>

              {/* Image Fit Controls */}
              <div className="space-y-3">
                <Label htmlFor="fit-select">Image Fit</Label>
                <Select value={fit} onValueChange={(value: "cover" | "contain" | "fill") => setFit(value)}>
                  <SelectTrigger id="fit-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cover">
                      <div>
                        <div className="font-medium">Cover</div>
                        <div className="text-xs text-muted-foreground">Fill entire area (may crop edges)</div>
                      </div>
                    </SelectItem>
                    <SelectItem value="contain">
                      <div>
                        <div className="font-medium">Contain</div>
                        <div className="text-xs text-muted-foreground">Show full image (may have gaps)</div>
                      </div>
                    </SelectItem>
                    <SelectItem value="fill">
                      <div>
                        <div className="font-medium">Fill</div>
                        <div className="text-xs text-muted-foreground">Stretch to fit exactly</div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Image Position Controls */}
              <div className="space-y-3">
                <Label htmlFor="position-select">Image Position</Label>
                <Select
                  value={position}
                  onValueChange={(value: "center" | "top" | "bottom" | "left" | "right") => setPosition(value)}
                >
                  <SelectTrigger id="position-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="top">Top</SelectItem>
                    <SelectItem value="bottom">Bottom</SelectItem>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Adjust how the image is positioned within the hero section
                </p>
              </div>

              {/* Tips */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-sm mb-2 text-blue-900">Tips for Best Results</h4>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li>Use high-resolution images for crisp display on all devices</li>
                  <li>Choose "Cover" for full-screen backgrounds without gaps</li>
                  <li>Choose "Contain" to ensure the entire image is visible</li>
                  <li>Adjust position to focus on important parts of your image</li>
                </ul>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isUploading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!imageData || isUploading}>
            {isUploading ? "Processing..." : "Save Background"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
