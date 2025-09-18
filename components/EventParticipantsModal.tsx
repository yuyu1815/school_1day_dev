import React, { useEffect, useMemo } from 'react';
import { type EventParticipation, type ParticipantDetails } from '../types';
import { EventIcon } from './Icons';

interface EventParticipantsModalProps {
  event: EventParticipation;
  participants: ParticipantDetails[];
  onClose: () => void;
}

export const EventParticipantsModal: React.FC<EventParticipantsModalProps> = ({ event, participants, onClose }) => {
  // Effect to handle 'Escape' key press for closing the modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  // Effect to prevent the background from scrolling when the modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const groupedParticipants = useMemo(() => {
    // Build frequency of base names within this event to detect duplicates
    const baseName = (n: string) => n.replace(/\(.+?\)/g, '');
    const freq = new Map<string, number>();
    for (const p of participants) {
      const key = baseName(p.name);
      freq.set(key, (freq.get(key) ?? 0) + 1);
    }

    // Prepare groups: department -> grade -> names[]
    const groups: Record<string, Record<string, string[]>> = {};

    participants.forEach(p => {
      const departmentKey = p.department;
      const gradeKey = `${p.grade}年`;

      if (!groups[departmentKey]) {
        groups[departmentKey] = {};
      }
      if (!groups[departmentKey][gradeKey]) {
        groups[departmentKey][gradeKey] = [];
      }

      const needsSuffix = (freq.get(baseName(p.name)) ?? 0) > 1;
      const alreadyHasParen = /\(.+?\)/.test(p.name);
      const displayName = needsSuffix && !alreadyHasParen ? `${p.name}(${gradeKey})` : p.name;

      groups[departmentKey][gradeKey].push(displayName);
    });

    // Sort departments alphabetically
    const sortedDepartments = Object.keys(groups).sort();
    const sortedGroups: Record<string, Record<string, string[]>> = {};
    sortedDepartments.forEach(dep => {
        // Sort grades numerically (1年, 2年, ...)
        const sortedGrades = Object.keys(groups[dep]).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
        sortedGroups[dep] = {};
        sortedGrades.forEach(grade => {
            // Sort names alphabetically
            sortedGroups[dep][grade] = groups[dep][grade].sort();
        });
    });

    return sortedGroups;
  }, [participants]);


  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in-fast"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl shadow-indigo-900/20 w-full max-w-md max-h-[80vh] flex flex-col animate-slide-up"
        onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
      >
        <header className="p-6 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 bg-slate-900/50 p-3 rounded-full">
              <EventIcon eventName={event.eventName} className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{event.eventName}</h2>
              <p className="text-sm text-slate-400">
                {event.team} / <span className="font-medium text-slate-300">{event.details}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </header>

        <main className="p-6 overflow-y-auto">
          <h3 className="text-slate-300 font-semibold mb-4">参加者一覧 ({participants.length}名)</h3>
          <div className="space-y-4">
            {Object.entries(groupedParticipants).map(([department, grades]) => (
              <div key={department}>
                <h4 className="font-bold text-indigo-400 border-b border-slate-600 pb-1 mb-2">{department}</h4>
                <div className="space-y-2 pl-2">
                  {Object.entries(grades).map(([grade, names]) => (
                    <div key={grade}>
                      <h5 className="text-sm font-semibold text-slate-300 mb-1">{grade}</h5>
                      <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 text-slate-200 text-sm">
                        {names.map((name, index) => (
                          <li key={`${name}-${index}`}>{name}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};