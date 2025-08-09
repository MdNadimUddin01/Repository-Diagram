# 🌳 **Repository Diagram**

> _Visualize any GitHub repository structure in seconds._

Ever wondered what a repo looks like before diving into the code?  
✨ **Repository Diagram** instantly transforms any GitHub repository into **beautiful, interactive visualizations** — making codebases easier to explore and understand.

![Repository Diagram](/ReadmeAsset/githubUrl.png)

---

## 🚀 Why Repository Diagram?

🔍 **Instant Visualization** — View repository structure at a glance  
⚡ **Interactive Diagrams** — Zoom, pan, and explore with ease  
📤 **Export Ready** — Download as SVG for documentation  
🚀 **Zero Setup** — Just paste any GitHub URL and go  
🌿 **Multi-Branch Support** — Visualize any branch  

---

## 🔍 Implementation Details

This project uses a **Trie (Prefix Tree)** data structure to build and visualize repository structures.

**Steps:**
1. **Build Trie** — Each file path from the GitHub repo is split by `/` and inserted into the Trie.  
2. **Traverse Trie** — The Trie is traversed recursively to generate the **Mermaid code** for the flowchart.  
3. **Render Diagram** — Mermaid.js renders the generated code into an interactive SVG.  

**Why Trie?**
- ⚡ **Fast processing** (pure algorithm, no external calls)  
- 📂 **Accurate hierarchy representation**  
- 📜 **Easy formatting for Mermaid.js**  


---

## 🎮 How It Works

1. **Paste any GitHub Repo URL**  
   ```
   https://github.com/user/repo
   ```

2. *(Optional)* Select a branch (default is `main`)

3. **Click Generate Diagram**  
   - 🎋 **Tree View** loads immediately  
   - 🖼️ **Flowchart** renders below

4. **Export or Explore**  
   - Copy structure  
   - Download flowchart as SVG  
   - Fullscreen view available

---

## 🔍 What You Get

### 📁 Directory Tree Structure
```
📦 Repository-Diagram
├─ .env.example
├─ .gitignore
├─ README.md
├─ Server
│  ├─ .env.example
│  ├─ app.js
│  ├─ controller
│  │  └─ flowchart.controller.js
│  ├─ package-lock.json
│  ├─ package.json
│  └─ route
│     └─ flowchart.route.js
├─ api.js
├─ eslint.config.js
├─ index.html
├─ package-lock.json
├─ package.json
├─ public
│  └─ vite.svg
├─ src
│  ├─ App.css
│  ├─ App.jsx
│  ├─ assest
│  │  └─ logo.png
│  ├─ component
│  │  ├─ BodyContent.jsx
│  │  ├─ FlowChart.jsx
│  │  ├─ Footer.jsx
│  │  ├─ Header.jsx
│  │  ├─ Tree.jsx
│  │  └─ TreeStructure.jsx
│  ├─ index.css
│  └─ main.jsx
└─ vite.config.js
```

![Github Folder Tree Preview](/ReadmeAsset/treeStructure.png)

### 🧭 Interactive Flowchart


![Flowchart Preview](/ReadmeAsset/flowchart.png)  
> _Easily zoom, explore, and export this diagram!_
- 🔎 Zoom, pan, and navigate
- 📋 Clickable nodes
- 📥 Export as SVG
- 🖥️ Fullscreen presentation mode

---

## ⚡ Quick Start

### 🔧 1. Clone the Project
```bash
git clone https://github.com/yourusername/repository-diagram.git
cd repository-diagram
```

### 📦 2. Install Dependencies
```bash
npm install
cd Server
npm install
```

### ▶️ 3. Start the App
```bash
Server : npm start
Frontend : npm run dev
```

Open your browser at: `http://localhost:3000`

---

## 🛠️ Tech Stack

| Tech | Description |
|------|-------------|
| ⚛️ React | Frontend for beautiful UI |
| 🌐 Express | Backend server |
| 🐙 GitHub API | Fetch repository structure |
| 🌳 Trie Data Structure | Stores file paths for fast, hierarchical visualization |
| 📊 Mermaid.js | Diagram rendering (SVG) |

---

## 🤝 Contributing

Here's how to get started:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

<div align="center">

### 🙌 Enjoyed *Repository Diagram*?

[🌟 Star on GitHub](../../stargazers) • [🐛 Report Issue](../../issues) • [💡 Request Feature](../../issues) • [🤝 Contribute](../../pulls)

_Developed By Nadim ❤️ for developers who love clean, structured codebases._

</div>