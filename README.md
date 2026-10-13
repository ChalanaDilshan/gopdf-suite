# GoPDF Suite

**Fast, Free & Private PDF Utilities - Right in Your Browser.**

GoPDF Suite is a modern collection of browser-based PDF utilities built for fast, secure, and convenient document processing. Merge, split, and manage PDF documents directly in your browser without uploading your files to a server.

Designed with privacy, performance, and simplicity in mind, GoPDF Suite makes everyday PDF tasks accessible without unnecessary software installations.

---

## Features

- **100% Client-Side Processing:** PDF operations are designed to run locally in the browser, keeping document contents on the user's device.
- **Privacy-Focused:** No server uploads for PDF processing. Your files remain in browser memory during supported operations.
- **Fast & Responsive:** Background processing with Web Workers helps keep the interface responsive during intensive tasks.
- **Merge PDF:** Combine multiple PDF files into a single document with drag-and-drop file reordering.
- **Split PDF:** Preview PDF pages and extract selected pages into separate documents.
- **Modern Interface:** Clean, user-friendly design with light and dark themes.
- **Responsive Design:** Optimized for desktop, tablet, and mobile devices.

*Note: Privacy and performance features depend on the implementation of each tool and its processing workflow.*

---

## Tech Stack

- **Framework:** [Next.js 14 (App Router)](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **PDF Processing:** [pdf-lib](https://pdf-lib.js.org/)
- **PDF Rendering:** [pdfjs-dist](https://mozilla.github.io/pdf.js/)
- **Drag and Drop:** [@dnd-kit/core](https://dndkit.com/) and [@dnd-kit/sortable](https://dndkit.com/)
- **Icons:** [lucide-react](https://lucide.dev/)

---

## Getting Started

### Prerequisites

- Node.js 18.17 or later, or a compatible supported version
- npm, Yarn, or pnpm

### Installation

1. Clone the repository if you have authorized access:

   ```bash
   git clone https://github.com/ChalanaDilshan/gopdf-suite.git
   cd gopdf-suite
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Production Build

Create and run the production build:

```bash
npm run build
npm run start
```

---

## Copyright & Proprietary Rights

**Copyright © 2026 Chalana Dilshan. All rights reserved.**

GoPDF Suite, including its source code, original designs, user interface, branding, documentation, and other original project materials, is proprietary software.

Unless expressly authorized in writing by the copyright holder, you may not copy, reproduce, modify, redistribute, republish, sublicense, or commercially exploit the project's source code or other protected materials.

Viewing this repository does not grant permission to reuse, distribute, modify, or commercially exploit its contents.

Third-party libraries and dependencies remain subject to their respective licenses.

For licensing inquiries or permission requests, contact the copyright holder.

---

## License

**Proprietary - All Rights Reserved.**

This project is not distributed under the MIT License or any other open-source license. No rights are granted to use, modify, or redistribute the project's proprietary code except as expressly authorized in writing by the copyright holder.
