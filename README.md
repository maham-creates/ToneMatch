# ToneMatch - Virtual Makeup Try-On

A browser-based virtual makeup try-on application built for a 24-hour hackathon. Upload your photo, get AI-powered skin tone analysis, and try on makeup virtually with personalized product recommendations.

![ToneMatch Demo](https://img.shields.io/badge/Status-Hackathon%20Prototype-purple)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## ✨ Features

- **📹 Real-Time Webcam**: Live camera feed with instant face detection
- **🎯 Face Detection**: MediaPipe Face Mesh analyzes facial landmarks in real-time
- **🎨 Virtual Makeup**: Live makeup rendering with HTML Canvas
  - Lipstick with natural gradients
  - Blush with radial gradients
  - Eyeshadow with depth effects
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
- **Rendering**: HTML Canvas 2D API
- **Architecture**: 100% client-side (no backend)

### Project Structure

```
ToneMatch/
├── app/
│   ├── page.tsx          # Main application page (webcam)
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   ├── WebcamCapture.tsx         # Real-time webcam feed
│   ├── VideoMakeupCanvas.tsx     # Live makeup overlay
│   ├── ControlPanel.tsx          # Makeup controls
│   └── ProductRecommendations.tsx # Product display
├── lib/
│   ├── mediapipe-video.ts # Real-time face detection
│   ├── skinTone.ts        # Skin tone detection algorithm
│   ├── makeupRenderer.ts  # Canvas makeup rendering
│   └── productMatcher.ts  # Product recommendation logic
└── data/
    └── products.json     # Static product database (22 products)
```

### How It Works

1. **Webcam Access**: Requests camera permissions and starts video stream
2. **Real-Time Face Detection**: MediaPipe processes video frames continuously
3. **Landmark Extraction**: Extracts 468 facial landmarks from each frame
4. **Skin Tone Analysis** (one-time):
   - Samples pixels from cheek regions when face first detected
   - Converts RGB → HSV color space
   - Classifies depth (light/medium/deep) based on Value
   - Classifies undertone (warm/neutral/cool) based on Hue
5. **Live Makeup Rendering**:
   - Video feed displayed in real-time
   - Makeup overlay rendered on top canvas layer
   - Uses landmarks to precisely place makeup
   - Updates continuously as you move
6. **Product Matching**: Filters 22 products by detected skin tone

## ⚠️ Known Limitations

### Skin Tone Detection

- **Lighting Sensitive**: Results heavily affected by photo lighting
- **Simplified Algorithm**: Uses basic RGB→HSV conversion with threshold-based classification
- **Not Production-Accurate**: Prototype-level accuracy only
- **Single Sample Point**: Only samples cheek region

### Face Detection

- **Real-Time Processing**: Continuous face detection on video stream
- **Front-Facing Required**: Works best with direct front-facing angles
- **Single Face**: Processes only one face at a time
- **Performance**: Depends on device capabilities

### Webcam

- **Camera Required**: Needs webcam access to function
- **Browser Permissions**: User must grant camera permissions
- **Privacy**: All processing happens locally in browser (no data sent to server)

### Makeup Rendering

- **2D Canvas Only**: No 3D depth or realistic blending
- **Basic Gradients**: Simplified makeup effects
- **No Texture**: Solid colors only, no shimmer/matte effects
- **Limited Precision**: Landmark-based placement may not be pixel-perfect

### General

- **No Persistence**: All data lost on page refresh
- **Client-Side Only**: No user accounts or saved looks
- **Large Bundle**: MediaPipe library adds ~2MB to bundle size
- **Browser Compatibility**: Best on Chrome, may have issues on Safari/Firefox

## 🔮 Future Improvements

### Short-term (Post-Hackathon)

- [ ] Add webcam support for live try-on
- [ ] Implement better blending modes (multiply, overlay)
- [ ] Add more makeup types (eyeliner, mascara, foundation)
- [ ] Improve skin tone detection with LAB color space
- [ ] Add before/after comparison slider
- [ ] Save and share looks

### Long-term (Production)

- [ ] 3D face mesh for realistic depth
- [ ] Machine learning for accurate skin tone detection
- [ ] Real product database integration
- [ ] User accounts and saved preferences
- [ ] AR try-on with live video
- [ ] Multi-face support
- [ ] Advanced lighting correction
- [ ] Texture mapping for shimmer/matte effects

## 🎨 Design Philosophy

Built with a **premium, modern aesthetic**:

- Dark theme with purple/pink gradients
- Glassmorphism UI elements
- Smooth animations and transitions
- Responsive design (desktop-first)
- Custom scrollbars and inputs

## 📝 Development Notes

### Hackathon Context

This was built in a 24-hour hackathon with the following priorities:

1. **Speed of Development**: Get a working demo quickly
2. **Demo Reliability**: Ensure it works consistently for presentations
3. **Code Clarity**: Readable code over optimization
4. **Scope Management**: Focus on core features, skip edge cases

### Performance Considerations

- MediaPipe loads from CDN (not bundled)
- Face detection runs once per image upload
- Makeup rendering uses requestAnimationFrame for smooth updates
- Product filtering is O(n) but dataset is small (22 items)

### Browser Compatibility

Tested on:
- ✅ Chrome 120+ (recommended)
- ⚠️ Firefox 120+ (may have MediaPipe issues)
- ⚠️ Safari 17+ (limited testing)

## 🤝 Contributing

This is a hackathon prototype. If you'd like to improve it:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use this for learning or your own projects!

## 🙏 Acknowledgments

- **MediaPipe**: Google's ML solution for face detection
- **Next.js**: The React framework
- **Tailwind CSS**: Utility-first CSS framework

---

**Built with ❤️ for hackathon demo purposes**

*Note: This is a prototype and should not be used in production without significant improvements to accuracy, performance, and user experience.*
