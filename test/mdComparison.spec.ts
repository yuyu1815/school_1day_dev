import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { rawData } from '../data/participants';
import { EventName } from '../types';

// Utility to build a multiset (name -> count)
function multiset(arr: string[]) {
  const m = new Map<string, number>();
  for (const a of arr) m.set(a, (m.get(a) ?? 0) + 1);
  return m;
}

function diffMultiset(a: Map<string, number>, b: Map<string, number>) {
  const extra: { name: string; count: number }[] = [];
  const missing: { name: string; count: number }[] = [];
  const keys = new Set([...a.keys(), ...b.keys()]);
  for (const k of keys) {
    const ca = a.get(k) ?? 0;
    const cb = b.get(k) ?? 0;
    if (ca > cb) extra.push({ name: k, count: ca - cb });
    if (cb > ca) missing.push({ name: k, count: cb - ca });
  }
  return { extra, missing };
}

// Parse a markdown table starting from a given index. Returns parsed rows and next index after table.
function parseNameTable(lines: string[], startIndex: number) {
  // Seek header
  let i = startIndex;
  while (i < lines.length && !/^\|\s*Ｎ?Ｎ?０?\s*\|\s*学科\s*\|\s*学年\s*\|\s*氏名\s*\|/.test(lines[i])) i++;
  if (i >= lines.length) throw new Error('Table header not found from index ' + startIndex);
  // Skip header and alignment row if present
  i++;
  if (i < lines.length && /^\|\s*-/.test(lines[i])) i++;

  const rows: { department: string; grade: number; name: string }[] = [];
  while (i < lines.length) {
    const line = lines[i];
    if (!line.startsWith('|')) break; // end of table
    const parts = line.split('|').map(s => s.trim());
    // Expect: ["", NO, 学科, 学年, 氏名, "", ...]
    if (parts.length < 6) break;
    const maybeNo = parts[1];
    const dept = parts[2] ?? '';
    const gradeStr = parts[3] ?? '';
    const name = parts[4] ?? '';
    // Stop if reaches a different table or blank row
    if (!/^[0-9０-９]+$/.test(maybeNo) || name === '') break;
    // Normalize grade to half-width number
    const grade = Number(gradeStr.replace(/[０-９]/g, d => String.fromCharCode(d.charCodeAt(0) - 0xFEE0)));
    rows.push({ department: dept, grade, name });
    i++;
  }
  return { rows, nextIndex: i };
}

function loadMarkdown(): string[] {
  const mdPath = path.resolve(process.cwd(), 'ルール・エントリーまとめ.md');
  const text = fs.readFileSync(mdPath, 'utf8');
  // Normalize newlines
  return text.replace(/\r\n?/g, '\n').split('\n');
}

function pickSection(lines: string[], anchorRegex: RegExp, afterRegexList: RegExp[] = []) {
  let idx = lines.findIndex(l => anchorRegex.test(l));
  if (idx === -1) throw new Error('Section anchor not found: ' + anchorRegex);
  for (const r of afterRegexList) {
    const next = lines.slice(idx + 1).findIndex(l => r.test(l));
    if (next === -1) throw new Error('Sub-anchor not found: ' + r);
    idx = idx + 1 + next;
  }
  return idx + 1; // return index to start searching from
}

