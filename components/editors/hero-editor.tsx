"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import type { HeroData, CustomizationData } from "@/lib/types"
import { InfoButton } from "@/components/info-button"
import { FileUpload } from "@/components/file-upload"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { LogoSelector } from "@/components/logo-selector"
import { RichTextEditor } from "@/components/rich-text-editor"
import { BackgroundImageUploader } from "@/components/background-image-uploader"
import { Upload } from "lucide-react"
import { useState } from "react"

interface HeroEditorProps {
  data: HeroData
  onChange: (data: HeroData) => void
  customizationData?: CustomizationData
  onCustomizationChange?: (data: CustomizationData) => void
}

const PRESET_BACKGROUNDS = [
  {
    id: "gradient-magenta",
    name: "Magenta Gradient",
    path: "/hero-bg-gradient-magenta.jpg",
  },
  {
    id: "dial-pattern",
    name: "The Dial Pattern",
    path: "/hero-bg-dial-pattern.jpg",
  },
  {
    id: "access-motif",
    name: "Access Motif",
    path: "/hero-bg-access-motif.jpg",
  },
  {
    id: "geometric-modern",
    name: "Geometric Modern",
    path: "/hero-bg-geometric-modern.jpg",
  },
  {
    id: "soft-gradient",
    name: "Soft Gradient",
    path: "/hero-bg-soft-gradient.jpg",
  },
]

