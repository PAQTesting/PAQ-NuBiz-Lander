"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { FooterData } from "@/lib/types"
import { InfoButton } from "@/components/info-button"

interface FooterEditorProps {
  data: FooterData
  onChange: (data: FooterData) => void
}

export function FooterEditor({ data, onChange }: FooterEditorProps) {
  const updateField = (field: keyof FooterData, value: any) => {
    onChange({ ...data, [field]: value })
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Label htmlFor="footer-copyright">Copyright Text</Label>
          <InfoButton content="The copyright notice that appears in the footer. Use {year} to automatically insert the current year." />
        </div>
        <Input
          id="footer-copyright"
          value={data.copyrightText}
          onChange={(e) => updateField("copyrightText", e.target.value)}
          placeholder="e.g., © {year} Precision AQ. All rights reserved."
        />
        <p className="text-xs text-gray-500 mt-1">Use {"{year}"} for automatic year replacement</p>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <Label htmlFor="footer-cta-text">Call to Action Text</Label>
          <InfoButton content="The text on the contact button that appears prominently in the footer." />
        </div>
        <Input
          id="footer-cta-text"
          value={data.ctaText}
          onChange={(e) => updateField("ctaText", e.target.value)}
          placeholder="e.g., Get in touch with Precision"
        />
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <Label htmlFor="footer-cta-email">Contact Email</Label>
          <InfoButton content="The email address that the footer CTA button will link to. This will be converted to a mailto: link automatically." />
        </div>
        <Input
          id="footer-cta-email"
          type="email"
          value={data.ctaEmail}
          onChange={(e) => updateField("ctaEmail", e.target.value)}
          placeholder="e.g., hello@precisionaq.com"
        />
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <Label htmlFor="footer-bg-color">Background Color</Label>
          <InfoButton content="The background color for the footer. Hex color code (e.g., #111827 for dark gray)." />
        </div>
        <div className="flex gap-2">
          <Input
            id="footer-bg-color"
            value={data.backgroundColor}
            onChange={(e) => updateField("backgroundColor", e.target.value)}
            placeholder="e.g., #111827"
            className="flex-1"
          />
          <input
            type="color"
            value={data.backgroundColor}
            onChange={(e) => updateField("backgroundColor", e.target.value)}
            className="w-12 h-10 border rounded cursor-pointer"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <Label htmlFor="footer-text-color">Text Color</Label>
          <InfoButton content="The color for text in the footer. Hex color code (e.g., #ffffff for white)." />
        </div>
        <div className="flex gap-2">
          <Input
            id="footer-text-color"
            value={data.textColor}
            onChange={(e) => updateField("textColor", e.target.value)}
            placeholder="e.g., #ffffff"
            className="flex-1"
          />
          <input
            type="color"
            value={data.textColor}
            onChange={(e) => updateField("textColor", e.target.value)}
            className="w-12 h-10 border rounded cursor-pointer"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <Label htmlFor="footer-cta-bg">CTA Button Color</Label>
          <InfoButton content="The background color for the contact button. Hex color code (e.g., #2563eb for blue)." />
        </div>
        <div className="flex gap-2">
          <Input
            id="footer-cta-bg"
            value={data.ctaButtonColor}
            onChange={(e) => updateField("ctaButtonColor", e.target.value)}
            placeholder="e.g., #2563eb"
            className="flex-1"
          />
          <input
            type="color"
            value={data.ctaButtonColor}
            onChange={(e) => updateField("ctaButtonColor", e.target.value)}
            className="w-12 h-10 border rounded cursor-pointer"
          />
        </div>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg border">
        <h3 className="font-semibold mb-2 flex items-center gap-2">
          Footer Preview
          <InfoButton content="This is how your footer will look on the exported site." />
        </h3>
        <div
          className="p-8 rounded"
          style={{
            backgroundColor: data.backgroundColor,
            color: data.textColor,
            textAlign: "center",
          }}
        >
          <p className="text-sm mb-4 opacity-85">{data.copyrightText.replace("{year}", new Date().getFullYear().toString())}</p>
          <button
            className="px-6 py-3 rounded-full font-semibold"
            style={{
              backgroundColor: data.ctaButtonColor,
              color: "#ffffff",
            }}
          >
            {data.ctaText}
          </button>
        </div>
      </div>
    </div>
  )
}
