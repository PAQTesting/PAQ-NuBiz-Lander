export class StorageManager {
  private static readonly MAX_SIZE = 4 * 1024 * 1024 // 4MB limit
  private static readonly STORAGE_KEY = "landing-page-data"
  private static readonly VERSION_KEY = "landing-page-versions"

  static async save(data: any): Promise<void> {
    try {
      const serialized = JSON.stringify(data)
      
      // Check size before saving
      if (serialized.length > this.MAX_SIZE) {
        throw new Error("Data exceeds storage limit (4MB)")
      }

      localStorage.setItem(this.STORAGE_KEY, serialized)
    } catch (error) {
      if (error instanceof Error && error.name === "QuotaExceededError") {
        // Clear old versions and try again
        this.clearVersionHistory()
        try {
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data))
        } catch {
          throw new Error("Storage quota exceeded. Please export your data and clear browser storage.")
        }
      } else {
        throw error
      }
    }
  }

  static load(): any | null {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error("Failed to load data:", error)
      return null
    }
  }

  static clearVersionHistory(): void {
    try {
      localStorage.removeItem(this.VERSION_KEY)
    } catch (error) {
      console.error("Failed to clear version history:", error)
    }
  }

  static getStorageUsage(): { used: number; max: number; percentage: number } {
    let used = 0
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += localStorage[key].length + key.length
      }
    }
    const max = 10 * 1024 * 1024 // Estimate 10MB
    return { used, max, percentage: (used / max) * 100 }
  }
}
