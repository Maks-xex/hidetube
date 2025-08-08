# 🎥 YouTube UI Toggler

A lightweight Chrome extension that hides YouTube's on-screen elements (like video overlays, annotations, and control bars) with a single keypress — for a cleaner, distraction-free viewing experience.

---

## ✨ Features

- 🎯 Press H to instantly hide/show YouTube overlays
- 💾 Saves visibility preference across sessions
- 🔄 Automatically re-applies toggle state when navigating videos
- 🧠 Remembers settings even after tab switches or reloads
- ⚡ Lightweight and efficient — no bloat
- 🧩 Works seamlessly with embedded YouTube iframes

---

## 🖥 How It Works

1. Open any YouTube video (`youtube.com/watch?...`) or embed (`youtube.com/embed/...`)
2. Press the `H` key
   _or_
   Open the extension popup and click the Toggle button
3. The following UI elements will be toggled:
   - 🎬 End screens (`.ytp-ce-element`)
   - 🎛 Video controls (`.ytp-chrome-top`, `.ytp-chrome-bottom`)
   - 📝 Annotations (`.annotation`)
     will instantly hide or show
   - 🕹 Pause overlay (in iframes)

Your visibility setting is saved automatically and restored when revisiting or navigating to other videos.

---

## ❓ Why Use It?

- ✅ Removes distractions for focused watching
- 📺 Great for embedded video experiences
- 🧘 Cleaner look = better experience

### From Chrome Web Store

📦 Coming soon...

### From Source (Development Mode)

1. Clone the repository:

```bash
git clone https://github.com/Maks-xex/hidetube.git
cd hidetube
```

2. Install dependencies:

```bash
npm install
```

3. Build the extension:

```bash
npm run build
```

4. Open Chrome and go to:

```bash
chrome://extension
```

5. Enable **Developer mode** (top right)

6. Click **Load unpacked**, then select the generated `build/` folder
