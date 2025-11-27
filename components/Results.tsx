import React, { useMemo, useEffect, useRef } from 'react';
import { ScheduleResult, TimelineEvent } from '../types';
import { formatTimeDisplay, formatDuration } from '../utils/time';
import { CoffeeIcon, BanIcon, ClockIcon, SunIcon, MoonIcon, CheckCircleIcon } from './Icons';
import * as d3 from 'd3';

interface ResultsProps {
  result: ScheduleResult;
  onReset: () => void;
}

const TimelineCard: React.FC<{ event: TimelineEvent; index: number }> = ({ event, index }) => {
  const isOptimal = event.type === 'optimal';
  const isAvoid = event.type === 'avoid';
  const isWait = event.type === 'wait';

  const borderColor = isOptimal ? 'border-green-500' : isAvoid ? 'border-red-400' : isWait ? 'border-amber-400' : 'border-stone-300';
  const bgColor = isOptimal ? 'bg-green-50' : isAvoid ? 'bg-red-50' : isWait ? 'bg-amber-50' : 'bg-stone-50';
  const iconColor = isOptimal ? 'text-green-600' : isAvoid ? 'text-red-500' : isWait ? 'text-amber-600' : 'text-stone-400';

  let Icon = ClockIcon;
  if (isOptimal) Icon = CoffeeIcon;
  if (isAvoid) Icon = BanIcon;
  if (event.label === 'Sleep') Icon = MoonIcon;
  if (event.type === 'wait') Icon = SunIcon;

  return (
    <div className={`relative flex items-start gap-4 p-4 rounded-xl border-l-4 ${borderColor} ${bgColor} shadow-sm mb-4 transition-all duration-300 hover:shadow-md`}>
      <div className={`mt-1 p-2 rounded-full bg-white ${iconColor}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <h4 className={`font-bold ${isOptimal ? 'text-stone-800' : 'text-stone-600'}`}>{event.label}</h4>
          <span className="text-xs font-mono font-medium text-stone-500 bg-white/80 px-2 py-1 rounded-md border border-stone-200">
            {formatTimeDisplay(event.startMinutes)} - {formatTimeDisplay(event.endMinutes)}
          </span>
        </div>
        <p className="text-sm text-stone-600 leading-relaxed">
          {event.description}
        </p>
      </div>
    </div>
  );
};

export const Results: React.FC<ResultsProps> = ({ result, onReset }) => {
    
  return (
    <div className="animate-fade-in-up">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-coffee-800 mb-2">Your Coffee Schedule</h2>
        <p className="text-coffee-600">Optimized for peak energy and deep sleep</p>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex flex-col items-center justify-center text-center">
          <span className="text-stone-500 text-sm font-medium uppercase tracking-wider mb-2">Daily Limit</span>
          <div className="flex items-end gap-2 text-coffee-800">
             <span className="text-4xl font-bold">{result.maxCaffeineMg}</span>
             <span className="text-lg font-medium mb-1">mg</span>
          </div>
          <p className="text-xs text-stone-400 mt-2">Approx. {result.cupsRecommendation} cups (8oz)</p>
        </div>

        <div className="bg-green-50 p-6 rounded-2xl shadow-sm border border-green-100 flex flex-col items-center justify-center text-center">
          <span className="text-green-700 text-sm font-medium uppercase tracking-wider mb-2">First Cup</span>
          <div className="flex items-center gap-2 text-green-900">
             <CheckCircleIcon className="w-6 h-6" />
             <span className="text-3xl font-bold">{result.windowStart}</span>
          </div>
          <p className="text-xs text-green-600 mt-2">Wait 90min after wake</p>
        </div>

        <div className="bg-red-50 p-6 rounded-2xl shadow-sm border border-red-100 flex flex-col items-center justify-center text-center">
          <span className="text-red-700 text-sm font-medium uppercase tracking-wider mb-2">Last Call</span>
          <div className="flex items-center gap-2 text-red-900">
             <BanIcon className="w-6 h-6" />
             <span className="text-3xl font-bold">{result.windowEnd}</span>
          </div>
          <p className="text-xs text-red-600 mt-2">10h before bed</p>
        </div>
      </div>

      {/* Warnings */}
      {result.warnings.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
          <h4 className="text-amber-800 font-bold text-sm uppercase mb-2">Note</h4>
          <ul className="list-disc list-inside text-sm text-amber-900 space-y-1">
            {result.warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Vertical Timeline */}
      <div className="relative border-l-2 border-stone-200 ml-4 md:ml-6 pl-6 md:pl-8 space-y-2 mb-12">
        {result.timelineEvents.map((event, index) => (
          <TimelineCard key={index} event={event} index={index} />
        ))}
      </div>

      {/* Action */}
      <div className="text-center pb-8">
        <button
          onClick={onReset}
          className="text-stone-500 hover:text-stone-800 font-medium underline underline-offset-4 transition-colors"
        >
          Recalculate Schedule
        </button>
      </div>
    </div>
  );
};