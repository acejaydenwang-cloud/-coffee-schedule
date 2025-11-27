import { CaffeineSensitivity, ScheduleResult, TimelineEvent, UserData } from '../types';
import { timeToMinutes, minutesToTime } from './time';

const AVG_COFFEE_MG = 95; // Average mg of caffeine in an 8oz cup

export const calculateSchedule = (data: UserData): ScheduleResult => {
  const warnings: string[] = [];

  // 1. Calculate Max Intake
  // Logic: 3-6mg/kg. We'll take an average of 4.5mg/kg for Normal, and half for High Sensitivity.
  // Low sensitivity might go up to the higher bound, but let's stick to safe averages.
  let factor = 4.5;
  if (data.sensitivity === CaffeineSensitivity.HIGH) {
    factor = 2.25;
  } else if (data.sensitivity === CaffeineSensitivity.LOW) {
    factor = 5.5;
  }

  const maxCaffeineMg = Math.round(data.weight * factor);
  const cupsRecommendation = Number((maxCaffeineMg / AVG_COFFEE_MG).toFixed(1));

  // 2. Calculate Key Timeframes (in minutes)
  const wakeMins = timeToMinutes(data.wakeTime);
  const bedMins = timeToMinutes(data.bedTime);

  // Cortisol Awakening Response: Wait 90 mins after waking
  const cortisolWaitMins = 90;
  const optimalStartMins = wakeMins + cortisolWaitMins;

  // Caffeine Curfew: Stop 10 hours (600 mins) before bed
  // If bed time is e.g. 01:00 (next day), we treat inputs as linear for calculation then wrap for display
  let adjustedBedMins = bedMins;
  if (bedMins < wakeMins) {
    adjustedBedMins += 1440; // Treat as next day
  }
  
  const curfewBufferMins = 600; // 10 hours
  const optimalEndMins = adjustedBedMins - curfewBufferMins;

  // 3. Validation
  const validWindow = optimalEndMins > optimalStartMins;
  
  if (!validWindow) {
    warnings.push("Your sleep schedule is too compressed to safely consume caffeine without affecting sleep (Wake to Curfew < 90mins).");
  } else if ((optimalEndMins - optimalStartMins) < 60) {
    warnings.push("Your optimal drinking window is very short (less than 1 hour).");
  }

  // 4. Generate Timeline Events
  const events: TimelineEvent[] = [];

  // Phase 1: Sleep (Before Wake) - visualizing the "Morning" sleep part
  // Usually we visualize a 24h cycle starting from Wake time or 00:00. 
  // Let's visualize from Wake Time - 2 hours to Bed Time + 2 hours to cover the day.
  // Or simpler: Just a list of phases starting from Wake.

  // 1. Wake Up -> Wait (90 mins)
  events.push({
    startMinutes: wakeMins,
    endMinutes: optimalStartMins,
    type: 'wait',
    label: 'Cortisol Awakening',
    description: 'Wait for cortisol levels to drop. Hydrate with water.',
  });

  // 2. Optimal Window
  if (validWindow) {
    events.push({
      startMinutes: optimalStartMins,
      endMinutes: optimalEndMins,
      type: 'optimal',
      label: 'Caffeine Window',
      description: `Best time for coffee. Target ${cupsRecommendation} cups max.`,
    });

    // 3. Curfew (End Window -> Bed)
    events.push({
      startMinutes: optimalEndMins,
      endMinutes: adjustedBedMins,
      type: 'avoid',
      label: 'Caffeine Curfew',
      description: 'Switch to decaf or herbal tea to protect sleep quality.',
    });
  } else {
     // Fallback if window is invalid
     events.push({
        startMinutes: optimalStartMins,
        endMinutes: adjustedBedMins,
        type: 'avoid',
        label: 'Avoid Caffeine',
        description: 'Your window is closed based on your sleep schedule.',
      });
  }

  // 4. Sleep
  events.push({
    startMinutes: adjustedBedMins,
    endMinutes: adjustedBedMins + 480, // Assuming 8h sleep visualization or just "until wake"
    type: 'sleep',
    label: 'Sleep',
    description: 'Rest and recovery.',
  });

  return {
    maxCaffeineMg,
    cupsRecommendation,
    windowStart: minutesToTime(optimalStartMins),
    windowEnd: minutesToTime(optimalEndMins),
    timelineEvents: events,
    warnings
  };
};