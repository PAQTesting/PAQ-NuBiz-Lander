"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BuilderSidebar } from "@/components/builder-sidebar"
import { PreviewPanel } from "@/components/preview-panel"
import { HeroEditor } from "@/components/editors/hero-editor"
import { PitchEditor } from "@/components/editors/pitch-editor"
import { TeamEditor } from "@/components/editors/team-editor"
import { CaseStudiesEditor } from "@/components/editors/case-studies-editor"
import { FaqEditor } from "@/components/editors/faq-editor"
import { SurpriseDelightEditor } from "@/components/editors/surprise-delight-editor"
import { CustomizationEditor } from "@/components/editors/customization-editor"
import { ExportDialog } from "@/components/export-dialog"
import { PasswordProtectionDialog } from "@/components/password-protection-dialog"
import { AnalyticsDialog } from "@/components/analytics-dialog"
import { VersionHistoryDialog } from "@/components/version-history-dialog"
import { TemplateSelectorDialog } from "@/components/template-selector-dialog"
import { FooterEditor } from "@/components/editors/footer-editor"
import { ErrorBoundary } from "@/components/error-boundary"
import { Eye, Download, Home, Save, Sparkles, Shield, BarChart3, HistoryIcon, FileText, CheckCircle, Undo, Redo, Keyboard } from 'lucide-react'
import { type LandingPageData, defaultLandingPageData } from "@/lib/types"
import { InfoButton } from "@/components/info-button"
import { useToast } from "@/hooks/use-toast"
import { useDebounce } from "@/hooks/use-debounce"
import { StorageManager } from "@/lib/storage-manager"
import { validateLandingPageData } from "@/lib/schemas"
import { useKeyboardShortcuts } from "@/lib/keyboard-shortcuts"
import { UndoManager } from "@/lib/undo-manager"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function LandingPageBuilder() {
  const [view, setView] = useState<"home" | "builder">("home")
  const [activeSection, setActiveSection] = useState<string>("hero")
  const [showPreview, setShowPreview] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [showAnalyticsDialog, setShowAnalyticsDialog] = useState(false)
  const [showVersionHistory, setShowVersionHistory] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false)
  const [data, setData] = useState<LandingPageData>(defaultLandingPageData)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [undoManager] = useState(() => new UndoManager<LandingPageData>(defaultLandingPageData))
  const { toast } = useToast()
  const debouncedData = useDebounce(data, 15000)

  useEffect(() => {
    const saved = StorageManager.load()
    if (saved) {
      try {
        const validated = validateLandingPageData(saved)
        const mergedData: LandingPageData = {
          ...defaultLandingPageData,
          ...validated,
          sectionOrder: validated.sectionOrder || defaultLandingPageData.sectionOrder,
          hero: { ...defaultLandingPageData.hero, ...validated.hero },
          pitch: { ...defaultLandingPageData.pitch, ...validated.pitch },
          team: { ...defaultLandingPageData.team, ...validated.team },
          caseStudies: { ...defaultLandingPageData.caseStudies, ...validated.caseStudies },
          faq: { ...defaultLandingPageData.faq, ...validated.faq },
          surpriseDelight: { ...defaultLandingPageData.surpriseDelight, ...validated.surpriseDelight },
          customization: { ...defaultLandingPageData.customization, ...validated.customization },
          footer: { ...defaultLandingPageData.footer, ...validated.footer },
        }
        setData(mergedData)
        undoManager.push(mergedData)
      } catch (e) {
        console.error("Failed to load or validate saved data:", e)
        toast({
          title: "Data Error",
          description: "Loaded data with some invalid fields. Using defaults where needed.",
          variant: "destructive",
          duration: 5000,
        })
        setData(defaultLandingPageData)
      }
    }
  }, [toast, undoManager])

  useEffect(() => {
    if (debouncedData && view === "builder") {
      const saveData = async () => {
        try {
          await StorageManager.save(debouncedData)
          setLastSaved(new Date())
          
          const usage = StorageManager.getStorageUsage()
          if (usage.percentage > 80) {
            toast({
              title: "Storage Warning",
              description: `Browser storage is ${Math.round(usage.percentage)}% full. Consider exporting your work.`,
              variant: "destructive",
              duration: 5000,
            })
          }
        } catch (error) {
          if (error instanceof Error) {
            toast({
              title: "Save Failed",
              description: error.message,
              variant: "destructive",
              duration: 5000,
            })
          }
        }
      }

      saveData()
    }
  }, [debouncedData, view, toast])

  const updateData = useCallback((section: keyof LandingPageData, value: any) => {
    setData((prev) => {
      const newData = { ...prev, [section]: value }
      undoManager.push(newData)
      return newData
    })
  }, [undoManager])

  const handleSave = async () => {
    try {
      await StorageManager.save(data)
      setLastSaved(new Date())
      toast({
        title: "Saved!",
        description: "Your changes have been saved locally.",
        duration: 2000,
      })
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Save Failed",
          description: error.message,
          variant: "destructive",
        })
      }
    }
  }

  const handleUndo = useCallback(() => {
    const previousState = undoManager.undo()
    if (previousState) {
      setData(previousState)
      toast({ title: "Undo", description: "Reverted to previous state", duration: 1000 })
    }
  }, [undoManager, toast])

  const handleRedo = useCallback(() => {
    const nextState = undoManager.redo()
    if (nextState) {
      setData(nextState)
      toast({ title: "Redo", description: "Restored next state", duration: 1000 })
    }
  }, [undoManager, toast])

  useKeyboardShortcuts([
    {
      key: "s",
      ctrl: true,
      description: "Save",
      action: () => {
        handleSave()
      },
    },
    {
      key: "p",
      ctrl: true,
      description: "Preview",
      action: () => {
        setShowPreview(true)
      },
    },
    {
      key: "e",
      ctrl: true,
      description: "Export",
      action: () => {
        setShowExport(true)
      },
    },
    {
      key: "z",
      ctrl: true,
      description: "Undo",
      action: handleUndo,
    },
    {
      key: "z",
      ctrl: true,
      shift: true,
      description: "Redo",
      action: handleRedo,
    },
  ])

  const handleToggleVisibility = (section: string) => {
    const sectionData = data[section as keyof LandingPageData]
    if (typeof sectionData === "object" && sectionData !== null && "visible" in sectionData) {
      updateData(section as keyof LandingPageData, { ...sectionData, visible: !sectionData.visible })
    }
  }

  const handleReorder = (section: string, direction: "up" | "down") => {
    const currentOrder = [...data.sectionOrder]
    const currentIndex = currentOrder.indexOf(section)

    if (currentIndex === -1) return

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1

    if (newIndex < 0 || newIndex >= currentOrder.length) return

    const [removed] = currentOrder.splice(currentIndex, 1)
    currentOrder.splice(newIndex, 0, removed)

    updateData("sectionOrder", currentOrder)
  }

  const handlePasswordProtection = (config: { enabled: boolean; password: string }) => {
    setData((prev) => ({ ...prev, passwordProtection: config }))
  }

  const handleAnalytics = (config: { googleAnalytics?: string; customCode?: string }) => {
    setData((prev) => ({ ...prev, analytics: config }))
  }

  const handleRestoreVersion = (versionData: LandingPageData) => {
    setData(versionData)
    undoManager.push(versionData)
    toast({
      title: "Version Restored",
      description: "Successfully restored previous version.",
    })
  }

  const handleTemplateSelect = (template: any) => {
    setData((prev) => ({
      ...prev,
      customization: { ...prev.customization, ...template.data.customization },
    }))
    toast({
      title: "Template Applied",
      description: `Successfully applied ${template.name} template.`,
    })
  }

  if (view === "home") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#cb009f]/10 via-white to-[#850064]/10 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full p-12 text-center shadow-xl">
          <div className="mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-8 h-8 text-[#cb009f]" />
            </div>
            <h1 className="text-5xl font-bold text-[#0f1822] mb-4 leading-tight">
              Precision AQ
              <br />
              Leave-Behind Builder
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              Create stunning post-pitch websites for new business opportunities
            </p>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              Build professional leave-behind sites that showcase your pitch, team, and case studies. Perfect for RFP
              responses and client follow-ups.
            </p>
          </div>
          <Button
            size="lg"
            className="text-lg px-8 py-6 bg-[#cb009f] hover:bg-[#850064]"
            onClick={() => setView("builder")}
          >
            Start Building
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="h-screen flex flex-col bg-gray-50">
        {/* Header */}
        <header className="bg-[#0f1822] border-b border-gray-700 px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView("home")}
              className="text-white hover:text-white hover:bg-white/10"
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
            <div className="border-l h-8 border-gray-600" />
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">Leave-Behind Builder</h1>
              <InfoButton content="Create post-pitch websites to share with clients after your presentation. Include your pitch deck, team bios, case studies, and more." />
            </div>
            {lastSaved && (
              <div className="flex items-center gap-2 text-sm text-green-400 ml-4">
                <CheckCircle className="w-4 h-4" />
                <span>Saved {lastSaved.toLocaleTimeString()}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleUndo}
              disabled={!undoManager.canUndo()}
              className="border-white/20 text-white hover:bg-white/10 hover:text-white bg-transparent"
            >
              <Undo className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRedo}
              disabled={!undoManager.canRedo()}
              className="border-white/20 text-white hover:bg-white/10 hover:text-white bg-transparent"
            >
              <Redo className="w-4 h-4" />
            </Button>
            <Dialog open={showKeyboardShortcuts} onOpenChange={setShowKeyboardShortcuts}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/20 text-white hover:bg-white/10 hover:text-white bg-transparent"
                >
                  <Keyboard className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Keyboard Shortcuts</DialogTitle>
                </DialogHeader>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                    <span>Save</span>
                    <kbd className="px-2 py-1 bg-gray-100 rounded text-sm">Ctrl+S</kbd>
                  </div>
                  <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                    <span>Preview</span>
                    <kbd className="px-2 py-1 bg-gray-100 rounded text-sm">Ctrl+P</kbd>
                  </div>
                  <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                    <span>Export</span>
                    <kbd className="px-2 py-1 bg-gray-100 rounded text-sm">Ctrl+E</kbd>
                  </div>
                  <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                    <span>Undo</span>
                    <kbd className="px-2 py-1 bg-gray-100 rounded text-sm">Ctrl+Z</kbd>
                  </div>
                  <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                    <span>Redo</span>
                    <kbd className="px-2 py-1 bg-gray-100 rounded text-sm">Ctrl+Shift+Z</kbd>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTemplates(true)}
              className="border-white/20 text-white hover:bg-white/10 hover:text-white bg-transparent"
            >
              <FileText className="w-4 h-4 mr-2" />
              Templates
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowVersionHistory(true)}
              className="border-white/20 text-white hover:bg-white/10 hover:text-white bg-transparent"
            >
              <HistoryIcon className="w-4 h-4 mr-2" />
              History
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPasswordDialog(true)}
              className="border-white/20 text-white hover:bg-white/10 hover:text-white bg-transparent"
            >
              <Shield className="w-4 h-4 mr-2" />
              Password
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAnalyticsDialog(true)}
              className="border-white/20 text-white hover:bg-white/10 hover:text-white bg-transparent"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </Button>
            <Button
              variant="outline"
              onClick={handleSave}
              className="border-white/20 text-white hover:bg-white/10 hover:text-white bg-transparent"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowPreview(true)}
              className="border-white/20 text-white hover:bg-white/10 hover:text-white bg-transparent"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button onClick={() => setShowExport(true)} className="bg-[#cb009f] hover:bg-[#850064] text-white">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <BuilderSidebar
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            data={data}
            onToggleVisibility={handleToggleVisibility}
            onReorder={handleReorder}
          />

          {/* Editor Panel */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
            <Card className="max-w-4xl mx-auto p-8 shadow-lg">
              <Tabs value={activeSection} onValueChange={setActiveSection}>
                <TabsList className="grid grid-cols-8 w-full mb-6">
                  <TabsTrigger value="hero">Hero</TabsTrigger>
                  <TabsTrigger value="pitch">Pitch</TabsTrigger>
                  <TabsTrigger value="team">Team</TabsTrigger>
                  <TabsTrigger value="caseStudies">Cases</TabsTrigger>
                  <TabsTrigger value="faq">FAQ</TabsTrigger>
                  <TabsTrigger value="surpriseDelight">S&D</TabsTrigger>
                  <TabsTrigger value="customization">Style</TabsTrigger>
                  <TabsTrigger value="footer">Footer</TabsTrigger>
                </TabsList>

                <TabsContent value="hero" className="space-y-4">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Hero Section</h2>
                    <p className="text-gray-600">
                      The first thing clients see after your pitch. Thank them and set the tone for the rest of the site.
                    </p>
                  </div>
                  <HeroEditor
                    data={data.hero}
                    onChange={(value) => updateData("hero", value)}
                    customizationData={data.customization}
                    onCustomizationChange={(value) => updateData("customization", value)}
                  />
                </TabsContent>

                <TabsContent value="pitch" className="space-y-4">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Pitch Section</h2>
                    <p className="text-gray-600">
                      Recap what you shared in your presentation with a link to your pitch deck.
                    </p>
                  </div>
                  <PitchEditor data={data.pitch} onChange={(value) => updateData("pitch", value)} />
                </TabsContent>

                <TabsContent value="team" className="space-y-4">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Team Section</h2>
                    <p className="text-gray-600">Introduce the team members who will be working on this project.</p>
                  </div>
                  <TeamEditor data={data.team} onChange={(value) => updateData("team", value)} />
                </TabsContent>

                <TabsContent value="caseStudies" className="space-y-4">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Case Studies</h2>
                    <p className="text-gray-600">Share relevant work examples that demonstrate your capabilities.</p>
                  </div>
                  <CaseStudiesEditor data={data.caseStudies} onChange={(value) => updateData("caseStudies", value)} />
                </TabsContent>

                <TabsContent value="faq" className="space-y-4">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">FAQ Section</h2>
                    <p className="text-gray-600">Answer common questions about Precision AQ and your approach.</p>
                  </div>
                  <FaqEditor data={data.faq} onChange={(value) => updateData("faq", value)} />
                </TabsContent>

                <TabsContent value="surpriseDelight" className="space-y-4">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Surprise & Delight</h2>
                    <p className="text-gray-600">
                      End on a memorable note with a special offer or personal touch that shows you care.
                    </p>
                  </div>
                  <SurpriseDelightEditor
                    data={data.surpriseDelight}
                    onChange={(value) => updateData("surpriseDelight", value)}
                  />
                </TabsContent>

                <TabsContent value="customization" className="space-y-4">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Customization</h2>
                    <p className="text-gray-600">Customize colors and fonts to match Precision AQ brand guidelines.</p>
                  </div>
                  <CustomizationEditor
                    data={data.customization}
                    onChange={(value) => updateData("customization", value)}
                  />
                </TabsContent>

                <TabsContent value="footer" className="space-y-4">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Footer Section</h2>
                    <p className="text-gray-600">
                      Customize the footer that appears at the bottom of every exported site.
                    </p>
                  </div>
                  <FooterEditor data={data.footer} onChange={(value) => updateData("footer", value)} />
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>

        {/* Preview Dialog */}
        {showPreview && <PreviewPanel data={data} onClose={() => setShowPreview(false)} />}

        {/* Export Dialog */}
        {showExport && <ExportDialog data={data} onClose={() => setShowExport(false)} />}

        {/* Password Protection Dialog */}
        {showPasswordDialog && (
          <PasswordProtectionDialog
            open={showPasswordDialog}
            onClose={() => setShowPasswordDialog(false)}
            onApply={handlePasswordProtection}
          />
        )}

        {/* Analytics Dialog */}
        {showAnalyticsDialog && (
          <AnalyticsDialog
            open={showAnalyticsDialog}
            onClose={() => setShowAnalyticsDialog(false)}
            onApply={handleAnalytics}
            initialConfig={data.analytics}
          />
        )}

        {/* Version History Dialog */}
        {showVersionHistory && (
          <VersionHistoryDialog
            open={showVersionHistory}
            onClose={() => setShowVersionHistory(false)}
            onRestore={handleRestoreVersion}
          />
        )}

        {/* Template Selector Dialog */}
        {showTemplates && (
          <TemplateSelectorDialog
            open={showTemplates}
            onClose={() => setShowTemplates(false)}
            onSelect={handleTemplateSelect}
          />
        )}
      </div>
    </ErrorBoundary>
  )
}
