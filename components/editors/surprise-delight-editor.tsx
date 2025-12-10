"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { SurpriseDelightData } from "@/lib/types"
import { InfoButton } from "@/components/info-button"
import { FileUpload } from "@/components/file-upload"

interface SurpriseDelightEditorProps {
  data: SurpriseDelightData
  onChange: (data: SurpriseDelightData) => void
}

export function SurpriseDelightEditor({ data, onChange }: SurpriseDelightEditorProps) {
  const updateField = (field: keyof SurpriseDelightData, value: string) => {
    onChange({ ...data, [field]: value })
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Label htmlFor="sd-title">Title</Label>
          <InfoButton content="The main heading for your surprise & delight section. Make it engaging and memorable." />
        </div>
        <Input
          id="sd-title"
          value={data.title}
          onChange={(e) => updateField("title", e.target.value)}
          placeholder="e.g., Know what's keeping you up at night"
        />
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <Label htmlFor="sd-subtitle">Subtitle</Label>
          <InfoButton content="Supporting text that adds context and personality to your offer." />
        </div>
        <Textarea
          id="sd-subtitle"
          value={data.subtitle}
          onChange={(e) => updateField("subtitle", e.target.value)}
          placeholder="Add a friendly message about your offer"
          rows={3}
        />
      </div>

      <div>
        <FileUpload
          label="Feature Image"
          value={data.imageUrl}
          onChange={(value) => updateField("imageUrl", value)}
          accept="image/*"
          helpText="Upload an image or use the default coffee cup image. Recommended: square or portrait orientation."
        />
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <Label htmlFor="sd-form-title">Form Title</Label>
          <InfoButton content="The heading above your contact form." />
        </div>
        <Input
          id="sd-form-title"
          value={data.formTitle}
          onChange={(e) => updateField("formTitle", e.target.value)}
          placeholder="e.g., Free cup on us!"
        />
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <Label htmlFor="sd-cta">Submit Button Text</Label>
          <InfoButton content="The text on your form submit button." />
        </div>
        <Input
          id="sd-cta"
          value={data.ctaText}
          onChange={(e) => updateField("ctaText", e.target.value)}
          placeholder="e.g., Give Me Coffee"
        />
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <Label htmlFor="sd-notify">Notify Email</Label>
          <InfoButton content="Enter an email address to receive notifications when someone submits the form on your live website." />
        </div>
        <Input
          id="sd-notify"
          type="email"
          value={data.notifyEmail}
          onChange={(e) => updateField("notifyEmail", e.target.value)}
          placeholder="e.g., team@precisionaq.com"
        />
      </div>
    </div>
  )
}
