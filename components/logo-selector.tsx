"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check } from "lucide-react"
import { FileUpload } from "@/components/file-upload"

interface LogoSelectorProps {
  open: boolean
  onClose: () => void
  onSelect: (logoPath: string) => void
  currentLogo?: string
}

const presetLogos = [
  { name: "Full Color", path: "/logos/precision-aq-logo-full-color.png" },
  { name: "White", path: "/logos/precision-aq-logo-white.png" },
]

export function LogoSelector({ open, onClose, onSelect, currentLogo }: LogoSelectorProps) {
  const [selected, setSelected] = useState<string>(currentLogo || "")
  const [customLogo, setCustomLogo] = useState<string>("")

  const handleSelect = () => {
    if (selected) {
      onSelect(selected)
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Select Logo</DialogTitle>
          <DialogDescription>Choose from preset logos or upload your own</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="preset" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preset">Preset Logos</TabsTrigger>
            <TabsTrigger value="custom">Upload Custom</TabsTrigger>
          </TabsList>

          <TabsContent value="preset" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {presetLogos.map((logo) => (
                <div
                  key={logo.path}
                  className={`relative p-6 border-2 rounded-lg cursor-pointer transition-colors ${
                    selected === logo.path ? "border-primary bg-accent" : "hover:bg-accent"
                  }`}
                  onClick={() => setSelected(logo.path)}
                >
                  <div className="flex items-center justify-center h-24 bg-white rounded">
                    <img
                      src={logo.path || "/placeholder.svg"}
                      alt={logo.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <p className="text-sm text-center mt-2 font-medium">{logo.name}</p>
                  {selected === logo.path && <Check className="w-5 h-5 text-primary absolute top-2 right-2" />}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="custom" className="space-y-4">
            <FileUpload
              label="Upload Logo"
              accept="image/*"
              value={customLogo}
              onChange={(value) => {
                setCustomLogo(value)
                setSelected(value)
              }}
            />
            {customLogo && (
              <div className="p-6 border rounded-lg bg-white">
                <img
                  src={customLogo || "/placeholder.svg"}
                  alt="Custom logo"
                  className="max-h-32 mx-auto object-contain"
                />
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSelect} disabled={!selected}>
            Select Logo
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
