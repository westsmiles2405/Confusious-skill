# 孔子工作陪伴 — 开发文档

## 架构

```
src/
├── extension.ts      # 主入口，注册 10 条命令
├── chatPanel.ts      # Webview 侧边栏（朱红×金 古典配色）
├── dynamicReply.ts   # 意图识别引擎（deep_sad 优先，模式感知）
├── persona.ts        # 台词库：开场/工作/鼓励/安慰/六艺/论语/弟子
├── styleConfig.ts    # 风格配置：文言/白话/严师 三模式 + 安全过滤
├── pomodoro.ts       # 番茄钟 (PomodoroPhase 三阶段)
├── idleWatcher.ts    # 闲置监测
└── stats.ts          # 每日统计
```

## 命令清单（10 条）

| ID | 标题 | 说明 |
|----|------|------|
| `kongzi.openStage` | 今日讲学 | 开场白 |
| `kongzi.startPomodoro` | 开始修身专注 | 启动专注 |
| `kongzi.stopPomodoro` | 结束修身专注 | 手动停止 |
| `kongzi.encourageMe` | 为我鼓劲 | 鼓励台词 |
| `kongzi.reviewWork` | 正名审代码 | 代码诊断 |
| `kongzi.finale` | 今日收工 | 收尾辞 |
| `kongzi.liuyi` | 谈谈六艺 | 独有：六艺讲解 |
| `kongzi.lunyu` | 论语一则 | 独有：论语名句 |
| `kongzi.disciple` | 聊聊弟子 | 独有：弟子彩蛋 |
| `kongzi.switchMode` | 切换说话风格 | 文言/白话/严师 |

## 角色设定来源

基于《孔子角色设定深度研究报告》，提取以下核心要素：

- **言语美学**：文言虚词（之、乎、者、也、矣、焉）、定义式句法、反诘式启发、三阶递进逻辑
- **六艺技能**：礼乐射御书数，映射到编程场景
- **处世逻辑**：仁义礼智信的决策矩阵、陈蔡之围的危机管理
- **因材施教**：差异化教学的启发式回复
- **生活习惯**：食不语、正色原则等仪式感

## 风格模式（styleConfig.ts）

| 模式 | 说明 | 适合场景 |
|------|------|----------|
| `wenyan` | 纯文言风格（默认） | 沉浸式古典体验 |
| `baihua` | 文言骨架 + 现代措辞 | 怕文言的弟子 |
| `intense` | 严师风格，直接有压力 | 需要推动力时 |

功能：
- `getIntentKeywords()` — 根据模式扩展关键词
- `applySafety()` — 安全过滤（替换敏感措辞）
- `fallbackReply()` — 模式感知的兜底回复

## 构建

```bash
npm install
npm run compile
```

## 打包

```bash
npx @vscode/vsce package --allow-missing-repository
```
