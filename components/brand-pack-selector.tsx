"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save, Package } from 'lucide-react'
import { useState, useEffect } from "react"
import type { CustomizationData } from "@/lib/types"

interface BrandPack {
  id: string
  name: string
  customization: CustomizationData
}

interface BrandPackSelectorProps {
  currentCustomization: CustomizationData
  onApply: (customization: CustomizationData) => void
  onSave: (name: string) => void
}

export function BrandPackSelector({ currentCustomization, onApply, onSave }: BrandPackSelectorProps) {
  const [open, setOpen] = useState(false)
  const [packs, setPacks] = useState<BrandPack[]>([])
  const [newPackName, setNewPackName] = useState("")

  useEffect(() => {
    const saved = localStorage.getItem("brandPacks")
    if (saved) {
      setPacks(JSON.parse(saved))
    }
  }, [open])

  const handleSave = () => {
    if (!newPackName.trim()) return

    const newPack: BrandPack = {
      id: Date.now().toString(),
      name: newPackName,
      customization: currentCustomization,
    }

    const updatedPacks = [...packs, newPack]
    setPacks(updatedPacks)
    localStorage.setItem("brandPacks", JSON.stringify(updatedPacks))
    setNewPackName("")
    onSave(newPackName)
  }

  const handleApply = (pack: BrandPack) => {
    onApply(pack.customization)
    setOpen(false)
  }

  const handleDelete = (id: string) => {
    const updatedPacks = packs.filter((p) => p.id !== id)
    setPacks(updatedPacks)
    localStorage.setItem("brandPacks", JSON.stringify(updatedPacks))
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outline" className="w-full">
        <Package className="w-4 h-4 mr-2" />
        Brand Packs
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Brand Packs</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Save current */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-semibold mb-3">Save Current Settings</h3>
              <div className="flex gap-2">
                <Input
                  placeholder="Brand pack name (e.g., Client A, Summer Theme)"
                  value={newPackName}
                  onChange={(e) => setNewPackName(e.target.value)}
                />
                <Button onClick={handleSave} disabled={!newPackName.trim()}>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>

            {/* Saved packs */}
            <div>
              <h3 className="font-semibold mb-3">Saved Brand Packs ({packs.length})</h3>
              {packs.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">
                  No brand packs saved yet. Save your current customization above.
                </p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-auto">
                  {packs.map((pack) => (
                    <div key={pack.id} className="border rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex gap-1">
                          <div
                            className="w-8 h-8 rounded border"
                            style={{ backgroundColor: pack.customization.primaryColor }}
                          />
                          <div
                            className="w-8 h-8 rounded border"
                            style={{ backgroundColor: pack.customization.secondaryColor }}
                          />
                        </div>
                        <div>
                          <div className="font-medium">{pack.name}</div>
                          <div className="text-xs text-gray-500">{pack.customization.fontFamily}</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleApply(pack)}>
                          Apply
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(pack.id)}>
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
