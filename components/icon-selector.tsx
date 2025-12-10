"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Check } from "lucide-react"
import { ICON_LIST } from "@/lib/icon-list"

interface IconSelectorProps {
  open: boolean
  onClose: () => void
  onSelect: (iconPath: string) => void
  selectedIcon?: string
}

export function IconSelector({ open, onClose, onSelect, selectedIcon }: IconSelectorProps) {
  const [filteredIcons, setFilteredIcons] = useState(ICON_LIST)
  const [searchQuery, setSearchQuery] = useState("")
  const [selected, setSelected] = useState<string>(selectedIcon || "")

  useEffect(() => {
    if (searchQuery) {
      setFilteredIcons(ICON_LIST.filter((icon) => icon.name.toLowerCase().includes(searchQuery.toLowerCase())))
    } else {
      setFilteredIcons(ICON_LIST)
    }
  }, [searchQuery])

  const handleSelect = () => {
    if (selected) {
      onSelect(`/icons/${selected}`)
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Select Icon</DialogTitle>
          <DialogDescription>Choose an icon for your case study</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Input placeholder="Search icons..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />

          <ScrollArea className="h-[400px]">
            <div className="grid grid-cols-4 gap-4 pr-4">
              {filteredIcons.map((icon) => (
                <div
                  key={icon.file}
                  className={`flex flex-col items-center gap-2 p-4 border rounded-lg cursor-pointer transition-colors relative ${
                    selected === icon.file ? "border-primary bg-accent" : "hover:bg-accent"
                  }`}
                  onClick={() => setSelected(icon.file)}
                >
                  <div className="w-12 h-12 flex items-center justify-center">
                    <img
                      // Updated icons path
                      src={`/icons/${icon.file}`}
                      alt={icon.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        // Fallback to placeholder if icon doesn't load
                        e.currentTarget.src = "/placeholder.svg?height=48&width=48"
                      }}
                    />
                  </div>
                  <span className="text-xs text-center line-clamp-2">{icon.name}</span>
                  {selected === icon.file && <Check className="w-4 h-4 text-primary absolute top-2 right-2" />}
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSelect} disabled={!selected}>
              Select Icon
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