export function HeroEditor({ data, onChange, customizationData, onCustomizationChange }: HeroEditorProps) {
  const [logoSelectorOpen, setLogoSelectorOpen] = useState(false)
  const [backgroundUploaderOpen, setBackgroundUploaderOpen] = useState(false)

  const updateField = (field: keyof HeroData, value: any) => {
    onChange({ ...data, [field]: value })
  }

  const handleBackgroundSave = (imageData: {
    backgroundImage: string
    backgroundFit: "cover" | "contain" | "fill"
    backgroundPosition: "center" | "top" | "bottom" | "left" | "right"
  }) => {
    try {
      onChange({
        ...data,
        backgroundImage: imageData.backgroundImage,
        backgroundFit: imageData.backgroundFit,
        backgroundPosition: imageData.backgroundPosition,
        selectedBackground: "custom",
      })
      setBackgroundUploaderOpen(false)
    } catch (error) {
      console.error("Failed to save background:", error)
    }
  }

  return (
    <div className="space-y-6">
      {customizationData && onCustomizationChange && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Label>Logo</Label>
            <InfoButton content="Select your company logo to appear at the top of the page." />
          </div>
          <div className="flex items-center gap-4">
            {customizationData.logo && (
              <div className="w-32 h-16 border rounded flex items-center justify-center bg-white p-2">
                <img
                  src={customizationData.logo || "/placeholder.svg"}
                  alt="Logo"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            )}
            <Button variant="outline" onClick={() => setLogoSelectorOpen(true)}>
              {customizationData.logo ? "Change Logo" : "Select Logo"}
            </Button>
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center gap-2 mb-2">
          <Label htmlFor="hero-title">Title</Label>
          <InfoButton content="The main headline that visitors see first. Make it compelling and clear." />
        </div>
        <Input
          id="hero-title"
          value={data.title}
          onChange={(e) => updateField("title", e.target.value)}
          placeholder="Enter hero title"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="hero-subtitle">Subtitle</Label>
            <InfoButton content="Supporting text that provides more context about your offering." />
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="use-rich-text" className="text-sm text-muted-foreground">
              Rich Text
            </Label>
            <Switch
              id="use-rich-text"
              checked={data.useRichText || false}
              onCheckedChange={(checked) => updateField("useRichText", checked)}
            />
          </div>
        </div>
        {data.useRichText ? (
          <RichTextEditor
            content={data.richTextContent || data.subtitle}
            onChange={(content) => updateField("richTextContent", content)}
            placeholder="Enter hero subtitle with formatting"
          />
        ) : (
          <Textarea
            id="hero-subtitle"
            value={data.subtitle}
            onChange={(e) => updateField("subtitle", e.target.value)}
            placeholder="Enter hero subtitle"
            rows={3}
          />
        )}
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <Label htmlFor="hero-cta">Call to Action Text</Label>
          <InfoButton content="The text on your main button. Use action words like 'Get Started' or 'Learn More'." />
        </div>
        <Input
          id="hero-cta"
          value={data.ctaText}
          onChange={(e) => updateField("ctaText", e.target.value)}
          placeholder="e.g., Get Started"
        />
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <Label htmlFor="hero-link">CTA Link</Label>
          <InfoButton content="Where the button should take visitors. Use # for same-page sections, full URLs, or mailto:email@example.com for email links." />
        </div>
        <Input
          id="hero-link"
          value={data.ctaLink}
          onChange={(e) => updateField("ctaLink", e.target.value)}
          placeholder="e.g., #contact, https://..., or mailto:email@example.com"
        />
      </div>

      <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
        <div className="flex items-center gap-2">
          <Label htmlFor="show-cta" className="cursor-pointer">
            Show Call to Action Button
          </Label>
          <InfoButton content="Toggle to show or hide the CTA button in the hero section." />
        </div>
        <Switch
          id="show-cta"
          checked={data.showCta !== false}
          onCheckedChange={(checked) => updateField("showCta", checked)}
        />
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <Label>Video (Optional)</Label>
          <InfoButton content="Upload a sizzle reel or presentation video to showcase alongside your hero content." />
        </div>
        <FileUpload
          value={data.videoUrl}
          onChange={(value) => updateField("videoUrl", value)}
          accept="video/*"
          placeholder="Upload video or enter URL"
        />
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <Label>Background Image</Label>
          <InfoButton content="Choose from preset brand-aligned backgrounds or upload your own custom image with cropping and positioning options." />
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-sm text-muted-foreground mb-2 block">Preset Backgrounds</Label>
            <RadioGroup
              value={data.selectedBackground}
              onValueChange={(value) => {
                updateField("selectedBackground", value)
                const preset = PRESET_BACKGROUNDS.find((bg) => bg.id === value)
                if (preset) {
                  updateField("backgroundImage", preset.path)
                }
              }}
            >
              <div className="grid grid-cols-2 gap-3">
                {PRESET_BACKGROUNDS.map((bg) => (
                  <div
                    key={bg.id}
                    className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-accent cursor-pointer relative overflow-hidden"
                  >
                    <div
                      className="absolute inset-0 opacity-20 bg-cover bg-center"
                      style={{ backgroundImage: `url(${bg.path})` }}
                    />
                    <RadioGroupItem value={bg.id} id={bg.id} className="relative z-10" />
                    <Label htmlFor={bg.id} className="cursor-pointer flex-1 relative z-10">
                      {bg.name}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-sm text-muted-foreground mb-2 block">Or Upload Custom Background</Label>
            <Button variant="outline" onClick={() => setBackgroundUploaderOpen(true)} className="w-full">
              <Upload className="w-4 h-4 mr-2" />
              {data.selectedBackground === "custom" && data.backgroundImage
                ? "Change Custom Background"
                : "Upload Custom Background"}
            </Button>
            {data.selectedBackground === "custom" && data.backgroundImage && (
              <div className="mt-3 p-3 border rounded-lg bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-600">✓ Custom background uploaded</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      updateField("backgroundImage", "")
                      updateField("selectedBackground", "gradient-magenta")
                    }}
                  >
                    Remove
                  </Button>
                </div>
                <div
                  className="w-full h-24 rounded border bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${data.backgroundImage})`,
                    backgroundSize: data.backgroundFit || "cover",
                    backgroundPosition: data.backgroundPosition || "center",
                  }}
                />
                <div className="mt-2 text-xs text-muted-foreground">
                  Fit: {data.backgroundFit || "cover"} • Position: {data.backgroundPosition || "center"}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {customizationData && onCustomizationChange && (
        <>
          <LogoSelector
            open={logoSelectorOpen}
            onClose={() => setLogoSelectorOpen(false)}
            onSelect={(logo) => onCustomizationChange({ ...customizationData, logo })}
            currentLogo={customizationData.logo}
          />
          <BackgroundImageUploader
            open={backgroundUploaderOpen}
            onClose={() => setBackgroundUploaderOpen(false)}
            onSave={handleBackgroundSave}
            currentImage={data.selectedBackground === "custom" ? data.backgroundImage : ""}
            currentFit={data.backgroundFit}
            currentPosition={data.backgroundPosition}
          />
        </>
      )}
    </div>
  )
}
