import { describe, it, expect } from 'vitest';
import entries from '../data/entries.json' assert { type: 'json' };
import { buildValidationReportFromRaw } from '../data/checks';

// JSON-driven validation tests

describe('JSON entries validation', () => {
  const report = buildValidationReportFromRaw(entries as any);

  it('loads entries.json and builds a report', () => {
    expect(report).toBeTruthy();
    expect(report.summary.totalTeams).toBe(entries.length);
    expect(report.summary.errors).toBe(0);
  });

  it('flags missing required gender teams for 綱引き and 学校対抗リレー (女子が不足)', () => {
    const missing = report.missingRequiredTeams ?? [];
    const tug = missing.find((m) => m.eventName === '綱引き');
    const relay = missing.find((m) => m.eventName === '学校対抗リレー');

    expect(tug).toBeTruthy();
    expect(tug?.missing).toContain('女子');

    expect(relay).toBeTruthy();
    expect(relay?.missing).toContain('女子');
  });
});
