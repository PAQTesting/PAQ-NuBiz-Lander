"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3 } from "lucide-react"

interface AnalyticsDialogProps {
  open: boolean
  onClose: () => void
  onApply: (config: { googleAnalytics?: string; customCode?: string }) => void
  initialConfig?: { googleAnalytics?: string; customCode?: string }
}

export function AnalyticsDialog({ open, onClose, onApply, initialConfig }: AnalyticsDialogProps) {
  const [googleAnalytics, setGoogleAnalytics] = useState(initialConfig?.googleAnalytics || "")
  const [customCode, setCustomCode] = useState(initialConfig?.customCode || "")

  const handleApply = () => {
    onApply({ googleAnalytics, customCode })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Analytics Integration
          </DialogTitle>
          <DialogDescription>
            Add tracking codes to monitor visitor behavior and measure the success of your landing page.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="google" className="py-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="google">Google Analytics</TabsTrigger>
            <TabsTrigger value="custom">Custom Code</TabsTrigger>
          </TabsList>

          <TabsContent value="google" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ga-id">Google Analytics Measurement ID</Label>
              <input
                id="ga-id"
                type="text"
                value={googleAnalytics}
                onChange={(e) => setGoogleAnalytics(e.target.value)}
                placeholder="G-XXXXXXXXXX"
                className="w-full px-3 py-2 border rounded-md"
              />
              <p className="text-xs text-gray-500">
                Find your Measurement ID in Google Analytics under Admin → Data Streams
              </p>
            </div>
          </TabsContent>

          <TabsContent value="custom" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="custom-code">Custom Tracking Code</Label>
              <Textarea
                id="custom-code"
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
                placeholder="<script>/* Your tracking code */</script>"
                className="font-mono text-sm min-h-[200px]"
              />
              <p className="text-xs text-gray-500">
                Add any custom analytics or tracking scripts (e.g., Facebook Pixel, Hotjar, etc.)
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
            Cancel
          </Button>
          <Button onClick={handleApply} className="flex-1">
            Apply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
