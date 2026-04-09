# 📜 Confucius Work Companion — VS Code Extension

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![VS Code](https://img.shields.io/badge/VS%20Code-%5E1.85.0-007ACC?logo=visual-studio-code)](https://code.visualstudio.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?logo=typescript)](https://www.typescriptlang.org/)

> [🇨🇳 中文版](README.md)

> *"Is it not pleasant to learn with a constant perseverance and application? Is it not delightful to have friends coming from distant quarters?"*

A VS Code companion extension inspired by **Confucius (孔子)**, the Supreme Sage and First Teacher. He accompanies your coding journey with elegant classical Chinese, Analerta wisdom, Six Arts metaphors, and the Way of the Gentleman — bringing 2,500 years of philosophical insight to your modern development workflow.

---

## ✨ Features

| Feature | Command | Description |
|---|---|---|
| 📖 Daily Lecture | `孔子：今日讲学` | Time-based classical opening greeting |
| ⏱ Focus Session | `孔子：开始修身专注` | Start Pomodoro timer (25 min, framed as "self-cultivation") |
| ⏹ End Focus | `孔子：结束修身专注` | Stop current Pomodoro session |
| 💪 Encourage Me | `孔子：为我鼓劲` | Get a classical Chinese motivational quote |
| 🔍 Code Review | `孔子：正名审代码` | Review workspace diagnostics through "Rectification of Names" |
| 🏁 Daily Finale | `孔子：今日收工` | End-of-day summary with cultivation stats |
| 🎯 Six Arts | `孔子：谈谈六艺` | Hear about Ritual, Music, Archery, Charioteering, Calligraphy & Math |
| 📚 Analects | `孔子：论语一则` | Random Analects quote with programming-context interpretation |
| 👥 Disciples | `孔子：聊聊弟子` | Stories about Yan Hui, Zilu, Zigong, and other disciples |
| 🎭 Switch Style | `孔子：切换说话风格` | Toggle between three language modes |

---

## 🏛 Sidebar Panel

Click the Confucius icon in the activity bar to open **"杏坛书院" (Academy under the Apricot Altar)**:

- Free-form chat with intelligent intent recognition and in-character replies
- Automatic work commentary every 10 file saves
- Gentle idle reminders after prolonged inactivity
- Daily stats display: Cultivation (Pomodoros), Conversations, Saves
- **Crimson & Gold** themed UI inspired by ancient Chinese aesthetics
- Typewriter effect matching the Master's calm, measured delivery

---

## 🎭 Three Language Modes

Switch anytime via `孔子：切换说话风格`:

| Mode | Style | Best For |
|------|-------|----------|
| **文言 (Classical)** (default) | Pure classical Chinese with archaic sentence patterns | Immersive literary experience |
| **白话 (Vernacular)** | Semi-classical, retains elegance with modern readability | Daily use with balanced clarity |
| **严师 (Strict Teacher)** | Direct and intense, like a stern master scolding disciples | When you need pressure-driven motivation |

---

## 🧠 Design Philosophy

This extension is built on an in-depth research report covering Confucian thought:

- **Classical Sentence Aesthetics**: Faithful reproduction of patterns like "X者，Y也" (definitions), "不亦X乎" (rhetorical questions)
- **Six Arts Mapping**: Ritual → Code Standards, Music → Elegant Code, Archery → Precision, Charioteering → System Control, Calligraphy → Documentation, Mathematics → Algorithms
- **Analects in Programming**: Each quote is interpreted through a software engineering lens
- **Adaptive Teaching**: Responses adapt to detected user mood and topic (inspired by Confucius's "teaching according to aptitude")
- **Five Virtues**: Benevolence, Righteousness, Ritual, Wisdom, Trust — applied to code quality and engineering ethics
- **Disciple Stories**: Yan Hui's patience, Zilu's boldness, Zigong's eloquence — each inspiring different coding mindsets

---

## ⚙️ Settings

| Key | Default | Description |
|---|---|---|
| `kongzi.pomodoroMinutes` | 25 | Focus session duration (minutes) |
| `kongzi.breakMinutes` | 5 | Break duration (minutes) |
| `kongzi.enableIdleReminder` | true | Enable idle reminder |
| `kongzi.idleMinutes` | 30 | Idle threshold (minutes) |
| `kongzi.enableStatusBar` | true | Show status bar entry |

---

## 🚀 Quick Start

### Build from Source

```bash
git clone https://github.com/westsmiles2405/Confusious-skill.git
cd Confusious-skill
npm install
npm run compile
```

Then press **F5** in VS Code to launch Extension Development Host.

### Install from .vsix

```bash
code --install-extension kongzi-companion-0.1.0.vsix
```

---

## 📁 Project Structure

```text
kongzi-companion/
├── src/
│   ├── extension.ts       # Extension entry point, registers all commands
│   ├── persona.ts         # Core dialogue library (100+ classical lines)
│   ├── dynamicReply.ts    # Intent recognition & response engine
│   ├── chatPanel.ts       # "Academy" Webview panel
│   ├── styleConfig.ts     # Three persona modes & safety filtering
│   ├── pomodoro.ts        # Pomodoro timer ("self-cultivation focus")
│   ├── stats.ts           # Daily statistics tracker
│   └── idleWatcher.ts     # Idle detection & reminders
├── media/
│   └── kongzi-icon.svg    # Sidebar icon
├── package.json           # Extension manifest (10 commands)
├── tsconfig.json
├── DEVELOPMENT.md         # Developer documentation
├── LICENSE
├── README.md              # Chinese README
└── README_EN.md           # English README (this file)
```

---

## 💬 Sample Dialogue

**Opening Greeting (Classical mode):**
> 晨光初照，正宜修学。吾与汝共启今日之程。
> *(The morning light shines — a fine time for study. Let us begin today's journey together.)*

**Encouragement:**
> 君子务本，本立而道生。汝之代码，正是修身之途也。
> *(The gentleman attends to the root; when the root is established, the Way grows. Your code is precisely the path of self-cultivation.)*

**Analects + Programming:**
> 子曰："温故而知新，可以为师矣。"——重构旧代码而得新洞见，此即温故知新之道。
> *(The Master said: "Reviewing the old and learning the new — one may become a teacher." Refactoring old code to gain new insight: this is the Way of reviewing and renewing.)*

---

## 🔧 Tech Stack

- **Runtime**: VS Code Extension API (^1.85.0)
- **Language**: TypeScript 5.3
- **Target**: ES2021 / Node16
- **UI**: Webview API (HTML/CSS/JS)

---

## 📝 Disclaimer

The Confucius-style dialogues in this project are original creative adaptations inspired by classical texts such as *The Analerta* and *Book of Rites*. They are intended for educational and entertainment purposes only and do not represent any academic interpretation.

---

## 📄 License

[MIT](LICENSE) © 2025
