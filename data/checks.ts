import { rawData, memberDetails } from './participants';
import { EventName } from '../types';
import rules from './rules.json' assert { type: 'json' };

export interface EventCheck {
  eventName: string;
  team: string;
  details: string;
  expectedTeamSize?: number;
  actualTeamSize: number;
  status: 'pass' | 'warn' | 'error';
  notes?: string[];
}

export interface PeopleChecks {
  missingDetails: string[]; // rawDataに存在するがmemberDetailsに未登録
  unusedDetails: string[];  // memberDetailsにあるがrawDataで未使用
  duplicatesInSameTeam: { eventName: string; team: string; names: string[] }[]; // 同一チーム内で重複
  multiTeamSameEvent: { eventName: string; name: string; teams: string[] }[];   // 同一種目で複数チームに重複参加
}

export interface ValidationReport {
  generatedAt: string;
  school: string;
  summary: {
    totalTeams: number;
    passed: number;
    warnings: number;
    errors: number;
  };
  events: EventCheck[];
  missingRequiredTeams?: { eventName: string; requirement: string; missing: string[] }[];
  people?: PeopleChecks;
}

const SCHOOL_NAME = '穴吹コンピュータカレッジ';

export type RawMember = string | { name: string; grade: number; department: string };
export interface RawEntry { eventName: string; team: string; details: string; members: RawMember[] }

export const buildValidationReportFromRaw = (input: RawEntry[]): ValidationReport => {
  const checks: EventCheck[] = [];
  let passed = 0, warnings = 0, errors = 0;

  // Track required gender-based teams
  const requiredIssues: ValidationReport['missingRequiredTeams'] = [];

  // Pre-group by event
  const grouped = new Map<string, RawEntry[]>();
  for (const e of input) {
    const key = `${e.eventName}`;
    const arr = grouped.get(key) ?? [];
    arr.push(e);
    grouped.set(key, arr);
  }

  // Person-level collections
  const allNames = new Set<string>();
  const duplicatesInSameTeam: PeopleChecks['duplicatesInSameTeam'] = [];

  for (const e of input) {
    const base: EventCheck = {
      eventName: e.eventName,
      team: e.team,
      details: e.details,
      expectedTeamSize: undefined,
      actualTeamSize: e.members.length,
      status: 'pass',
      notes: []
    };

    const rule = (rules as any)[e.eventName as unknown as string];

    if (rule?.teamSize) {
      base.expectedTeamSize = rule.teamSize;
      if (e.members.length !== rule.teamSize) {
        base.status = 'error';
        base.notes?.push(`人数が規定(${rule.teamSize})と一致しません`);
      }
    }

    // Collect names and detect duplicates within the same team block
    const seen = new Set<string>();
    const dupNames: string[] = [];
    for (const m of e.members) {
      const name = typeof m === 'string' ? m : m.name;
      allNames.add(name);
      if (seen.has(name) && !dupNames.includes(name)) dupNames.push(name);
      seen.add(name);
    }
    if (dupNames.length > 0) {
      duplicatesInSameTeam.push({ eventName: e.eventName, team: e.team, names: dupNames });
      if (base.status !== 'error') base.status = 'warn';
      base.notes?.push(`同一チーム内で重複: ${dupNames.join(', ')}`);
    }

    // gender-separated requirements
    if (e.eventName === EventName.TugOfWar && rule?.genderSeparated) {
      const teams = grouped.get(e.eventName) ?? [];
      const labels = new Set(teams.map(t => t.team));
      const need = ['男子', '女子'];
      const missing = need.filter(l => !labels.has(l));
      if (missing.length > 0 && !requiredIssues.some(r => r.eventName === e.eventName)) {
        requiredIssues.push({ eventName: e.eventName, requirement: '男女別チーム', missing });
      }
    }

    if (e.eventName === EventName.Relay && Array.isArray(rule?.genders)) {
      const teams = grouped.get(e.eventName) ?? [];
      const labels = new Set(teams.map(t => t.team));
      const missing = (rule.genders as string[]).filter((g: string) => !labels.has(g));
      if (missing.length > 0 && !requiredIssues.some(r => r.eventName === e.eventName)) {
        requiredIssues.push({ eventName: e.eventName, requirement: '男子/女子 各1チーム', missing });
      }
    }

    checks.push(base);
  }

  // Same person registered across multiple teams within the same event
  const multiTeamSameEvent: PeopleChecks['multiTeamSameEvent'] = [];
  for (const [eventName, teams] of grouped.entries()) {
    const nameToTeams = new Map<string, Set<string>>();
    for (const t of teams) {
      for (const m of t.members) {
        const name = typeof m === 'string' ? m : m.name;
        const set = nameToTeams.get(name) ?? new Set<string>();
        set.add(t.team);
        nameToTeams.set(name, set);
      }
    }
    for (const [name, set] of nameToTeams.entries()) {
      if (set.size > 1) {
        const teamsArr = Array.from(set);
        multiTeamSameEvent.push({ eventName, name, teams: teamsArr });
        // mark related event checks as warn with a note
        for (const c of checks) {
          if (c.eventName === eventName && teamsArr.includes(c.team)) {
            if (c.status !== 'error') c.status = 'warn';
            c.notes = c.notes ?? [];
            if (!c.notes.some(n => n.includes('同一種目で複数チーム'))) {
              c.notes.push(`同一種目で複数チームに登録: ${name}（${teamsArr.join(' / ')}）`);
            }
          }
        }
      }
    }
  }

  // People details coverage
  const detailKeys = new Set<string>(Object.keys(memberDetails as Record<string, unknown>));
  const missingDetails = Array.from(allNames).filter((n) => !detailKeys.has(n)).sort();
  const unusedDetails = Array.from(detailKeys).filter((k) => !allNames.has(k)).sort();

  // Aggregate counts
  for (const c of checks) {
    if (c.status === 'pass') passed++; else if (c.status === 'warn') warnings++; else errors++;
  }

  // If required teams are missing, add warnings to summary
  if (requiredIssues.length > 0) {
    warnings += requiredIssues.length;
  }

  const report: ValidationReport = {
    generatedAt: new Date().toISOString(),
    school: SCHOOL_NAME,
    summary: {
      totalTeams: checks.length,
      passed,
      warnings,
      errors,
    },
    events: checks,
    missingRequiredTeams: requiredIssues.length ? requiredIssues : undefined,
    people: {
      missingDetails,
      unusedDetails,
      duplicatesInSameTeam,
      multiTeamSameEvent,
    }
  };

  return report;
};

export const buildValidationReport = (): ValidationReport => buildValidationReportFromRaw(rawData as unknown as RawEntry[]);

export const validationReport = buildValidationReport();
