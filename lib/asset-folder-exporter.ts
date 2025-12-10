import JSZip from "jszip"
import { LandingPageData } from "./types"
import { AssetExtractor, AssetManifest } from "./asset-extractor"
import { renderStaticHtmlForAssetFolder, generateCSS, generateJS } from "./static-html-renderer"
import { validateLandingPageData } from "./schemas"

export async function createAssetFolderExport(data: LandingPageData): Promise<Blob> {
  const validatedData = validateLandingPageData(data)

  const extractor = new AssetExtractor()
  const { assets, manifest } = await extractor.extractAssets(validatedData)

  const html = renderStaticHtmlForAssetFolder(validatedData, manifest)
  const css = generateCSS(validatedData)
  const js = generateJS()

  const zip = new JSZip()

  // Add HTML file
  zip.file("index.html", html)

  // Add CSS
  zip.folder("css")
  zip.file("css/styles.css", css)

  // Add JS (only if FAQ is visible)
  if (validatedData.faq.visible && validatedData.faq.items.length > 0) {
    zip.folder("js")
    zip.file("js/main.js", js)
  }

  // Add assets
  const assetsFolder = zip.folder("assets")
  const imagesFolder = assetsFolder!.folder("images")
  const videosFolder = assetsFolder!.folder("videos")
  const docsFolder = assetsFolder!.folder("documents")

  for (const asset of assets) {
    const bytes = extractor.bytesFromDataUrl(asset.data)
    const folder = asset.type === "image" ? imagesFolder : asset.type === "video" ? videosFolder : docsFolder
    folder!.file(asset.filename, bytes)
  }

  // Add manifest.json
  zip.file("manifest.json", JSON.stringify(manifest, null, 2))

  // Add README
  const readme = `# Landing Page - Asset Folder Export

## Quick Start

This export contains your landing page as separate, organized files. You can:

1. **Open locally**: Double-click \`index.html\` to view in your browser
2. **Deploy to web**: Upload all files to your hosting provider
3. **Edit easily**: Modify \`css/styles.css\` to change styling

## File Structure

\`\`\`
/
├── index.html          # Main page
├── css/
│   └── styles.css      # All styling
├── js/
│   └── main.js         # Interactive features (FAQ toggles)
├── assets/
│   ├── images/         # All images (hashed filenames)
│   ├── videos/         # Video files
│   └── documents/      # PDFs and documents
└── manifest.json       # Asset mapping reference
\`\`\`

## Deployment Options

### Option 1: Netlify Drop (Easiest, Free)
1. Visit https://app.netlify.com/drop
2. Drag and drop this entire folder
3. Get instant live URL
4. Optional: Connect custom domain

### Option 2: Vercel (Free, Fast)
1. Install Vercel CLI: \`npm i -g vercel\`
2. Navigate to this folder in terminal
3. Run \`vercel\`
4. Follow prompts

### Option 3: Traditional Web Host
1. Connect via FTP/SFTP
2. Upload all files maintaining folder structure
3. Access at your domain

### Option 4: GitHub Pages
1. Create GitHub repository
2. Upload all files
3. Enable Pages in repository settings
4. Access at username.github.io/repo-name

## Technical Notes

- **Asset Hashing**: Images use content-based hashing for cache-busting
- **Security**: CSP headers prevent XSS attacks
- **Performance**: Lazy loading enabled for images
- **Compatibility**: Works on all modern browsers

## File Sizes

Total export size: ~${(assets.reduce((sum, a) => sum + extractor.bytesFromDataUrl(a.data).length, 0) / 1024 / 1024).toFixed(2)}MB
- HTML: ~${(html.length / 1024).toFixed(2)}KB
- CSS: ~${(css.length / 1024).toFixed(2)}KB
- Assets: ${assets.length} files

## Support

For questions or issues, refer to the NuBiz Builder documentation.
`

  zip.file("README.md", readme)

  // Generate ZIP
  return await zip.generateAsync({
    type: "blob",
    compression: "DEFLATE",
    compressionOptions: { level: 9 },
  })
}

export function calculateExportSize(html: string): number {
  return new Blob([html]).size
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}
