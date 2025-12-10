"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Home, MessageSquare, Users, Briefcase, HelpCircle, Sparkles, Palette, Eye, EyeOff, ChevronUp, ChevronDown } from 'lucide-react'
import { Switch } from "@/components/ui/switch"
import type { LandingPageData } from "@/lib/types"

interface BuilderSidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
  data: LandingPageData
  onToggleVisibility: (section: string) => void
  onReorder: (section: string, direction: "up" | "down") => void
}

const sectionConfig = [
  { id: "hero", label: "Hero Section", icon: Home, description: "Main banner" },
  { id: "pitch", label: "Pitch", icon: MessageSquare, description: "What we shared" },
  { id: "team", label: "Team", icon: Users, description: "Team members" },
  { id: "caseStudies", label: "Case Studies", icon: Briefcase, description: "Show your work" },
  { id: "faq", label: "FAQ", icon: HelpCircle, description: "Learn more" },
  { id: "surpriseDelight", label: "Surprise & Delight", icon: Sparkles, description: "Special offer" },
  { id: "footer", label: "Footer", icon: Home, description: "Site footer" },
  { id: "customization", label: "Customization", icon: Palette, description: "Brand styling" },
]

export function BuilderSidebar({
  activeSection,
  onSectionChange,
  data,
  onToggleVisibility,
  onReorder,
}: BuilderSidebarProps) {
  const getVisibility = (sectionId: string): boolean => {
    const section = data[sectionId as keyof LandingPageData]
    return typeof section === "object" && section !== null && "visible" in section ? section.visible : true
  }

  const orderedSections = (data.sectionOrder || [])
    .map((id) => sectionConfig.find((s) => s.id === id))
    .filter(Boolean) as typeof sectionConfig

  const customizationSection = sectionConfig.find((s) => s.id === "customization")

  return (
    <div className="w-72 bg-white border-r border-gray-200 shadow-sm">
      <ScrollArea className="h-full">
        <div className="p-4 space-y-2">
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Sections</h2>
            <p className="text-xs text-gray-500">Reorder, toggle visibility, and edit sections</p>
          </div>

          {/* Orderable sections */}
          {orderedSections.map((section, index) => {
            const Icon = section.icon
            const isActive = activeSection === section.id
            const isVisible = getVisibility(section.id)

            return (
              <div key={section.id} className="relative group">
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className="w-full justify-start h-auto py-3 px-4 pr-20"
                  onClick={() => onSectionChange(section.id)}
                >
                  <div className="flex items-start gap-3 w-full">
                    <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 text-left">
                      <div className="font-medium">{section.label}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{section.description}</div>
                    </div>
                  </div>
                </Button>

                {/* Controls overlay */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <div className="flex flex-col">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 p-0"
                      onClick={() => onReorder(section.id, "up")}
                      disabled={index === 0}
                    >
                      <ChevronUp className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 p-0"
                      onClick={() => onReorder(section.id, "down")}
                      disabled={index === orderedSections.length - 1}
                    >
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                  </div>
                  <Switch
                    checked={isVisible}
                    onCheckedChange={() => onToggleVisibility(section.id)}
                    className="scale-75"
                  />
                  {isVisible ? (
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </div>
            )
          })}

          {/* Customization section (always at bottom, not reorderable) */}
          {customizationSection && (
            <div className="mt-4 pt-4 border-t">
              <Button
                variant={activeSection === "customization" ? "secondary" : "ghost"}
                className="w-full justify-start h-auto py-3 px-4"
                onClick={() => onSectionChange("customization")}
              >
                <div className="flex items-start gap-3 w-full">
                  <Palette className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 text-left">
                    <div className="font-medium">{customizationSection.label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{customizationSection.description}</div>
                  </div>
                </div>
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
