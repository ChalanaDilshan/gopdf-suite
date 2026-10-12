# GoPDF Suite 
> 100% Client-Side PDF Utilities & Micro-Tools. High-performance document processing with zero server uploads and total privacy.

Fast, free, and 100% private in-browser PDF utilities built with Next.js 14, Tailwind CSS, pdf-lib, and pdfjs-dist. No server uploads.

---

##  Features

-  **100% Client-Side & Private**: Every operation runs locally inside the browser memory using Web Workers and WebAssembly. No documents or sensitive data are ever sent to an external server.
-  **Lightning Fast & Non-Blocking**: Offloaded to dedicated background Web Workers so the UI remains 60fps smooth during heavy operations.
-  **Merge PDF**: Combine multiple PDF files seamlessly with drag-and-drop reordering (`@dnd-kit`).
-  **Split PDF**: Visually inspect pages rendered via HTML5 Canvas thumbnails (`pdfjs-dist`) and extract custom page selections.
-  **Dark Mode**: Fully styled modern light and dark themes with persistent storage and system theme detection.
-  **Responsive Design**: Clean desktop, tablet, and mobile interface built with Next.js 14 App Router and Tailwind CSS.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **PDF Engines**:
  - [`pdf-lib`](https://pdf-lib.js.org/) for document assembly, merging, and extraction
  - [`pdfjs-dist`](https://mozilla.github.io/pdf.js/) for high-fidelity canvas page thumbnail generation
- **Drag & Drop**: [`@dnd-kit/core`](https://dndkit.com/) & [`@dnd-kit/sortable`](https://dndkit.com/)
- **Icons**: [`lucide-react`](https://lucide.dev/)

---

##  Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18.17+ or 20+)
- npm / yarn / pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ChalanaDilshan/gopdf-suite.git
   cd gopdf-suite
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

##  Production Build

To build the optimized static application:
```bash
npm run build
npm run start
```

---

##  License

MIT License. Free for personal and commercial use.
