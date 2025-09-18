
import React from 'react';
import { EventName } from '../types';

const TamaireIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="M12 5v14" />
    <path d="M18 6L6 18" />
    <path d="M6 6l12 12" />
    <circle cx="12" cy="12" r="10" />
  </svg>
);

const BallCarryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a5 5 0 0 0-5 5c0 1.8.8 3.4 2 4.4V22" />
    <path d="M15 9.3a5 5 0 0 0 4.1-2.1" />
    <path d="M15 22v-3.5a2.5 2.5 0 0 0-5 0V22" />
    <path d="M7 2a5 5 0 0 1 5 5" />
    <path d="M5 11.3a5 5 0 0 1-2.1-4.1" />
    <circle cx="12" cy="4.5" r="2.5" />
  </svg>
);

const LeggedRaceIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 17l4-4" />
    <path d="M4 21l4-4" />
    <path d="M8 13l4 4" />
    <path d="M12 17l4-4" />
    <path d="M16 13l4 4" />
    <path d="M20 17l-4-4" />
    <path d="M16 21l-4-4" />
    <path d="M12 17l-4 4" />
    <path d="M8 21l4-4" />
    <circle cx="6" cy="7" r="3" />
    <circle cx="18" cy="7" r="3" />
  </svg>
);

const TugOfWarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1.9 13.6c0 2 1.6 3.7 3.6 3.7s3.6-1.7 3.6-3.7v-2.2c0-2-1.6-3.7-3.6-3.7S1.9 9.5 1.9 11.4" />
    <path d="M14.9 13.6c0 2 1.6 3.7 3.6 3.7s3.6-1.7 3.6-3.7v-2.2c0-2-1.6-3.7-3.6-3.7s-3.6 1.7-3.6 3.7" />
    <path d="M9.1 11.4h5.8" />
    <path d="M5.5 11.4H4.2" />
    <path d="M19.8 11.4h-1.3" />
  </svg>
);

const RelayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m14.5 13.5 6-6" />
    <path d="m11.5 16.5 6-6" />
    <path d="m8.5 19.5 6-6" />
    <path d="m5.5 22.5 6-6" />
    <path d="m18.5 2.5-6 6" />
    <path d="m15.5 5.5-6 6" />
    <path d="m12.5 8.5-6 6" />
    <path d="m9.5 11.5-6 6" />
  </svg>
);


export const EventIcon: React.FC<{ eventName: EventName; className?: string }> = ({ eventName, className }) => {
  const defaultClassName = "w-8 h-8 text-indigo-400";
  const combinedClassName = `${defaultClassName} ${className || ''}`;

  switch (eventName) {
    case EventName.Tamaire:
      return <TamaireIcon />;
    case EventName.BallCarry:
      return <BallCarryIcon />;
    case EventName.LeggedRace:
      return <LeggedRaceIcon />;
    case EventName.TugOfWar:
      return <TugOfWarIcon />;
    case EventName.Relay:
      return <RelayIcon />;
    default:
      return null;
  }
};
