import React from 'react';
import { type Participant, type EventParticipation } from '../types';
import { EventCard } from './EventCard';

interface ParticipantCardProps {
  participant: Participant;
  onEventClick: (event: EventParticipation) => void;
}

export const ParticipantCard: React.FC<ParticipantCardProps> = ({ participant, onEventClick }) => {
  return (
    <div className="w-full max-w-2xl bg-slate-800 border border-slate-700 rounded-xl shadow-2xl shadow-indigo-900/20 p-6 md:p-8 animate-fade-in">
      <div className="mb-6 pb-4 border-b border-slate-700">
        <h2 className="text-3xl font-bold text-white">{participant.name}</h2>
        <p className="text-indigo-400 font-medium">{participant.school}</p>
      </div>
      <div className="space-y-4">
        <h3 className="text-slate-300 font-semibold text-lg">出場種目 ({participant.events.length})</h3>
        {participant.events.map((event, index) => (
          <EventCard key={`${event.eventName}-${index}`} event={event} onClick={() => onEventClick(event)} />
        ))}
      </div>
    </div>
  );
};