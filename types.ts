// Fix: Removed circular import of EventName from './types' which was causing a conflict.
export enum EventName {
  Tamaire = '玉入れ',
  BallCarry = 'Let\'sボール運び',
  LeggedRace = '20人21脚',
  TugOfWar = '綱引き',
  Relay = '学校対抗リレー'
}

export interface EventParticipation {
  eventName: EventName;
  team: string;
  details: string; 
}

export interface Participant {
  name: string;
  school: string;
  events: EventParticipation[];
  // Optional identity metadata to disambiguate homonyms
  grade?: number;
  department?: string;
}

export interface ParticipantDetails {
    name: string;
    grade: number;
    department: string;
}