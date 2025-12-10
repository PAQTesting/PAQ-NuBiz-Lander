"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { FaqData } from "@/lib/types"
import { Plus, Trash2 } from "lucide-react"
import { InfoButton } from "@/components/info-button"

interface FaqEditorProps {
  data: FaqData
  onChange: (data: FaqData) => void
}

interface FaqPreset {
  id: string
  name: string
  questions: Array<{ question: string; answer: string }>
}

export function FaqEditor({ data, onChange }: FaqEditorProps) {
  const [faqPresets, setFaqPresets] = useState<FaqPreset[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadFaqPresets()
  }, [])

  const loadFaqPresets = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/faq-presets")
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`)
      }
      const presets = await response.json()
      setFaqPresets(presets)
    } catch (error) {
      console.error("Failed to load FAQ presets:", error)
      setFaqPresets([])
    } finally {
      setLoading(false)
    }
  }

  const updateField = (field: keyof FaqData, value: any) => {
    onChange({ ...data, [field]: value })
  }

  const addItem = () => {
    const newItem = {
      id: Date.now().toString(),
      question: "New question?",
      answer: "Answer here",
    }
    updateField("items", [...data.items, newItem])
  }

  const removeItem = (id: string) => {
    updateField(
      "items",
      data.items.filter((i) => i.id !== id),
    )
  }

  const updateItem = (id: string, field: string, value: string) => {
    updateField(
      "items",
      data.items.map((i) => (i.id === id ? { ...i, [field]: value } : i)),
    )
  }

  const loadPreset = (presetId: string) => {
    const preset = faqPresets.find((p) => p.id === presetId)
    if (preset) {
      const presetItems = preset.questions.map((item, index) => ({
        id: `${Date.now()}-${index}`,
        ...item,
      }))
      updateField("items", presetItems)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Label htmlFor="faq-title">Section Title</Label>
          <InfoButton content="The heading for your FAQ section." />
        </div>
        <Input id="faq-title" value={data.title} onChange={(e) => updateField("title", e.target.value)} />
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <Label>Load FAQ Preset</Label>
          <InfoButton content="Load pre-built FAQ sets from your library. You can edit them after loading." />
        </div>
        <Select onValueChange={loadPreset} disabled={loading || faqPresets.length === 0}>
          <SelectTrigger>
            <SelectValue placeholder={loading ? "Loading presets..." : "Choose a preset..."} />
          </SelectTrigger>
          <SelectContent>
            {faqPresets.map((preset) => (
              <SelectItem key={preset.id} value={preset.id}>
                {preset.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Label>FAQ Items</Label>
            <InfoButton content="Add common questions and answers. You can edit preset FAQs after loading them." />
          </div>
          <Button size="sm" onClick={addItem}>
            <Plus className="w-4 h-4 mr-1" />
            Add Question
          </Button>
        </div>

        <div className="space-y-4">
          {data.items.map((item) => (
            <div key={item.id} className="p-4 border rounded-lg space-y-3">
              <div className="flex justify-between items-start">
                <Label className="text-sm font-semibold">Q{data.items.indexOf(item) + 1}</Label>
                <Button size="sm" variant="ghost" onClick={() => removeItem(item.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <Input
                placeholder="Question"
                value={item.question}
                onChange={(e) => updateItem(item.id, "question", e.target.value)}
              />
              <Textarea
                placeholder="Answer"
                value={item.answer}
                onChange={(e) => updateItem(item.id, "answer", e.target.value)}
                rows={3}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
