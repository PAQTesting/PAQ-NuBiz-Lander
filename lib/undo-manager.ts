export class UndoManager<T> {
  private history: T[] = []
  private currentIndex: number = -1
  private maxHistory: number = 50

  constructor(initialState?: T, maxHistory: number = 50) {
    this.maxHistory = maxHistory
    if (initialState) {
      this.push(initialState)
    }
  }

  push(state: T): void {
    // Remove any states after current index
    this.history = this.history.slice(0, this.currentIndex + 1)
    
    // Add new state
    this.history.push(state)
    
    // Limit history size
    if (this.history.length > this.maxHistory) {
      this.history.shift()
    } else {
      this.currentIndex++
    }
  }

  undo(): T | null {
    if (this.canUndo()) {
      this.currentIndex--
      return this.history[this.currentIndex]
    }
    return null
  }

  redo(): T | null {
    if (this.canRedo()) {
      this.currentIndex++
      return this.history[this.currentIndex]
    }
    return null
  }

  canUndo(): boolean {
    return this.currentIndex > 0
  }

  canRedo(): boolean {
    return this.currentIndex < this.history.length - 1
  }

  getCurrent(): T | null {
    return this.history[this.currentIndex] || null
  }

  clear(): void {
    this.history = []
    this.currentIndex = -1
  }

  getHistorySize(): number {
    return this.history.length
  }
}
