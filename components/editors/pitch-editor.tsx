"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { PitchData } from "@/lib/types"
import { InfoButton } from "@/components/info-button"
import { FileUpload } from "@/components/file-upload"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { RichTextEditor } from "@/components/rich-text-editor"
import { HtmlEmbed } from "@/components/html-embed"
import { DocumentViewer } from "@/components/document-viewer"

interface PitchEditorProps {
  data: PitchData
  onChange: (data: PitchData) => void
}

export function PitchEditor({ data, onChange }: PitchEditorProps) {
  const updateField = (field: keyof PitchData, value: any) => {
    onChange({ ...data, [field]: value })
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Label htmlFor="pitch-title">Section Title</Label>
          <InfoButton content="The heading for your pitch section - typically 'What we shared with you' or similar." />
        </div>
        <Input id="pitch-title" value={data.title} onChange={(e) => updateField("title", e.target.value)} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="pitch-desc">Description</Label>
            <InfoButton content="Brief text explaining what the client will find in this section." />
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="pitch-rich-text" className="text-sm text-muted-foreground">
              Rich Text
            </Label>
            <Switch
              id="pitch-rich-text"
              checked={data.useRichText || false}
              onCheckedChange={(checked) => updateField("useRichText", checked)}
            />
          </div>
        </div>
        {data.useRichText ? (
          <RichTextEditor
            content={data.richTextContent || data.description}
            onChange={(content) => updateField("richTextContent", content)}
            placeholder="Enter description with formatting"
          />
        ) : (
          <Textarea
            id="pitch-desc"
            value={data.description}
            onChange={(e) => updateField("description", e.target.value)}
            rows={3}
          />
        )}
      </div>

      <Tabs defaultValue="document" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="document">Document Upload</TabsTrigger>
          <TabsTrigger value="html">HTML Embed</TabsTrigger>
        </TabsList>

        <TabsContent value="document" className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Label>Presentation Document</Label>
              <InfoButton content="Upload the deck, presentation, or document you shared with the client. Supports PDF, PowerPoint, Word, and more." />
            </div>
            <FileUpload
              value={data.documentUrl}
              onChange={(value) => updateField("documentUrl", value)}
              accept=".pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx"
              placeholder="Upload presentation or document"
              onFileNameChange={(name) => updateField("documentName", name)}
            />
            {data.documentName && <p className="text-sm text-muted-foreground mt-2">File: {data.documentName}</p>}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Label>Display Type</Label>
              <InfoButton content="Choose how visitors interact with your document - view it inline, download it, or open in new tab." />
            </div>
            <RadioGroup
              value={data.displayType}
              onValueChange={(value: "inline" | "download" | "link") => updateField("displayType", value)}
            >
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="inline" id="inline" />
                  <Label htmlFor="inline" className="cursor-pointer">
                    View Inline (embedded on page)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="download" id="download" />
                  <Label htmlFor="download" className="cursor-pointer">
                    Download Link (visitors download the file)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="link" id="link" />
                  <Label htmlFor="link" className="cursor-pointer">
                    Open in New Tab (external link)
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {data.documentUrl && (
            <div>
              <Label className="mb-2 block">Preview</Label>
              <DocumentViewer url={data.documentUrl} fileName={data.documentName} displayType={data.displayType} />
            </div>
          )}
        </TabsContent>

        <TabsContent value="html" className="space-y-6">
          <HtmlEmbed
            value={data.htmlEmbed || ""}
            onChange={(value) => updateField("htmlEmbed", value)}
            label="Custom HTML Content"
          />
          <p className="text-xs text-muted-foreground">
            Embed custom HTML content like interactive presentations, forms, or third-party widgets.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  )
}
