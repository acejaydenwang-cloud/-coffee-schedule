export enum CaffeineSensitivity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export interface UserData {
  height: number;
  weight: number;
  wakeTime: string; // HH:mm
  bedTime: string; // HH:mm
  sensitivity: CaffeineSensitivity;
}

export interface ScheduleResult {
  maxCaffeineMg: number;
  cupsRecommendation: number; // Based on ~95mg/cup
  windowStart: string; // HH:mm
  windowEnd: string; // HH:mm
  timelineEvents: TimelineEvent[];
  warnings: string[];
}

export interface TimelineEvent {
  startMinutes: number;
  endMinutes: number;
  label: string;
  type: 'sleep' | 'wait' | 'optimal' | 'avoid';
  description: string;
}