import { EventName } from '../types';

export type TimetableType = 'competition' | 'other';

export interface TimetableEntry {
  time: string; // e.g., '09:30'
  title: string; // display title
  type: TimetableType;
  eventName?: EventName; // if this item corresponds to a competition event
  note?: string; // optional extra note
}

// Based on the provided image schedule (令和7年9月19日)
export const timetable: TimetableEntry[] = [
  { time: '08:30', title: '担当教員／スポーツ大会委員 集合・準備', type: 'other' },
  { time: '09:00', title: '各校教員 集合・準備', type: 'other' },
  { time: '09:15', title: '全学生 集合（待機場所に荷物を置いて集合）', type: 'other' },
  { time: '09:30', title: '開会式', type: 'other' },
  { time: '09:50', title: '準備体操', type: 'other' },
  { time: '10:10', title: '玉入れ', type: 'competition', eventName: EventName.Tamaire },
  { time: '11:10', title: "Let'sボール運び", type: 'competition', eventName: EventName.BallCarry },
  { time: '12:30', title: '20人21脚', type: 'competition', eventName: EventName.LeggedRace },
  { time: '13:40', title: '綱引き', type: 'competition', eventName: EventName.TugOfWar },
  { time: '14:10', title: '学校対抗リレー', type: 'competition', eventName: EventName.Relay },
  { time: '14:50', title: '得点集計', type: 'other' },
  { time: '15:10', title: '閉会式', type: 'other' },
  { time: '16:00', title: '清掃・片付け後 解散', type: 'other' },
];

// Helper map: event order index and start time lookup
export const eventOrder: Record<EventName, number> = {
  [EventName.Tamaire]: 0,
  [EventName.BallCarry]: 1,
  [EventName.LeggedRace]: 2,
  [EventName.TugOfWar]: 3,
  [EventName.Relay]: 4,
};

export const eventStartTimes: Partial<Record<EventName, string>> = {
  [EventName.Tamaire]: '10:10',
  [EventName.BallCarry]: '11:10',
  [EventName.LeggedRace]: '12:30',
  [EventName.TugOfWar]: '13:40',
  [EventName.Relay]: '14:10',
};
