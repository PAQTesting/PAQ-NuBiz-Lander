"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { compressImage } from "@/lib/image-compressor"

interface FileUploadProps {
  label?: string
  value: string
  onChange: (value: string) => void
  accept?: string
  helpText?: string
  placeholder?: string
  onFileNameChange?: (name: string) => void
}

export function FileUpload({
  label,
  value,
  onChange,
  accept = "image/*",
  helpText,
  placeholder = "Upload file or enter URL",
  onFileNameChange,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      if (onFileNameChange) {
        onFileNameChange(file.name)
      }

      if (file.type.startsWith("image/")) {
        try {
          const compressedBase64 = await compressImage(file, 1920, 0.85)
          onChange(compressedBase64)
          setIsUploading(false)
          return
        } catch (error) {
          console.error("Image compression failed, using original:", error)
          // Fall back to original method if compression fails
        }
      }

      // Convert to base64 (for non-images or if compression failed)
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        onChange(base64String)
        setIsUploading(false)
      }
      reader.onerror = () => {
        setIsUploading(false)
        alert("Failed to upload file")
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error("File upload error:", error)
      setIsUploading(false)
      alert("Failed to upload file")
    }
  }

  const handleClear = () => {
    onChange("")
    if (onFileNameChange) {
      onFileNameChange("")
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-3">
      {label && <Label>{label}</Label>}
      {helpText && <p className="text-sm text-muted-foreground">{helpText}</p>}

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload File</TabsTrigger>
          <TabsTrigger value="url">Use URL</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-3">
          <div className="flex gap-2">
            <Input
              ref={fileInputRef}
              type="file"
              accept={accept}
              onChange={handleFileUpload}
              disabled={isUploading}
              className="flex-1"
            />
            {value && (
              <Button variant="outline" size="icon" onClick={handleClear} disabled={isUploading}>
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
          {isUploading && (
            <p className="text-sm text-muted-foreground">
              {accept?.includes("image") ? "Compressing and uploading..." : "Uploading..."}
            </p>
          )}
        </TabsContent>

        <TabsContent value="url" className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={value && value.startsWith("data:") ? "" : value || ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="flex-1"
            />
            {value && (
              <Button variant="outline" size="icon" onClick={handleClear}>
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {value && (
        <div className="mt-2">
          {accept?.includes("image") && (
            <img
              src={value || "/placeholder.svg"}
              alt="Preview"
              className="max-w-xs h-32 object-cover rounded-lg border"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg"
              }}
            />
          )}
          {accept?.includes("video") && <video src={value} className="max-w-xs h-32 rounded-lg border" controls />}
          {(accept?.includes("pdf") || accept?.includes("doc") || accept?.includes("ppt")) && value && (
            <div className="p-4 border rounded-lg bg-muted">
              <p className="text-sm font-medium">Document uploaded</p>
              <p className="text-xs text-muted-foreground mt-1">Preview will be available in the exported site</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