// Extract expected name lists from markdown
function extractExpectedFromMd() {
  const lines = loadMarkdown();

  // 玉入れ（ACK エントリーシート）
  const tamaireStart = pickSection(lines, /玉入れ\s*　?エントリーシート/, [/\|学校\|穴吹コンピュータカレッジ\|/]);
  const { rows: tamaireRows } = parseNameTable(lines, tamaireStart);

  // Let'sボール運び Aチーム（ACK）
  const ballAStart = pickSection(lines, /Let.?ｓ?ボール運び/, [/ACK　Aチーム/]);
  const { rows: ballARows } = parseNameTable(lines, ballAStart);

  // Let'sボール運び Bチーム（ACK）
  const ballBStart = pickSection(lines, /Let.?ｓ?ボール運び/, [/ACK　Bチーム/]);
  const { rows: ballBRows } = parseNameTable(lines, ballBStart);

  // 20人21脚（ACK）
  const leggedStart = pickSection(lines, /20人21脚/, [/\|学校\|穴吹コンピュータカレッジ\|/]);
  const { rows: leggedRows } = parseNameTable(lines, leggedStart);

  // 綱引き 男子（ACK）
  const tugStart = pickSection(lines, /綱引き\(トラック競技\)/, [/\|学校\|穴吹コンピュータカレッジ\|/, /^男子\s*$/]);
  const { rows: tugRows } = parseNameTable(lines, tugStart);

  // 学校対抗リレー 男子（ACK）
  const relayStart = pickSection(lines, /学校対抗リレー/, [/\|学校\|穴吹コンピュータカレッジ\|/]);
  const { rows: relayMenRows } = parseNameTable(lines, relayStart);

  return {
    tamaireA: tamaireRows.map(r => r.name),
    ballCarryA: ballARows.map(r => r.name),
    ballCarryB: ballBRows.map(r => r.name),
    legged: leggedRows.map(r => r.name),
    tugMen: tugRows.map(r => r.name),
    relayMen: relayMenRows.map(r => r.name),
  };
}

function pickRawNames(eventName: EventName, team?: string, details?: string) {
  const e = rawData.find(e => e.eventName === eventName && (team ? e.team === team : true) && (details ? e.details === details : true));
  if (!e) throw new Error(`rawData event not found: ${eventName} ${team ?? ''} ${details ?? ''}`);
  return e.members.map(m => typeof m === 'string' ? m : m.name);
}

function toReadable(diff: ReturnType<typeof diffMultiset>) {
  return {
    extra: diff.extra.sort((a,b)=>a.name.localeCompare(b.name)),
    missing: diff.missing.sort((a,b)=>a.name.localeCompare(b.name)),
  };
}

describe('Markdown vs rawData member name comparison', () => {
  it('should match all member names between md tables and rawData (as multisets)', () => {
    const md = extractExpectedFromMd();

    const checks: { label: string; mdNames: string[]; rawNames: string[] }[] = [
      { label: `${EventName.Tamaire} Aチーム`, mdNames: md.tamaireA, rawNames: pickRawNames(EventName.Tamaire, 'Aチーム') },
      { label: `${EventName.BallCarry} Aチーム Aコース`, mdNames: md.ballCarryA, rawNames: pickRawNames(EventName.BallCarry, 'Aチーム', 'Aコース') },
      { label: `${EventName.BallCarry} Bチーム Aコース`, mdNames: md.ballCarryB, rawNames: pickRawNames(EventName.BallCarry, 'Bチーム', 'Aコース') },
      { label: `${EventName.LeggedRace}`, mdNames: md.legged, rawNames: pickRawNames(EventName.LeggedRace) },
      { label: `${EventName.TugOfWar} 男子`, mdNames: md.tugMen, rawNames: pickRawNames(EventName.TugOfWar, '男子') },
      { label: `${EventName.Relay} 男子`, mdNames: md.relayMen, rawNames: pickRawNames(EventName.Relay, '男子') },
    ];

    const problems: { label: string; diff: { extra: { name: string; count: number }[]; missing: { name: string; count: number }[] } }[] = [];

    for (const c of checks) {
      const mdSet = multiset(c.mdNames);
      const rawSet = multiset(c.rawNames);
      const diff = diffMultiset(rawSet, mdSet);
      if (diff.extra.length || diff.missing.length) {
        problems.push({ label: c.label, diff: toReadable(diff) });
      }
    }

    if (problems.length > 0) {
      // Helpful diagnostics when failing
      console.error('[Mismatch Report]', JSON.stringify(problems, null, 2));
    }

    expect(problems, 'All events should have matching member names between rawData and markdown tables').toEqual([]);
  });
});
