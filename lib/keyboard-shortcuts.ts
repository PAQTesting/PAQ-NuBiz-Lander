import { useEffect } from "react"

export interface KeyboardShortcut {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  action: () => void
  description: string
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const ctrlMatch = shortcut.ctrl ? (e.ctrlKey || e.metaKey) : !e.ctrlKey && !e.metaKey
        const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey
        const altMatch = shortcut.alt ? e.altKey : !e.altKey

        if (
          e.key.toLowerCase() === shortcut.key.toLowerCase() &&
          ctrlMatch &&
          shiftMatch &&
          altMatch
        ) {
          e.preventDefault()
          shortcut.action()
          return
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [shortcuts])
}

export const DEFAULT_SHORTCUTS: KeyboardShortcut[] = [
  {
    key: "s",
    ctrl: true,
    description: "Save",
    action: () => {},
  },
  {
    key: "p",
    ctrl: true,
    description: "Preview",
    action: () => {},
  },
  {
    key: "e",
    ctrl: true,
    description: "Export",
    action: () => {},
  },
  {
    key: "z",
    ctrl: true,
    description: "Undo",
    action: () => {},
  },
  {
    key: "z",
    ctrl: true,
    shift: true,
    description: "Redo",
    action: () => {},
  },
]
