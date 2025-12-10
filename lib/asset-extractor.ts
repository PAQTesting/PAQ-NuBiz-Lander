import { LandingPageData, TeamMember, CaseStudy } from "./types"

export interface Asset {
  id: string
  type: "image" | "video" | "document"
  data: string // base64 or URL
  filename: string
  mimeType: string
}

export interface AssetManifest {
  [key: string]: string // logical name -> file path
}

export class AssetExtractor {
  private assets: Map<string, Asset> = new Map()
  private assetCounter = 0

  async extractAssets(data: LandingPageData): Promise<{ assets: Asset[]; manifest: AssetManifest }> {
    this.assets.clear()
    this.assetCounter = 0

    // Extract logo
    if (data.customization?.logo) {
      await this.addAsset("logo", data.customization.logo, "image")
    }

    // Extract hero background
    if (data.hero?.backgroundImage) {
      await this.addAsset("heroBackground", data.hero.backgroundImage, "image")
    }

    // Extract hero video
    if (data.hero?.videoUrl) {
      await this.addAsset("heroVideo", data.hero.videoUrl, "video")
    }

    // Extract team member images
    if (data.team?.members) {
      for (let i = 0; i < data.team.members.length; i++) {
        const member = data.team.members[i]
        if (member.image) {
          await this.addAsset(`teamMember_${i}`, member.image, "image")
        }
      }
    }

    // Extract case study icons and documents
    if (data.caseStudies?.studies) {
      for (let i = 0; i < data.caseStudies.studies.length; i++) {
        const study = data.caseStudies.studies[i]
        if (study.icon) {
          await this.addAsset(`caseStudyIcon_${i}`, study.icon, "image")
        }
        if (study.documentUrl) {
          await this.addAsset(`caseStudyDoc_${i}`, study.documentUrl, "document")
        }
      }
    }

    // Extract surprise & delight image
    if (data.surpriseDelight?.imageUrl) {
      await this.addAsset("surpriseImage", data.surpriseDelight.imageUrl, "image")
    }

    // Extract pitch document
    if (data.pitch?.documentUrl) {
      await this.addAsset("pitchDocument", data.pitch.documentUrl, "document")
    }

    // Build manifest
    const manifest: AssetManifest = {}
    for (const [id, asset] of this.assets) {
      manifest[id] = `assets/${asset.type}s/${asset.filename}`
    }

    return {
      assets: Array.from(this.assets.values()),
      manifest,
    }
  }

  private async addAsset(logicalName: string, dataUrl: string, type: "image" | "video" | "document"): Promise<void> {
    if (!dataUrl) return

    try {
      const { bytes, mimeType, extension } = await this.extractAssetData(dataUrl)
      const hash = await this.hashBytes(bytes)
      const filename = `${hash}.${extension}`

      this.assets.set(logicalName, {
        id: logicalName,
        type,
        data: dataUrl,
        filename,
        mimeType,
      })
    } catch (error) {
      console.error(`Failed to extract asset ${logicalName}:`, error)
    }
  }

  private async extractAssetData(dataUrl: string): Promise<{ bytes: Uint8Array; mimeType: string; extension: string }> {
    // Handle base64 data URLs
    if (dataUrl.startsWith("data:")) {
      const matches = dataUrl.match(/^data:([^;]+);base64,(.+)$/)
      if (matches) {
        const mimeType = matches[1]
        const base64Data = matches[2]
        const bytes = this.base64ToBytes(base64Data)
        const extension = this.getExtensionFromMimeType(mimeType)
        return { bytes, mimeType, extension }
      }
    }

    // Handle external URLs - fetch them
    if (dataUrl.startsWith("http://") || dataUrl.startsWith("https://") || dataUrl.startsWith("/")) {
      const response = await fetch(dataUrl)
      const blob = await response.blob()
      const bytes = new Uint8Array(await blob.arrayBuffer())
      const mimeType = blob.type || this.detectMimeType(dataUrl)
      const extension = this.getExtensionFromMimeType(mimeType)
      return { bytes, mimeType, extension }
    }

    throw new Error(`Unsupported data URL format: ${dataUrl.substring(0, 50)}...`)
  }

  private base64ToBytes(base64: string): Uint8Array {
    const binaryString = atob(base64)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    return bytes
  }

  private bytesToBase64(bytes: Uint8Array): string {
    let binary = ""
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary)
  }

  private async hashBytes(bytes: Uint8Array): Promise<string> {
    const hashBuffer = await crypto.subtle.digest("SHA-1", bytes)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
    return hashHex.slice(0, 12)
  }

  private getExtensionFromMimeType(mimeType: string): string {
    const map: Record<string, string> = {
      "image/png": "png",
      "image/jpeg": "jpg",
      "image/jpg": "jpg",
      "image/gif": "gif",
      "image/webp": "webp",
      "image/svg+xml": "svg",
      "video/mp4": "mp4",
      "video/webm": "webm",
      "application/pdf": "pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
    }
    return map[mimeType] || "bin"
  }

  private detectMimeType(url: string): string {
    const ext = url.split(".").pop()?.toLowerCase()
    const map: Record<string, string> = {
      png: "image/png",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      gif: "image/gif",
      webp: "image/webp",
      svg: "image/svg+xml",
      mp4: "video/mp4",
      webm: "video/webm",
      pdf: "application/pdf",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    }
    return map[ext || ""] || "application/octet-stream"
  }

  bytesFromDataUrl(dataUrl: string): Uint8Array {
    if (dataUrl.startsWith("data:")) {
      const base64Data = dataUrl.split(",")[1]
      return this.base64ToBytes(base64Data)
    }
    return new Uint8Array()
  }
}
