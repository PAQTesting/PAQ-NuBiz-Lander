"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { History, RotateCcw, Trash2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import type { LandingPageData } from "@/lib/types"

interface Version {
  id: string
  timestamp: number
  data: LandingPageData
  label?: string
}

interface VersionHistoryDialogProps {
  open: boolean
  onClose: () => void
  onRestore: (data: LandingPageData) => void
}

export function VersionHistoryDialog({ open, onClose, onRestore }: VersionHistoryDialogProps) {
  const [versions, setVersions] = useState<Version[]>([])

  useEffect(() => {
    if (open) {
      try {
        const saved = localStorage.getItem("landing-page-versions")
        if (saved) {
          const parsedVersions = JSON.parse(saved)
          setVersions(parsedVersions)
        }
      } catch (e) {
        console.error("Failed to load versions:", e)
        localStorage.removeItem("landing-page-versions")
        setVersions([])
      }
    }
  }, [open])

  const handleRestore = (version: Version) => {
    if (confirm("Are you sure you want to restore this version? Current changes will be saved as a new version.")) {
      onRestore(version.data)
      onClose()
    }
  }

  const handleDelete = (versionId: string) => {
    if (confirm("Are you sure you want to delete this version?")) {
      const updated = versions.filter((v) => v.id !== versionId)
      setVersions(updated)
      try {
        localStorage.setItem("landing-page-versions", JSON.stringify(updated))
      } catch (e) {
        console.error("Failed to save versions:", e)
      }
    }
  }

  const handleClearAll = () => {
    if (confirm("Are you sure you want to delete all version history? This cannot be undone.")) {
      setVersions([])
      localStorage.removeItem("landing-page-versions")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Version History
          </DialogTitle>
          <DialogDescription>
            Restore previous versions of your landing page. Only the last 5 versions are kept to save storage space.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[400px] pr-4">
          {versions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No version history yet</p>
              <p className="text-sm mt-2">Versions are created automatically when you save</p>
            </div>
          ) : (
            <div className="space-y-2">
              {versions.map((version) => (
                <div key={version.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium">{version.label || "Auto-save"}</div>
                      <div className="text-sm text-gray-500">
                        {formatDistanceToNow(version.timestamp, { addSuffix: true })}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">{new Date(version.timestamp).toLocaleString()}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleRestore(version)}>
                        <RotateCcw className="w-4 h-4 mr-1" />
                        Restore
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(version.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="flex justify-between">
          {versions.length > 0 && (
            <Button variant="destructive" size="sm" onClick={handleClearAll}>
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All History
            </Button>
          )}
          <div className="flex-1" />
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
