/**
 * 孔子工作陪伴 — 主入口
 */

import * as vscode from 'vscode';
import { KongziChatPanel } from './chatPanel';
import { generateResponse, analyzeCodeProblems, CODE_ANALYSIS_KEYWORDS } from './dynamicReply';
import { IdleWatcher } from './idleWatcher';
import {
    getBreakEnd,
    getBreakRemind,
    getDiscipleEasterEgg,
    getEncourageLine,
    getFinale,
    getFocusEnd,
    getFocusStart,
    getIdleRemind,
    getJudgment,
    getLiuyi,
    getLunyu,
    getOpening,
    getTimeBasedGreeting,
    getWorkLine,
} from './persona';
import { PomodoroTimer } from './pomodoro';
import { StatsTracker } from './stats';
import { PersonaMode, updateStyleConfig } from './styleConfig';

export function activate(context: vscode.ExtensionContext): void {
    const panel = new KongziChatPanel(context.extensionUri);
    const pomodoro = new PomodoroTimer();
    const stats = new StatsTracker(context.globalState);
    const idleWatcher = new IdleWatcher(() => {
        panel.addBotMessage(getIdleRemind());
    });

    // ── 常驻状态栏 ──────────────────────────────────
    const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBar.text = '📜 孔子';
    statusBar.tooltip = '孔子工作陪伴';
    statusBar.command = 'kongzi.openStage';
    if (vscode.workspace.getConfiguration('kongzi').get<boolean>('enableStatusBar', true)) {
        statusBar.show();
    }
    context.subscriptions.push(statusBar);

    // ── 注册 Webview ─────────────────────────────────
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(KongziChatPanel.viewType, panel),
    );

    // ── 用户消息处理 ──────────────────────────────────
    panel.setOnUserMessage((text) => {
        stats.recordMessage();
        panel.updateStats(stats.current);
        idleWatcher.reset();

        const lower = text.toLowerCase();
        if (CODE_ANALYSIS_KEYWORDS.some((k) => lower.includes(k))) {
            panel.addBotMessage(analyzeCodeProblems());
            return;
        }

        panel.addBotMessage(generateResponse(text));
    });

    // ── 首次欢迎引导 ──────────────────────────────────
    const welcomed = context.globalState.get<boolean>('kongzi.welcomed', false);
    if (!welcomed) {
        panel.addBotMessage('有朋自远方来，不亦乐乎？吾乃孔丘，字仲尼。今日起，由吾来陪汝修身治学。');
        panel.addBotMessage('汝可与吾论道、请吾审视代码、或开启修身专注。命令面板中搜索"孔子"可寻得更多功能。');
        panel.addBotMessage('学而时习之，不亦说乎？——汝可准备好了？');
        void context.globalState.update('kongzi.welcomed', true);
    } else {
        panel.addBotMessage(getTimeBasedGreeting());
    }

    // 初始推送统计
    panel.updateStats(stats.current);

    // ── 命令注册 ──────────────────────────────────────
    context.subscriptions.push(
        vscode.commands.registerCommand('kongzi.openStage', () => {
            const msg = getOpening();
            panel.addBotMessage(msg);
            panel.addBotMessage(getTimeBasedGreeting());
            void vscode.window.showInformationMessage(`📜 孔子：${msg}`);
        }),
        vscode.commands.registerCommand('kongzi.startPomodoro', () => {
            if (pomodoro.isRunning) {
                panel.addBotMessage('修身尚在进行中。既已立志，便不可中途而废。');
                return;
            }
            const minutes = vscode.workspace.getConfiguration('kongzi').get<number>('pomodoroMinutes', 25);
            panel.addBotMessage(getFocusStart(minutes));
            pomodoro.start(minutes, (phase) => {
                switch (phase) {
                    case 'focus-end':
                        panel.addBotMessage(getFocusEnd());
                        stats.recordPomodoro();
                        panel.updateStats(stats.current);
                        void vscode.window.showInformationMessage('📜 孔子：此节修身已毕，做得甚好。');
                        break;
                    case 'break-start':
                        panel.addBotMessage(getBreakRemind());
                        void vscode.window.showInformationMessage('📜 孔子：休憩时辰到了，起身活动一下。');
                        break;
                    case 'break-end':
                        panel.addBotMessage(getBreakEnd());
                        void vscode.window.showInformationMessage('📜 孔子：休憩结束，继续修学。');
                        break;
                }
            });
        }),
        vscode.commands.registerCommand('kongzi.stopPomodoro', () => {
            if (!pomodoro.isRunning) {
                panel.addBotMessage('修身尚未启动。若汝欲立志专注，随时可以开始。');
                void vscode.window.showInformationMessage('📜 孔子：修身尚未开始。');
                return;
            }
            pomodoro.stop();
            panel.addBotMessage('修身已止。虽半途而止非上策，然调整心态再出发，亦无不可。');
            void vscode.window.showInformationMessage('📜 孔子：修身已结束。');
        }),
        vscode.commands.registerCommand('kongzi.encourageMe', () => {
            const msg = getEncourageLine();
            panel.addBotMessage(msg);
            void vscode.window.showInformationMessage(`📜 孔子：${msg}`);
        }),
        vscode.commands.registerCommand('kongzi.reviewWork', () => {
            const diagnostics = vscode.languages.getDiagnostics();
            const issues: string[] = [];
            for (const [uri, diags] of diagnostics) {
                for (const diag of diags) {
                    if (diag.severity === vscode.DiagnosticSeverity.Error) {
                        const fileName = vscode.workspace.asRelativePath(uri);
                        issues.push(`${fileName}:${diag.range.start.line + 1} — ${diag.message}`);
                    }
                }
            }
            const totalErrors = issues.length;
            const topIssues = issues.slice(0, 10);
            if (totalErrors > 10) {
                topIssues.push(`……另有 ${totalErrors - 10} 处名不正之处。`);
            }
            panel.addBotMessage(getJudgment(topIssues));
            void vscode.window.showInformationMessage(`📜 孔子：正名审查发现 ${totalErrors} 项错误。`);
        }),
        vscode.commands.registerCommand('kongzi.finale', () => {
            const msg = getFinale(pomodoro.completedCount);
            panel.addBotMessage(msg);
            pomodoro.stop();
            void vscode.window.showInformationMessage(`📜 孔子：${msg}`);
        }),
        vscode.commands.registerCommand('kongzi.liuyi', () => {
            panel.addBotMessage(getLiuyi());
        }),
        vscode.commands.registerCommand('kongzi.lunyu', () => {
            panel.addBotMessage(getLunyu());
        }),
        vscode.commands.registerCommand('kongzi.disciple', () => {
            panel.addBotMessage(getDiscipleEasterEgg());
        }),
        vscode.commands.registerCommand('kongzi.switchMode', async () => {
            const items: Array<{ label: string; description: string; mode: PersonaMode }> = [
                { label: '📜 文言模式', description: '纯文言风格（默认），对话如展开竹简', mode: 'wenyan' },
                { label: '💬 白话模式', description: '半白话风格，文言骨架 + 现代措辞', mode: 'baihua' },
                { label: '⚡ 严师模式', description: '严师风格，句式更直接、更有压力感', mode: 'intense' },
            ];
            const picked = await vscode.window.showQuickPick(items, {
                placeHolder: '选择孔子的说话风格',
            });
            if (picked) {
                updateStyleConfig({ mode: picked.mode });
                const modeNames: Record<PersonaMode, string> = {
                    wenyan: '文言',
                    baihua: '白话',
                    intense: '严师',
                };
                panel.addBotMessage(`风格已切换为"${modeNames[picked.mode]}"模式。`);
                void vscode.window.showInformationMessage(`📜 孔子：已切换为${modeNames[picked.mode]}模式。`);
            }
        }),

        // ── 保存事件 → 统计 + 插话 ──────────────────────
        vscode.workspace.onDidSaveTextDocument(() => {
            stats.recordSave();
            panel.updateStats(stats.current);
            idleWatcher.reset();
            if (stats.current.todaySaves % 10 === 0) {
                panel.addBotMessage(getWorkLine());
            }
        }),

        // ── 编辑事件 → 重置闲置 ──────────────────────────
        vscode.workspace.onDidChangeTextDocument(() => {
            idleWatcher.reset();
        }),
        vscode.window.onDidChangeActiveTextEditor(() => {
            idleWatcher.reset();
        }),

        // ── 清理 ──────────────────────────────────────────
        {
            dispose() {
                pomodoro.dispose();
                idleWatcher.dispose();
            },
        },
    );
}

export function deactivate(): void { }
