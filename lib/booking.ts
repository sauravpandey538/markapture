/** Weekday index (0=Sun) → available UK time slots */
const SLOTS_BY_WEEKDAY: Record<number, string[]> = {
  1: ["10:00 AM", "2:00 PM"],
  2: ["11:00 AM", "3:00 PM"],
  3: ["10:00 AM", "4:00 PM"],
  4: ["11:00 AM", "2:00 PM"],
  5: ["10:00 AM", "1:00 PM"],
};

export type BookableDay = {
  date: string;
  label: string;
  weekday: string;
  slots: string[];
};

/** Next N weekdays with available consultation slots */
export function getBookableDays(count = 14): BookableDay[] {
  const days: BookableDay[] = [];
  const cursor = new Date();
  cursor.setHours(12, 0, 0, 0);

  while (days.length < count) {
    cursor.setDate(cursor.getDate() + 1);
    const dow = cursor.getDay();
    const slots = SLOTS_BY_WEEKDAY[dow];
    if (!slots) continue;

    const iso = cursor.toISOString().split("T")[0];
    days.push({
      date: iso,
      label: cursor.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      }),
      weekday: cursor.toLocaleDateString("en-GB", { weekday: "short" }),
      slots,
    });
  }

  return days;
}
