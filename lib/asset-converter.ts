export class AssetConverter {
  private cache = new Map<string, string>()

  async convertToBase64(url: string): Promise<string> {
    if (!url) return ""

    // Check cache first
    if (this.cache.has(url)) {
      return this.cache.get(url)!
    }

    // Already base64
    if (url.startsWith("data:")) {
      return url
    }

    // External URL or relative path - fetch and convert
    try {
      const response = await fetch(url)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const blob = await response.blob()
      const base64 = await this.blobToBase64(blob)
      this.cache.set(url, base64)
      return base64
    } catch (error) {
      console.error("Failed to convert asset:", url, error)
      // Return placeholder for images, original URL for others
      return url.includes("/bios/") || url.includes("/icons/") ? "/placeholder.svg" : url
    }
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }

  async processLandingPageData(data: any): Promise<any> {
    const processed = { ...data }

    // Convert logo
    if (processed.customization?.logo) {
      processed.customization.logo = await this.convertToBase64(processed.customization.logo)
    }

    // Convert hero background
    if (processed.hero?.backgroundImage) {
      processed.hero.backgroundImage = await this.convertToBase64(processed.hero.backgroundImage)
    }

    // Convert hero video
    if (processed.hero?.videoUrl) {
      processed.hero.videoUrl = await this.convertToBase64(processed.hero.videoUrl)
    }

    // Convert team member images
    if (processed.team?.members) {
      processed.team.members = await Promise.all(
        processed.team.members.map(async (member: any) => ({
          ...member,
          image: await this.convertToBase64(member.image),
        })),
      )
    }

    // Convert case study icons and documents
    if (processed.caseStudies?.studies) {
      processed.caseStudies.studies = await Promise.all(
        processed.caseStudies.studies.map(async (study: any) => ({
          ...study,
          icon: study.icon ? await this.convertToBase64(study.icon) : "",
          documentUrl: study.documentUrl ? await this.convertToBase64(study.documentUrl) : "",
        })),
      )
    }

    // Convert surprise & delight image
    if (processed.surpriseDelight?.imageUrl) {
      processed.surpriseDelight.imageUrl = await this.convertToBase64(processed.surpriseDelight.imageUrl)
    }

    // Convert pitch document
    if (processed.pitch?.documentUrl) {
      processed.pitch.documentUrl = await this.convertToBase64(processed.pitch.documentUrl)
    }

    return processed
  }
}
