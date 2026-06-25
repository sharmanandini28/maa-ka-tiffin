// Shared booking cutoff logic — safe to import on client and server.
//
// Rules:
//  - Lunch for date D: must be booked before midnight (00:00) at the START of D,
//    i.e. by the night before. Allowed only if now < D 00:00.
//  - Dinner for date D: must be booked before 12:00 PM (noon) of D.
//    Allowed only if now < D 12:00.
//  - Future dates (>1 day ahead, up to 7) are always allowed.

export type Meal = "lunch" | "dinner";

export const MAX_ADVANCE_DAYS = 7;

export function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1, 0, 0, 0, 0);
}

export interface CutoffResult {
  allowed: boolean;
  /** The exact moment the booking window closes. */
  cutoff: Date;
  reason?: string;
}

export function getCutoffMoment(meal: Meal, dateKey: string): Date {
  const base = parseDateKey(dateKey);
  if (meal === "lunch") {
    // midnight at the start of the delivery day
    return new Date(base.getFullYear(), base.getMonth(), base.getDate(), 0, 0, 0, 0);
  }
  // dinner: noon on the delivery day
  return new Date(base.getFullYear(), base.getMonth(), base.getDate(), 12, 0, 0, 0);
}

export function checkCutoff(meal: Meal, dateKey: string, now: Date = new Date()): CutoffResult {
  const cutoff = getCutoffMoment(meal, dateKey);

  const today = parseDateKey(toDateKey(now));
  const target = parseDateKey(dateKey);
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + MAX_ADVANCE_DAYS);

  if (target < today) {
    return { allowed: false, cutoff, reason: "This date has already passed." };
  }
  if (target > maxDate) {
    return {
      allowed: false,
      cutoff,
      reason: `You can only book up to ${MAX_ADVANCE_DAYS} days in advance.`,
    };
  }

  if (now >= cutoff) {
    return {
      allowed: false,
      cutoff,
      reason:
        meal === "lunch"
          ? "Lunch cut-off has passed. Order by midnight the night before."
          : "Dinner cut-off has passed. Order by 12:00 PM the same day.",
    };
  }

  return { allowed: true, cutoff };
}

export function formatCountdown(ms: number): string {
  if (ms <= 0) return "Closed";
  const totalMinutes = Math.floor(ms / 60000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;
  const seconds = Math.floor((ms % 60000) / 1000);
  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  return `${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(
    seconds,
  ).padStart(2, "0")}s`;
}
