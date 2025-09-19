import React from 'react';
import { type EventParticipation } from '../types';
import { EventIcon } from './Icons';
import { eventStartTimes } from '../data/timetable';

interface EventCardProps {
  event: EventParticipation;
  onClick: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-4 flex items-center space-x-4 transition-transform hover:scale-105 hover:bg-slate-700/50 duration-200 text-left"
      aria-label={`View participants for ${event.eventName} - ${event.team}`}
    >
      <div className="flex-shrink-0 bg-slate-900/50 p-3 rounded-full">
        <EventIcon eventName={event.eventName} className="w-6 h-6 text-indigo-400" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-lg text-slate-100">{event.eventName}</h3>
          {eventStartTimes[event.eventName] && (
            <span className="text-xs font-semibold bg-indigo-600 text-white px-2 py-0.5 rounded">
              {eventStartTimes[event.eventName]}
            </span>
          )}
        </div>
        <p className="text-sm text-slate-400">
          {event.team} / <span className="font-medium text-slate-300">{event.details}</span>
        </p>
      </div>
    </button>
  );
};