import React from 'react';
import { timetable } from '../data/timetable';
import { EventName } from '../types';

interface TimetableProps {
  onCompetitionClick?: (eventName: EventName) => void;
}

export const Timetable: React.FC<TimetableProps> = ({ onCompetitionClick }) => {
  return (
    <section className="w-full max-w-4xl mb-10 animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white">タイムテーブル</h2>
        <p className="text-slate-400">本日のスケジュール（時間順）</p>
      </div>
      <ul className="space-y-3">
        {timetable.map((item, idx) => {
          const isOther = item.type === 'other';
          const isClickable = !isOther && item.eventName && !!onCompetitionClick;
          const card = isOther
            ? 'bg-amber-900/30 border-amber-700/60'
            : 'bg-indigo-900/30 border-indigo-700/60';
          const hover = isClickable ? 'cursor-pointer hover:bg-indigo-900/40 transition-colors' : '';
          const badge = isOther
            ? 'bg-amber-600 text-amber-50'
            : 'bg-indigo-600 text-indigo-50';
          const content = (
            <>
              <div className="flex-shrink-0">
                <div className={`text-sm font-bold px-2 py-1 rounded ${badge}`}>{item.time}</div>
              </div>
              <div className="flex-1">
                <div className="text-slate-100 font-semibold">{item.title}</div>
                {item.note && <div className="text-slate-400 text-sm mt-1">{item.note}</div>}
              </div>
              <div className="text-xs text-slate-400">
                {isOther ? '連絡事項' : '競技'}
              </div>
            </>
          );
          return (
            <li
              key={idx}
              className={`w-full border rounded-lg p-4 flex items-center gap-4 ${card} ${hover}`}
              onClick={() => {
                if (isClickable) onCompetitionClick!(item.eventName!);
              }}
              role={isClickable ? 'button' : undefined}
              aria-label={isClickable ? `${item.title} の参加者を見る` : undefined}
              tabIndex={isClickable ? 0 : -1}
              onKeyDown={(e) => {
                if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  onCompetitionClick!(item.eventName!);
                }
              }}
            >
              {content}
            </li>
          );
        })}
      </ul>
    </section>
  );
};
