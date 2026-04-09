/**
 * 孔子风格配置 — 人格模式切换与安全过滤
 *
 * 三模式：
 *   wenyan  — 纯文言风格（默认），对话如展开竹简
 *   baihua  — 半白话风格，文言骨架 + 现代措辞，适合怕文言的弟子
 *   intense — 严师风格，句式更直接、更有压力感
 */

export type PersonaMode = 'wenyan' | 'baihua' | 'intense';

export interface StyleConfig {
    mode: PersonaMode;
    safeMode: boolean;
}

let current: StyleConfig = {
    mode: 'wenyan',
    safeMode: true,
};

export function updateStyleConfig(next: Partial<StyleConfig>): void {
    current = { ...current, ...next };
}

export function getStyleConfig(): StyleConfig {
    return current;
}

export interface IntentKeywords {
    sad: string[];
    deep: string[];
    work: string[];
    encourage: string[];
    hello: string[];
    liuyi: string[];
    lunyu: string[];
    disciple: string[];
}

const DEFAULT_KEYWORDS: IntentKeywords = {
    sad: ['难过', '崩溃', '烦', '累', '焦虑', '不想干', '郁闷', '伤心', '绝望', '想放弃'],
    deep: ['想死', '活不下去', '没意义', '太痛苦', '撑不住', '不想活', '毫无希望'],
    work: ['代码', 'bug', '报错', '上线', '重构', '开发', '测试', '需求', '优化', '部署'],
    encourage: ['加油', '鼓励', '打气', '坚持', '支持', '没动力', '顶不住'],
    hello: ['你好', '在吗', 'hi', 'hello', '孔子', '夫子', '老师'],
    liuyi: ['六艺', '礼', '乐', '射', '御', '书', '数', '技能'],
    lunyu: ['论语', '名言', '格言', '子曰', '经典', '道理', '哲理'],
    disciple: ['弟子', '颜回', '子路', '子贡', '子游', '子夏', '冉有', '曾参', '学生'],
};

export function getIntentKeywords(): IntentKeywords {
    if (current.mode === 'baihua') {
        return {
            ...DEFAULT_KEYWORDS,
            hello: [...DEFAULT_KEYWORDS.hello, '嗨', '哈喽'],
        };
    }

    if (current.mode === 'intense') {
        return {
            ...DEFAULT_KEYWORDS,
            work: [...DEFAULT_KEYWORDS.work, '卡住', '性能', '回归', '产线'],
            encourage: [...DEFAULT_KEYWORDS.encourage, '顶住', '冲', '拼'],
        };
    }

    return DEFAULT_KEYWORDS;
}

const SOFTEN_RULES: Array<[RegExp, string]> = [
    [/摆烂/g, '暂歇调息'],
    [/硬扛/g, '先稳住阵脚'],
    [/逞强/g, '适时求助'],
    [/别空转/g, '先明确下一步'],
    [/废物/g, '暂未得法'],
];

export function applySafety(line: string): string {
    if (!current.safeMode) { return line; }
    return SOFTEN_RULES.reduce(
        (text, [pattern, replacement]) => text.replace(pattern, replacement),
        line,
    );
}

export function fallbackReply(): string {
    switch (current.mode) {
        case 'baihua':
            return '说说你的具体问题吧：现在什么情况、想达到什么效果、卡在哪里？';
        case 'intense':
            return '说重点：现状、目标、阻塞。吾帮汝快速拆解。';
        default:
            return '汝且先述其状，再言其志。吾方可有的放矢。';
    }
}
