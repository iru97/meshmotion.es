# 3D Next Viewer

Advanced GLB Animation Viewer built with Next.js 15, React Three Fiber, and TypeScript.

## 🚀 Features

- 🎨 **Modern UI**: Apple-inspired glassmorphism design
- 🎭 **3D Rendering**: Powered by React Three Fiber and Three.js
- 🎬 **Animation System**: Load and play GLB animations
- 🔄 **Animation Retargeting**: Apply any Mixamo animation to any character
- ⚡ **Studio Lighting**: Multiple lighting presets for professional rendering
- 📊 **Timeline Editor**: Frame-by-frame animation control
- 🎨 **Material Presets**: Clay, Wireframe, X-Ray, and more
- 📱 **Responsive**: Works on desktop, tablet, and mobile

## 📦 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **3D Engine**: React Three Fiber + Three.js
- **3D Helpers**: @react-three/drei, @react-three/postprocessing
- **State Management**: Zustand
- **UI Components**: Shadcn UI + Radix UI
- **Styling**: Tailwind CSS
- **Animation**: GSAP
- **Timeline**: @xzdarcy/react-timeline-editor

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/3d-next-viewer.git
cd 3d-next-viewer
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
3d-next-viewer/
├── .claude/                  # Documentation and project guidelines
│   ├── docs/
│   │   ├── PRD.md           # Product Requirements Document
│   │   ├── SCAFFOLDING.md   # Project structure guide
│   │   └── NEXT_JS_SCAFFOLDING.md
│   └── nextjs/
│       └── rules.md         # Next.js coding standards
├── src/
│   ├── app/                 # Next.js App Router
│   ├── components/          # React components
│   │   ├── ui/             # Shadcn UI components
│   │   ├── viewer/         # 3D scene components
│   │   ├── panels/         # UI layout panels
│   │   ├── animation/      # Animation controls
│   │   ├── upload/         # File upload components
│   │   └── settings/       # Settings panels
│   ├── lib/                 # Utilities and core logic
│   │   ├── three/          # Three.js utilities
│   │   ├── store/          # Zustand stores
│   │   └── utils/          # General utilities
│   ├── hooks/               # Custom React hooks
│   └── types/               # TypeScript types
├── public/
│   └── models/
│       └── mixamo/         # Mixamo characters and animations
└── ...
```

## 🎮 Usage

### Loading a Model

1. Drag and drop a GLB file into the viewport
2. Or click the Upload button to browse files

### Animation Controls

- **Play/Pause**: Control animation playback
- **Speed**: Adjust playback speed (0.25x - 2x)
- **Loop**: Toggle animation looping
- **Timeline**: Scrub through frames

### Lighting Presets

Choose from multiple lighting setups:
- **Studio**: Professional three-point lighting
- **Soft**: Ambient, low-contrast lighting
- **Dramatic**: High-contrast with strong shadows
- **Outdoor**: Natural daylight simulation
- **Custom**: Manually adjust lights

### Material Presets

- **Textured**: Original model materials
- **Clay**: Uniform clay material
- **Wireframe**: Show topology
- **X-Ray**: Transparent view
- **PBR**: Physically-based rendering

## 📚 Documentation

Full documentation is available in the `.claude/docs/` directory:

- [PRD.md](.claude/docs/PRD.md) - Complete product specification
- [SCAFFOLDING.md](.claude/docs/SCAFFOLDING.md) - Architecture guide
- [NEXT_JS_SCAFFOLDING.md](.claude/docs/NEXT_JS_SCAFFOLDING.md) - Setup guide

## 🗺️ Roadmap

### Phase 1: Core Viewer (Weeks 1-3) ✅
- [x] Basic 3D viewer
- [x] GLB file loading
- [x] Camera controls
- [x] Glassmorphism UI

### Phase 2: Animation System (Weeks 4-5)
- [ ] Animation retargeting
- [ ] Mixamo integration
- [ ] Multiple character/animation management

### Phase 3: Timeline Editor (Week 6)
- [ ] Timeline UI
- [ ] Frame scrubbing
- [ ] Loop markers

### Phase 4: Lighting & Rendering (Week 7)
- [ ] Lighting presets
- [ ] Material presets
- [ ] Post-processing effects

### Phase 5: UI Polish (Week 8)
- [ ] Responsive design
- [ ] Dark/light mode
- [ ] Keyboard shortcuts

### Phase 6: Optimization (Weeks 9-10)
- [ ] Performance tuning
- [ ] Cross-browser testing
- [ ] Mobile optimization

## 🤝 Contributing

Contributions are welcome! Please read the coding guidelines in `.claude/nextjs/rules.md` before submitting PRs.

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- [Three.js](https://threejs.org/) - 3D library
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) - React renderer for Three.js
- [Mixamo](https://www.mixamo.com/) - Free 3D characters and animations
- [Shadcn UI](https://ui.shadcn.com/) - UI components
- [Next.js](https://nextjs.org/) - React framework

## 📞 Support

For questions or issues, please:
1. Check the [documentation](.claude/docs/)
2. Open an issue on GitHub
3. Contact the maintainers

---

**Built with ❤️ using Next.js 15 and React Three Fiber**
