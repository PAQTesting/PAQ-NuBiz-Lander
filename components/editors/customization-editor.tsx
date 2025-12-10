"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { CustomizationData } from "@/lib/types"
import { InfoButton } from "@/components/info-button"
import { LogoSelector } from "@/components/logo-selector"
import { BrandPackSelector } from "@/components/brand-pack-selector"

interface CustomizationEditorProps {
  data: CustomizationData
  onChange: (data: CustomizationData) => void
}

const brandThemes = {
  default: {
    name: "Precision AQ Default",
    primaryColor: "#cb009f",
    secondaryColor: "#850064",
    accentColor: "#0f1822",
  },
  vibrant: {
    name: "Vibrant Magenta",
    primaryColor: "#cb009f",
    secondaryColor: "#00d4aa",
    accentColor: "#0f1822",
  },
  professional: {
    name: "Professional Dark",
    primaryColor: "#850064",
    secondaryColor: "#cb009f",
    accentColor: "#0f1822",
  },
  modern: {
    name: "Modern Accent",
    primaryColor: "#cb009f",
    secondaryColor: "#4a90e2",
    accentColor: "#2d3748",
  },
}

export function CustomizationEditor({ data, onChange }: CustomizationEditorProps) {
  const [logoSelectorOpen, setLogoSelectorOpen] = useState(false)

  const updateField = (field: keyof CustomizationData, value: string) => {
    onChange({ ...data, [field]: value })
  }

  const applyTheme = (themeKey: string) => {
    const theme = brandThemes[themeKey as keyof typeof brandThemes]
    if (theme) {
      onChange({
        ...data,
        theme: themeKey,
        primaryColor: theme.primaryColor,
        secondaryColor: theme.secondaryColor,
        accentColor: theme.accentColor,
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Label>Brand Themes</Label>
          <InfoButton content="Pre-built color schemes based on Precision AQ brand guidelines." />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(brandThemes).map(([key, theme]) => (
            <Button
              key={key}
              variant={data.theme === key ? "default" : "outline"}
              onClick={() => applyTheme(key)}
              className="h-auto py-3 flex flex-col items-start"
            >
              <span className="font-semibold text-sm">{theme.name}</span>
              <div className="flex gap-1 mt-2">
                <div className="w-6 h-6 rounded border" style={{ backgroundColor: theme.primaryColor }} />
                <div className="w-6 h-6 rounded border" style={{ backgroundColor: theme.secondaryColor }} />
                <div className="w-6 h-6 rounded border" style={{ backgroundColor: theme.accentColor }} />
              </div>
            </Button>
          ))}
        </div>
      </div>

      <div className="border-t pt-6">
        <div className="flex items-center gap-2 mb-2">
          <Label>Brand Packs</Label>
          <InfoButton content="Save and reuse your custom color combinations for different clients or projects." />
        </div>
        <BrandPackSelector
          currentCustomization={data}
          onApply={(customization) => onChange(customization)}
          onSave={(name) => {
            // Toast notification handled inside BrandPackSelector
          }}
        />
      </div>

      <div className="border-t pt-6">
        <h3 className="font-semibold mb-4">Custom Colors</h3>

        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Label htmlFor="primary-color">Primary Color</Label>
              <InfoButton content="Main brand color (Vivid Magenta #cb009f recommended)." />
            </div>
            <div className="flex gap-2">
              <Input
                id="primary-color"
                type="color"
                value={data.primaryColor}
                onChange={(e) => updateField("primaryColor", e.target.value)}
                className="w-20 h-10"
              />
              <Input
                value={data.primaryColor}
                onChange={(e) => updateField("primaryColor", e.target.value)}
                placeholder="#cb009f"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Label htmlFor="secondary-color">Secondary Color</Label>
              <InfoButton content="Supporting color (Aubergine #850064 recommended)." />
            </div>
            <div className="flex gap-2">
              <Input
                id="secondary-color"
                type="color"
                value={data.secondaryColor}
                onChange={(e) => updateField("secondaryColor", e.target.value)}
                className="w-20 h-10"
              />
              <Input
                value={data.secondaryColor}
                onChange={(e) => updateField("secondaryColor", e.target.value)}
                placeholder="#850064"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Label htmlFor="accent-color">Accent Color</Label>
              <InfoButton content="Accent color for text and details (Midnight Black #0f1822 recommended)." />
            </div>
            <div className="flex gap-2">
              <Input
                id="accent-color"
                type="color"
                value={data.accentColor}
                onChange={(e) => updateField("accentColor", e.target.value)}
                className="w-20 h-10"
              />
              <Input
                value={data.accentColor}
                onChange={(e) => updateField("accentColor", e.target.value)}
                placeholder="#0f1822"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <div className="flex items-center gap-2 mb-2">
          <Label>Logo</Label>
          <InfoButton content="Select from approved Precision AQ logos or upload your own." />
        </div>
        <div className="flex items-center gap-4">
          {data.logo && (
            <div className="w-32 h-16 border rounded flex items-center justify-center bg-white p-2">
              <img src={data.logo || "/placeholder.svg"} alt="Logo" className="max-w-full max-h-full object-contain" />
            </div>
          )}
          <Button variant="outline" onClick={() => setLogoSelectorOpen(true)}>
            {data.logo ? "Change Logo" : "Select Logo"}
          </Button>
        </div>
      </div>

      <div className="pt-4 border-t">
        <h3 className="font-semibold mb-4">Preview</h3>
        <div className="space-y-4">
          <div
            className="p-4 text-white text-center rounded-lg font-semibold"
            style={{
              backgroundColor: data.primaryColor,
              fontFamily: data.fontFamily,
            }}
          >
            Primary Button Style
          </div>
          <div
            className="p-4 border-2 text-center rounded-lg font-semibold"
            style={{
              borderColor: data.secondaryColor,
              color: data.secondaryColor,
              fontFamily: data.fontFamily,
            }}
          >
            Secondary Style
          </div>
        </div>
      </div>

      <LogoSelector
        open={logoSelectorOpen}
        onClose={() => setLogoSelectorOpen(false)}
        onSelect={(logo) => updateField("logo", logo)}
        currentLogo={data.logo}
      />
    </div>
  )
}
