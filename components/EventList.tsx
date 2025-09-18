import React from 'react';
import { type EventParticipation } from '../types';
import { EventCard } from './EventCard';

interface EventListProps {
  events: EventParticipation[];
  onEventClick: (event: EventParticipation) => void;
}

export const EventList: React.FC<EventListProps> = ({ events, onEventClick }) => {
  return (
    <div className="w-full max-w-4xl animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white">開催種目一覧</h2>
        <p className="text-slate-400">各種目をタップすると参加者を確認できます。</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map((event, index) => (
          <EventCard
            key={`${event.eventName}-${event.team}-${event.details}-${index}`}
            event={event}
            onClick={() => onEventClick(event)}
          />
        ))}
      </div>
    </div>
  );
};
