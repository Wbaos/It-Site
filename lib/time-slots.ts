export type TimeSlotAvailabilityOptions = {
  dateIso: string;
  startHour: number;
  minimumHoursAhead?: number;
  now?: Date;
};

export type StandardTimeSlot = {
  label: string;
  value: string;
  startHour: number;
};

// Canonical time slots used across booking + request-quote flows.
export const STANDARD_TIME_SLOTS: readonly StandardTimeSlot[] = [
  { label: "8:00 AM - 11:00 AM", value: "08:00-11:00", startHour: 8 },
  { label: "11:00 AM - 2:00 PM", value: "11:00-14:00", startHour: 11 },
  { label: "2:00 PM - 5:00 PM", value: "14:00-17:00", startHour: 14 },
  { label: "5:00 PM - 8:00 PM", value: "17:00-20:00", startHour: 17 },
];

export function isTimeSlotAvailableForDate(
  options: TimeSlotAvailabilityOptions
): boolean {
  const { dateIso, startHour, minimumHoursAhead = 3 } = options;
  const now = options.now ?? new Date();

  if (!dateIso) return true;

  const selectedDate = new Date(`${dateIso}T00:00:00`);
  if (Number.isNaN(selectedDate.getTime())) return true;

  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  const selectedDateOnly = new Date(selectedDate);
  selectedDateOnly.setHours(0, 0, 0, 0);

  if (selectedDateOnly.getTime() > today.getTime()) return true;
  if (selectedDateOnly.getTime() < today.getTime()) return false;

  const currentTimeInHours = now.getHours() + now.getMinutes() / 60;
  const minimumBookingTime = currentTimeInHours + minimumHoursAhead;
  return startHour >= minimumBookingTime;
}
