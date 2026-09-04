/**
 * The canonical reference-date and business-day policy for performance
 * calculation.
 *
 * Every snapshot produced by the recalculation engine derives its period
 * from this single policy, so "current date", "specified date", "date
 * range", "month", "year-to-date" and "trailing 12 months" are always
 * resolved consistently across the whole system.
 */

/** The reference windows a recalculation can target. */
export type ReferencePeriod =
  /** A single reference date (the anchor itself). */
  | "date"
  /** The calendar month that contains the anchor. */
  | "month"
  /** The year-to-date window ending at the anchor. */
  | "year-to-date"
  /** The trailing 12 calendar months ending at the anchor. */
  | "trailing-12m"
  /** An explicit inclusive start/end date range. */
  | "range";

/** A resolved inclusive reference window. */
export interface ReferenceSpan {
  /** The inclusive start of the resolved window. */
  start: Date;
  /** The inclusive end of the resolved window. */
  end: Date;
  /** The period type that produced the window. */
  period: ReferencePeriod;
}

/** Optional holiday calendar used by {@link ReferenceDatePolicy}. */
export interface HolidayCalendar {
  /** Returns whether `date` is a closed (non-business) day. */
  isClosed(date: Date): boolean;
}

/**
 * Options for building a {@link ReferenceDatePolicy}.
 */
export interface ReferenceDatePolicyOptions {
  /**
   * A holiday calendar. When omitted, only weekends are treated as
   * non-business days.
   */
  holidays?: HolidayCalendar;
}

/**
 * The canonical reference-date and business-day policy.
 *
 * All dates are compared by their UTC calendar day (year, month, day) so
 * that time-of-day never affects period boundaries.
 */
export class ReferenceDatePolicy {
  private readonly holidays: HolidayCalendar | undefined;

  constructor(options: ReferenceDatePolicyOptions = {}) {
    this.holidays = options.holidays;
  }

  /**
   * Returns the UTC calendar day of a date (midnight, normalized).
   */
  dayOf(date: Date): Date {
    return new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
    );
  }

  /**
   * Tells whether `date` is a business day.
   *
   * A business day is a weekday that is not listed as closed in the
   * holiday calendar.
   */
  isBusinessDay(date: Date): boolean {
    const DAY = date.getUTCDay();
    if (DAY === 0 || DAY === 6) {
      return false;
    }
    return !this.holidays?.isClosed(date);
  }

  /**
   * Returns the most recent business day at or before `date`.
   */
  previousBusinessDay(date: Date): Date {
    let CANDIDATE = this.dayOf(date);
    while (!this.isBusinessDay(CANDIDATE)) {
      CANDIDATE = new Date(CANDIDATE.getTime() - DAY_MS);
    }
    return CANDIDATE;
  }

  /**
   * Resolves the inclusive reference window for a period anchored at
   * `anchor`.
   *
   * @param period - The period type to resolve.
   * @param anchor - The reference date the window is anchored to.
   * @param opts - When `{ businessDay: true }` and `period` is `"date"`,
   *   the anchor snaps back to the last business day.
   * @returns The resolved inclusive window.
   */
  resolve(
    period: ReferencePeriod,
    anchor: Date,
    opts: { businessDay?: boolean } = {},
  ): ReferenceSpan {
    if (period === "range") {
      throw new Error(
        "ReferenceDatePolicy.resolve does not accept 'range'; use a RangeReference instead.",
      );
    }

    const END = this.dayOf(anchor);

    switch (period) {
      case "date":
        return {
          start: opts.businessDay ? this.previousBusinessDay(END) : END,
          end: opts.businessDay ? this.previousBusinessDay(END) : END,
          period,
        };
      case "month": {
        const START = new Date(
          Date.UTC(END.getUTCFullYear(), END.getUTCMonth(), 1),
        );
        return { start: START, end: END, period };
      }
      case "year-to-date": {
        const START = new Date(Date.UTC(END.getUTCFullYear(), 0, 1));
        return { start: START, end: END, period };
      }
      case "trailing-12m": {
        const START = new Date(
          Date.UTC(END.getUTCFullYear() - 1, END.getUTCMonth() + 1, 1),
        );
        return { start: START, end: END, period };
      }
    }
  }

  /**
   * Builds the list of business days between `start` and `end`
   * (inclusive).
   */
  businessDaysBetween(start: Date, end: Date): Date[] {
    const DAYS: Date[] = [];
    const ITER = this.dayOf(start);
    const END_DAY = this.dayOf(end).getTime();
    while (ITER.getTime() <= END_DAY) {
      if (this.isBusinessDay(ITER)) {
        DAYS.push(new Date(ITER));
      }
      ITER.setTime(ITER.getTime() + DAY_MS);
    }
    return DAYS;
  }
}

/**
 * A reference window expressed as an explicit inclusive date range.
 */
export class RangeReference {
  readonly span: ReferenceSpan;

  constructor(start: Date, end: Date) {
    if (start.getTime() > end.getTime()) {
      throw new Error("RangeReference start must not be after its end.");
    }
    this.span = { start, end, period: "range" };
  }
}

const DAY_MS = 86_400_000;
