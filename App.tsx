import React, { useState, useCallback, useMemo } from 'react';
import { participantsData, rawData, memberDetails } from './data/participants';
import { type Participant, type EventParticipation, type ParticipantDetails } from './types';
import { ParticipantCard } from './components/ParticipantCard';
import { EventParticipantsModal } from './components/EventParticipantsModal';
import { EventList } from './components/EventList';

// Define animations in Tailwind config or a style tag if needed. Here we define it in the component for simplicity.
const animationStyle = `
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fade-in 0.5s ease-out forwards;
  }
  @keyframes fade-in-fast {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  .animate-fade-in-fast {
    animation: fade-in-fast 0.2s ease-out forwards;
  }
  @keyframes slide-up {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-slide-up {
    animation: slide-up 0.3s ease-out forwards;
  }
`;

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Participant[] | undefined>(undefined);
  const [selectedEvent, setSelectedEvent] = useState<{ event: EventParticipation, participants: ParticipantDetails[] } | null>(null);

  const uniqueEvents = useMemo(() => {
    const uniqueEventsMap = new Map<string, EventParticipation>();
    rawData.forEach(event => {
        const key = `${event.eventName}-${event.team}-${event.details}`;
        if (!uniqueEventsMap.has(key)) {
            uniqueEventsMap.set(key, {
                eventName: event.eventName,
                team: event.team,
                details: event.details,
            });
        }
    });
    return Array.from(uniqueEventsMap.values());
  }, []);

  const normalizeQuery = useCallback((q: string) => {
    // Normalize to NFKC, remove zero-width characters, convert full-width spaces to ASCII, collapse spaces
    const zeroWidth = /[\u200B-\u200D\uFEFF]/g; // ZWSP, ZWNJ, ZWJ, BOM
    return q
      .normalize('NFKC')
      .replace(zeroWidth, '')
      .replace(/\u3000/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }, []);

  const handleSearch = useCallback(() => {
    const normalized = normalizeQuery(searchQuery);
    if (!normalized) {
      setSearchResults(undefined);
      return;
    }
    const tokens = normalized.split(' ').filter(Boolean);

    // Collect results, splitting homonyms (multiple details) into separate cards
    const results: Participant[] = [];
    const seen = new Set<string>();

    for (const [, participant] of participantsData.entries()) {
      const baseName = participant.name;
      if (!tokens.some(t => baseName.includes(t))) continue;

      const details = (memberDetails as Record<string, any>)[baseName];
      if (Array.isArray(details)) {
        // If this participant identity is disambiguated (has grade/department), only show the matching one
        if (participant.grade && participant.department) {
          const match = details.find((d: any) => d.grade === participant.grade && d.department === participant.department);
          if (match) {
            const displayName = `${baseName}（${match.department}・${match.grade}年）`;
            if (!seen.has(displayName)) {
              seen.add(displayName);
              results.push({ ...participant, name: displayName });
            }
          } else {
            // No match found (shouldn't happen), fallback to base name once
            if (!seen.has(baseName)) {
              seen.add(baseName);
              results.push(participant);
            }
          }
        } else {
          // Unknown identity: show all variants (legacy behavior)
          for (const d of details) {
            const displayName = `${baseName}（${d.department}・${d.grade}年）`;
            if (seen.has(displayName)) continue;
            seen.add(displayName);
            results.push({ ...participant, name: displayName });
          }
        }
      } else if (details) {
        const displayName = `${baseName}（${details.department}・${details.grade}年）`;
        if (!seen.has(displayName)) {
          seen.add(displayName);
          results.push({ ...participant, name: displayName });
        }
      } else {
        // Fallback if no details are found
        if (!seen.has(baseName)) {
          seen.add(baseName);
          results.push(participant);
        }
      }
    }

    setSearchResults(results);
  }, [normalizeQuery, searchQuery]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleEventClick = useCallback((event: EventParticipation) => {
    const eventData = rawData.find(
      (e) =>
        e.eventName === event.eventName &&
        e.team === event.team &&
        e.details === event.details
    );
    if (eventData) {
      const occurrenceMap = new Map<string, number>();
      const participantsWithDetails: ParticipantDetails[] = (eventData.members as any[]).map((m: any) => {
        if (typeof m === 'object' && m && 'name' in m && 'grade' in m && 'department' in m) {
          return { name: m.name as string, grade: m.grade as number, department: m.department as string };
        }
        const name = m as string;
        const details = (memberDetails as Record<string, any>)[name];
        // Fallback for any participant not in the details map
        if (!details) return { name, grade: 0, department: '不明' };
        if (Array.isArray(details)) {
          const count = occurrenceMap.get(name) ?? 0;
          const picked = details[Math.min(count, details.length - 1)];
          occurrenceMap.set(name, count + 1);
          return { name, ...picked };
        }
        return { name, ...details };
      });
      setSelectedEvent({ event, participants: participantsWithDetails });
    }
  }, []);

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };
  
  const InfoCard: React.FC<{icon: string; title: string; text: string;}> = ({icon, title, text}) => (
     <div className="text-center p-8 bg-slate-800 border border-slate-700 rounded-xl max-w-lg animate-fade-in">
        <div className="text-5xl mb-4">{icon}</div>
        <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
        <p className="text-slate-400">{text}</p>
    </div>
  );


  return (
    <>
      <style>{animationStyle}</style>
      <div className="min-h-screen bg-slate-900 text-white font-sans flex flex-col items-center p-4 pt-16 sm:pt-24">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-2">
            スポーツ大会
          </h1>
          <p className="text-lg text-indigo-400">出場者検索</p>
        </header>

        <div className="w-full max-w-lg mb-10">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="選手名を入力... (例: 山中 井戸)"
              className="w-full pl-5 pr-20 py-4 text-lg bg-slate-800 border border-slate-700 rounded-full text-white placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all duration-300"
            />
            <button
              onClick={handleSearch}
              className="absolute inset-y-0 right-0 flex items-center justify-center px-6 m-1.5 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500 transition-colors duration-200"
            >
              検索
            </button>
          </div>
        </div>

        <main className="w-full flex justify-center px-4 pb-16">
          {searchResults === undefined && (
             <EventList events={uniqueEvents} onEventClick={handleEventClick} />
          )}
          {searchResults !== undefined && searchResults.length === 0 && (
            <InfoCard icon="🤷" title="選手が見つかりません" text="入力した名前をもう一度確認してください。部分一致で検索されます。" />
          )}
          {searchResults && searchResults.length > 0 && (
            <div className="w-full max-w-2xl flex flex-col gap-8">
              {searchResults.map((participant) => (
                <ParticipantCard key={participant.name} participant={participant} onEventClick={handleEventClick} />
              ))}
            </div>
          )}
        </main>
        {selectedEvent && (
          <EventParticipantsModal
            event={selectedEvent.event}
            participants={selectedEvent.participants}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </>
  );
};

export default App;