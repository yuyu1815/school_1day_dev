import { describe, it, expect } from 'vitest';
import { buildValidationReport } from '../data/checks';
import { rawData } from '../data/participants';
import rules from '../data/rules.json' assert { type: 'json' };

// Basic sanity tests for validation logic

describe('buildValidationReport', () => {
  const report = buildValidationReport();

  it('generates a report without runtime errors', () => {
    expect(report).toBeTruthy();
    expect(typeof report.generatedAt).toBe('string');
    expect(report.school).toBe('穴吹コンピュータカレッジ');
  });

  it('has the same number of event entries as rawData', () => {
    expect(report.events.length).toBe(rawData.length);
  });

  it('has zero errors in the current dataset', () => {
    expect(report.summary.errors).toBe(0);
  });

  it('ensures team sizes match the rules when specified', () => {
    for (const ev of report.events) {
      if (ev.expectedTeamSize != null) {
        expect(ev.actualTeamSize).toBe(ev.expectedTeamSize);
      } else {
        // If the rule exists, the test should still reflect it
        const rule = (rules as any)[ev.eventName as unknown as string];
        if (rule?.teamSize != null) {
          expect(ev.actualTeamSize).toBe(rule.teamSize);
        }
      }
    }
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
