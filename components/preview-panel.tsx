"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { LandingPageData } from "@/lib/types"
import { X, Monitor, Smartphone } from 'lucide-react'
import { useState } from "react"
import { LazyImage } from "./lazy-image"

interface PreviewPanelProps {
  data: LandingPageData
  onClose: () => void
}

export function PreviewPanel({ data, onClose }: PreviewPanelProps) {
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop")

  const safeData = {
    ...data,
    hero: data.hero || {},
    pitch: data.pitch || {},
    team: data.team || { members: [] },
    caseStudies: data.caseStudies || { studies: [] },
    faq: data.faq || { items: [] },
    surpriseDelight: data.surpriseDelight || {},
    customization: data.customization || {},
    footer: data.footer || {}
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-full h-[95vh] p-0 flex flex-col">
        <DialogHeader className="p-4 pb-3 border-b shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <DialogTitle>Preview</DialogTitle>
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "desktop" | "mobile")}>
                <TabsList>
                  <TabsTrigger value="desktop" className="gap-2">
                    <Monitor className="w-4 h-4" />
                    Desktop
                  </TabsTrigger>
                  <TabsTrigger value="mobile" className="gap-2">
                    <Smartphone className="w-4 h-4" />
                    Mobile
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-auto bg-gray-100 p-6">
          <div className="min-h-full flex items-start justify-center">
            <div
              className={`bg-white shadow-2xl transition-all duration-300 ${
                viewMode === "mobile"
                  ? "w-[375px] min-h-[667px]" // iPhone SE dimensions for better fit
                  : "w-full max-w-[1200px]" // Reduced max width for better viewing
              }`}
            >
              {safeData.customization.logo && (
                <div className="bg-white border-b px-6 py-4">
                  <img
                    src={safeData.customization.logo || "/placeholder.svg"}
                    alt="Logo"
                    className="h-10 object-contain"
                  />
                </div>
              )}

              {/* Hero Section */}
              {safeData.hero.visible && (
                <div
                  className="relative min-h-[400px] flex items-center justify-center text-white"
                  style={{
                    backgroundImage:
                      safeData.hero.backgroundImage && safeData.hero.backgroundImage.length > 0
                        ? `url(${safeData.hero.backgroundImage})`
                        : undefined,
                    backgroundColor: !safeData.hero.backgroundImage ? safeData.customization.primaryColor : undefined,
                    backgroundSize: safeData.hero.backgroundFit || "cover",
                    backgroundPosition: safeData.hero.backgroundPosition || "center",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  {safeData.hero.backgroundImage && safeData.hero.backgroundImage.length > 0 && (
                    <div className="absolute inset-0 bg-black/50" />
                  )}
                  <div className="relative z-10 text-center px-6 py-12 max-w-3xl">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{safeData.hero.title}</h1>
                    {safeData.hero.useRichText ? (
                      <div
                        className="text-lg md:text-xl mb-8"
                        dangerouslySetInnerHTML={{
                          __html: safeData.hero.richTextContent || safeData.hero.subtitle,
                        }}
                      />
                    ) : (
                      <p className="text-lg md:text-xl mb-8">{safeData.hero.subtitle}</p>
                    )}
                    {safeData.hero.videoUrl && (
                      <div className="mb-6 max-w-2xl mx-auto">
                        <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                          <video
                            controls
                            src={safeData.hero.videoUrl}
                            className="absolute inset-0 w-full h-full rounded-lg object-cover"
                          />
                        </div>
                      </div>
                    )}
                    {safeData.hero.showCta !== false && (
                      <Button size="lg" style={{ backgroundColor: safeData.customization.primaryColor }}>
                        {safeData.hero.ctaText}
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Pitch Section */}
              {safeData.pitch.visible && (
                <div className="py-16 px-8 bg-gray-50">
                  <div className="max-w-6xl mx-auto">
                    <h2
                      className="text-4xl font-bold text-center mb-4"
                      style={{ color: safeData.customization.primaryColor }}
                    >
                      {safeData.pitch.title}
                    </h2>
                    {safeData.pitch.useRichText ? (
                      <div
                        className="text-xl text-center text-gray-600 mb-12"
                        dangerouslySetInnerHTML={{
                          __html: safeData.pitch.richTextContent || safeData.pitch.description,
                        }}
                      />
                    ) : (
                      <p className="text-xl text-center text-gray-600 mb-12">{safeData.pitch.description}</p>
                    )}
                    {safeData.pitch.htmlEmbed && (
                      <div
                        className="bg-white p-6 rounded-lg shadow mb-6"
                        dangerouslySetInnerHTML={{ __html: safeData.pitch.htmlEmbed }}
                      />
                    )}
                    {safeData.pitch.documentUrl && (
                      <div className="bg-white p-6 rounded-lg shadow">
                        {safeData.pitch.displayType === "inline" ? (
                          <iframe src={safeData.pitch.documentUrl} className="w-full h-96 border-0" />
                        ) : (
                          <div className="text-center">
                            <Button>Download {safeData.pitch.documentName || "Document"}</Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Team Section */}
              {safeData.team.visible && safeData.team.members && safeData.team.members.length > 0 && (
                <div className="py-16 px-8">
                  <div className="max-w-6xl mx-auto">
                    <h2
                      className="text-4xl font-bold text-center mb-4"
                      style={{ color: safeData.customization.primaryColor }}
                    >
                      {safeData.team.title}
                    </h2>
                    {safeData.team.subtitle && (
                      <p className="text-xl text-center text-gray-600 mb-12">{safeData.team.subtitle}</p>
                    )}
                    <div className="grid md:grid-cols-3 gap-8">
                      {safeData.team.members.map((member) => (
                        <div key={member.id} className="text-center">
                          <LazyImage
                            src={member.image || "/placeholder.svg"}
                            alt={member.name}
                            className="w-48 h-48 rounded-full mx-auto mb-4 object-cover"
                            style={{ border: `4px solid ${safeData.customization.primaryColor}` }}
                          />
                          <h3 className="text-xl font-semibold">{member.name}</h3>
                          <p className="text-gray-600 mb-2">{member.role}</p>
                          <p className="text-sm text-gray-500 mb-4">{member.bio}</p>
                          <div className="flex gap-2 justify-center">
                            {member.linkedin && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => window.open(member.linkedin, "_blank")}
                              >
                                LinkedIn
                              </Button>
                            )}
                            {member.email && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => (window.location.href = `mailto:${member.email}`)}
                              >
                                Email
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Case Studies */}
              {safeData.caseStudies.visible &&
                safeData.caseStudies.studies &&
                safeData.caseStudies.studies.length > 0 && (
                  <div className="py-16 px-8 bg-gray-50">
                    <div className="max-w-6xl mx-auto">
                      <h2
                        className="text-4xl font-bold text-center mb-4"
                        style={{ color: safeData.customization.primaryColor }}
                      >
                        {safeData.caseStudies.title}
                      </h2>
                      {safeData.caseStudies.description && (
                        <p className="text-xl text-center text-gray-600 mb-12">{safeData.caseStudies.description}</p>
                      )}
                      <div className="space-y-8">
                        {safeData.caseStudies.studies.map((study) => (
                          <div key={study.id} className="bg-white rounded-lg shadow-lg p-8">
                            {study.icon && (
                              <LazyImage src={study.icon || "/placeholder.svg"} alt="Icon" className="w-12 h-12 mb-4" />
                            )}
                            <h3 className="text-2xl font-bold mb-4">{study.title}</h3>
                            <p className="text-gray-600 mb-4">{study.description}</p>
                            <p
                              className="text-lg font-semibold mb-4"
                              style={{ color: safeData.customization.primaryColor }}
                            >
                              {study.results}
                            </p>
                            {study.documentUrl && (
                              <div className="flex justify-center mt-6">
                                <Button
                                  onClick={() => window.open(study.documentUrl, "_blank")}
                                  style={{ backgroundColor: safeData.customization.primaryColor }}
                                >
                                  {study.buttonText || "View Details"}
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

              {/* FAQ */}
              {safeData.faq.visible && safeData.faq.items && safeData.faq.items.length > 0 && (
                <div className="py-16 px-8">
                  <div className="max-w-4xl mx-auto">
                    <h2
                      className="text-4xl font-bold text-center mb-4"
                      style={{ color: safeData.customization.primaryColor }}
                    >
                      {safeData.faq.title}
                    </h2>
                    {safeData.faq.subtitle && (
                      <p className="text-xl text-center text-gray-600 mb-12">{safeData.faq.subtitle}</p>
                    )}
                    <div className="space-y-4">
                      {safeData.faq.items.map((item) => (
                        <div key={item.id} className="border border-gray-200 rounded-lg p-6">
                          <h3
                            className="text-lg font-semibold mb-2"
                            style={{ color: safeData.customization.primaryColor }}
                          >
                            {item.question}
                          </h3>
                          <p className="text-gray-600">{item.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Surprise & Delight */}
              {safeData.surpriseDelight.visible && (
                <div className="py-16 px-8 bg-gray-100">
                  <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <div>
                      <LazyImage
                        src={safeData.surpriseDelight.imageUrl || "/placeholder.svg"}
                        alt="Surprise"
                        className="w-full rounded-lg"
                      />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold mb-4" style={{ color: safeData.customization.primaryColor }}>
                        {safeData.surpriseDelight.title}
                      </h2>
                      <p className="text-gray-600 mb-6">{safeData.surpriseDelight.subtitle}</p>
                      <h3 className="text-xl font-semibold mb-4">{safeData.surpriseDelight.formTitle}</h3>
                      <div className="space-y-4">
                        <input type="text" placeholder="First Name" className="w-full p-3 border rounded" />
                        <input type="text" placeholder="Last Name" className="w-full p-3 border rounded" />
                        <input type="email" placeholder="Email Address" className="w-full p-3 border rounded" />
                        <Button style={{ backgroundColor: safeData.customization.primaryColor }}>
                          {safeData.surpriseDelight.ctaText}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Footer Section */}
              {safeData.footer && (
                <footer
                  style={{
                    background: safeData.footer.backgroundColor,
                    color: safeData.footer.textColor,
                    padding: "2rem 1.5rem",
                    textAlign: "center" as const,
                    marginTop: "3rem",
                  }}
                >
                  <div style={{ maxWidth: "960px", margin: "0 auto" }}>
                    <p style={{ fontSize: "0.875rem", opacity: 0.85, margin: "0 0 1rem 0" }}>
                      {safeData.footer.copyrightText.replace("{year}", new Date().getFullYear().toString())}
                    </p>
                    <a
                      href={`mailto:${safeData.footer.ctaEmail}`}
                      style={{
                        display: "inline-block",
                        padding: "0.75rem 1.5rem",
                        borderRadius: "9999px",
                        background: safeData.footer.ctaButtonColor,
                        color: "#ffffff",
                        textDecoration: "none",
                        fontWeight: 600,
                        fontSize: "0.95rem",
                      }}
                    >
                      {safeData.footer.ctaText}
                    </a>
                  </div>
                </footer>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
