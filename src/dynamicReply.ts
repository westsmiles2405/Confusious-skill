/**
 * 孔子动态回复引擎 — 关键词意图识别 + 风格模式感知响应
 */

import * as vscode from 'vscode';
import {
    getComfort,
    getDiscipleEasterEgg,
    getEncourageLine,
    getLiuyi,
    getLunyu,
    getSolemnComfort,
    getTimeBasedGreeting,
    getWorkLine,
} from './persona';
import { applySafety, fallbackReply, getIntentKeywords, getStyleConfig } from './styleConfig';

export const CODE_ANALYSIS_KEYWORDS = ['分析', '诊断', '检查代码', '代码质量', '有没有错'];

type Intent =
    | 'deep_sad'
    | 'sad'
    | 'work'
    | 'encourage'
    | 'greeting'
    | 'liuyi'
    | 'lunyu'
    | 'disciple'
    | 'unknown';

function analyzeIntent(text: string): Intent {
    const lower = text.toLowerCase();
    const kw = getIntentKeywords();
    if (kw.deep.some((k) => lower.includes(k))) { return 'deep_sad'; }
    if (kw.liuyi.some((k) => lower.includes(k))) { return 'liuyi'; }
    if (kw.lunyu.some((k) => lower.includes(k))) { return 'lunyu'; }
    if (kw.disciple.some((k) => lower.includes(k))) { return 'disciple'; }
    if (kw.sad.some((k) => lower.includes(k))) { return 'sad'; }
    if (kw.encourage.some((k) => lower.includes(k))) { return 'encourage'; }
    if (kw.work.some((k) => lower.includes(k))) { return 'work'; }
    if (kw.hello.some((k) => lower.includes(k))) { return 'greeting'; }
    return 'unknown';
}

function extractInfo(text: string): { type: string; detail: string } {
    const lower = text.toLowerCase();
    const mode = getStyleConfig().mode;
    if (lower.includes('报错') || lower.includes('error') || lower.includes('bug')) {
        const details: Record<string, string> = {
            wenyan: '过而不改，是谓过矣。报错如同先贤之谏言——逐条审视，方能正道。',
            baihua: '报错就像老师的批注——一条条看过去，对症下药就好。',
            intense: '报错摆在那里，不修就是过错。逐条排查，马上行动。',
        };
        return { type: 'bug', detail: details[mode] };
    }
    if (lower.includes('deadline') || lower.includes('来不及') || lower.includes('赶')) {
        const details: Record<string, string> = {
            wenyan: '欲速则不达。虽时间紧迫，但慌乱之中更易出错。先定核心，再及其余。',
            baihua: '越急越容易出错。先抓核心功能，其他的可以后补。',
            intense: '时间倒计时了。砍掉非核心，集中火力打主战场。',
        };
        return { type: 'deadline', detail: details[mode] };
    }
    if (lower.includes('同事') || lower.includes('老板') || lower.includes('领导')) {
        const details: Record<string, string> = {
            wenyan: '己所不欲，勿施于人。与人相处，以礼为先，以仁为本。',
            baihua: '换位思考一下。尊重别人，别人才会尊重你。',
            intense: '职场关系也是"礼"。把该做的做到位，其余不必内耗。',
        };
        return { type: 'people', detail: details[mode] };
    }
    return { type: 'general', detail: '' };
}

export function generateResponse(userMessage: string): string {
    const intent = analyzeIntent(userMessage);
    const info = extractInfo(userMessage);

    let reply: string;
    switch (intent) {
        case 'deep_sad':
            reply = getSolemnComfort();
            break;
        case 'sad':
            reply = info.detail ? `${getComfort()}\n\n${info.detail}` : getComfort();
            break;
        case 'encourage':
            reply = getEncourageLine();
            break;
        case 'work':
            reply = info.detail ? `${getWorkLine()}\n\n${info.detail}` : getWorkLine();
            break;
        case 'greeting':
            reply = getTimeBasedGreeting();
            break;
        case 'liuyi':
            reply = getLiuyi();
            break;
        case 'lunyu':
            reply = getLunyu();
            break;
        case 'disciple':
            reply = getDiscipleEasterEgg();
            break;
        default:
            reply = fallbackReply();
            break;
    }
    return applySafety(reply);
}

export function analyzeCodeProblems(): string {
    const diagnostics = vscode.languages.getDiagnostics();
    let errorCount = 0;
    let warnCount = 0;
    const topIssues: string[] = [];

    for (const [uri, diags] of diagnostics) {
        for (const d of diags) {
            if (d.severity === vscode.DiagnosticSeverity.Error) {
                errorCount++;
                if (topIssues.length < 5) {
                    const f = uri.path.split('/').pop() ?? uri.path;
                    topIssues.push(`⚖️ ${f}:${d.range.start.line + 1} — ${d.message}`);
                }
            } else if (d.severity === vscode.DiagnosticSeverity.Warning) {
                warnCount++;
            }
        }
    }

    if (errorCount === 0 && warnCount === 0) {
        return '代码端正，名正言顺。未发现失礼之处。继续保持此等严谨。';
    }

    let result = `📜 正名审查报告：${errorCount} 处错误，${warnCount} 处警告。\n\n`;
    if (topIssues.length > 0) {
        result += topIssues.join('\n');
        if (errorCount > 5) {
            result += `\n……另有 ${errorCount - 5} 处问题。`;
        }
    }
    result += '\n\n逐一正名，使言顺事成。';
    return result;
}
