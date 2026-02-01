# ToneMatch - Virtual Makeup Try-On

ToneMatch is an interactive beauty experience, allowing women to explore makeup and accessories in a safe, inclusive, and personalized way.

## ✨ Features

- **📹 Real-Time Webcam**: Live camera feed with instant face detection
- **🎯 Face Detection**: MediaPipe Face Mesh analyzes facial landmarks in real-time
- **🎨 Virtual Makeup**: Live makeup rendering with HTML Canvas
  - Lipstick with natural gradients
  - Blush with radial gradients
  - Eyeshadow with depth effects
- **🕶️ Accessory Virtual Mirror**: Try on uploaded accessories
  - **Automatic Background Removal**: AI-powered extraction of accessories from any image
  - **Smart Placement**: Auto-positioning for Glasses, Earrings, Hats, and Nose Piercings (Left/Right)
  - **Real-time Tracking**: Accessories move and rotate with your face
- **🌈 Skin Tone Detection**: Automatic classification when face is first detected
- **💄 Product Recommendations**: Personalized suggestions based on your skin tone
- **⚡ Real-time Adjustments**: Change colors and opacity instantly

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

### Build for Production

```bash
npm run build
npm start
```

## 🎯 How to Use

1. **Start Camera**: Click "Start Camera" and allow camera permissions
2. **Face Detection**: Position your face in frame - detection happens automatically
3. **View Results**: See your detected skin tone (depth + undertone) in the sidebar
4. **Try Makeup**: Use controls to adjust lipstick, blush, and eyeshadow in real-time
5. **Browse Products**: Click recommended products to apply their shades instantly
6. **Experiment**: Try different color combinations and see results live

## 🏗️ Technical Architecture

### Tech Stack

- **Framework**: Next.js 15 (React 19) with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom glassmorphism
- **Face Detection**: MediaPipe Face Mesh (JavaScript)
- **Background Removal**: @imgly/background-removal (AI-powered, client-side)
- **Rendering**: HTML Canvas 2D API
- **Architecture**: 100% client-side (no backend)

### Project Structure

```
ToneMatch/
├── app/
│   ├── accessories/
│   │   └── page.tsx      # Virtual mirror & accessory try-on
│   ├── makeup/
│   │   └── page.tsx      # Static photo makeup try-on
│   ├── page.tsx          # Home page
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   ├── WebcamCapture.tsx         # Real-time webcam feed
│   ├── VideoMakeupCanvas.tsx     # Live makeup overlay
│   ├── ControlPanel.tsx          # Makeup controls
│   ├── ProductRecommendations.tsx # Product display
│   ├── ImageUpload.tsx           # Static image upload
│   └── MakeupCanvas.tsx          # Static makeup overlay
├── lib/
│   ├── mediapipe-video.ts # Real-time face detection
│   ├── mediapipe.ts       # Static image face detection
│   ├── skinTone.ts        # Skin tone detection algorithm
│   ├── makeupRenderer.ts  # Canvas makeup rendering
│   ├── productMatcher.ts  # Product recommendation logic
│   └── imageProcessor.ts  # Background removal & image processing
└── data/
    └── products.json     # Static product database (22 products)
```

### General

- **No Persistence**: All data lost on page refresh
- **Client-Side Only**: No user accounts or saved looks
- **Large Bundle**: MediaPipe library adds ~2MB to bundle size
- **Browser Compatibility**: Best on Chrome, may have issues on Safari/Firefox

## 🔮 Future Improvements

- [ ] Implement better blending modes (multiply, overlay)
- [ ] Add more makeup types (eyeliner, mascara, foundation)
- [ ] Improve skin tone detection with LAB color space
- [ ] Save and share looks
- [ ] Integrate actual API's effectively to recommend the exact colored products
- [ ] Texture mapping for shimmer/matte effects