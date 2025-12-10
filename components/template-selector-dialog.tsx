"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, Download } from "lucide-react"
import type { LandingPageData } from "@/lib/types"

interface Template {
  id: string
  name: string
  description: string
  thumbnail: string
  data: Partial<LandingPageData>
}

const templates: Template[] = [
  {
    id: "professional",
    name: "Professional Services",
    description: "Clean and corporate design for consulting and professional services",
    thumbnail: "/placeholder.svg?height=200&width=300",
    data: {
      customization: {
        primaryColor: "#2563eb",
        secondaryColor: "#1e40af",
        accentColor: "#0f172a",
        fontFamily: "Inter, sans-serif",
        logo: "",
        theme: "professional",
      },
    },
  },
  {
    id: "creative",
    name: "Creative Agency",
    description: "Bold and vibrant design for creative agencies and startups",
    thumbnail: "/placeholder.svg?height=200&width=300",
    data: {
      customization: {
        primaryColor: "#ec4899",
        secondaryColor: "#db2777",
        accentColor: "#831843",
        fontFamily: "Poppins, sans-serif",
        logo: "",
        theme: "creative",
      },
    },
  },
  {
    id: "minimal",
    name: "Minimal Modern",
    description: "Simple and elegant design with focus on content",
    thumbnail: "/placeholder.svg?height=200&width=300",
    data: {
      customization: {
        primaryColor: "#0f172a",
        secondaryColor: "#334155",
        accentColor: "#64748b",
        fontFamily: "Helvetica, Arial, sans-serif",
        logo: "",
        theme: "minimal",
      },
    },
  },
]

interface TemplateSelectorDialogProps {
  open: boolean
  onClose: () => void
  onSelect: (template: Template) => void
}

export function TemplateSelectorDialog({ open, onClose, onSelect }: TemplateSelectorDialogProps) {
  const handleSelect = (template: Template) => {
    if (confirm(`Apply "${template.name}" template? This will update your customization settings.`)) {
      onSelect(template)
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Choose a Template
          </DialogTitle>
          <DialogDescription>
            Start with a pre-designed template and customize it to match your brand.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[500px]">
          <div className="grid grid-cols-2 gap-4 p-4">
            {templates.map((template) => (
              <div key={template.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <img
                  src={template.thumbnail || "/placeholder.svg"}
                  alt={template.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{template.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                  <Button onClick={() => handleSelect(template)} className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Use Template
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
