/**
 * Shared constants used by the n0paths SDK.
 *
 * Contract-specific deployment addresses intentionally live outside this
 * module so numerical conventions remain independent from deployments.
 */

/**
 * Fixed-point precision used by the n0paths engine.
 */
export const WAD_DECIMALS = 18;

export const WAD =
  1_000_000_000_000_000_000n;

/**
 * Time conventions used by the high-level SDK.
 *
 * timeToExpiry is expressed in years at the public SDK boundary.
 */
export const DAYS_PER_YEAR = 365;

export const HOURS_PER_DAY = 24;

export const SECONDS_PER_HOUR = 60 * 60;

export const SECONDS_PER_DAY =
  HOURS_PER_DAY *
  SECONDS_PER_HOUR;

export const SECONDS_PER_YEAR =
  DAYS_PER_YEAR *
  SECONDS_PER_DAY;

/**
 * Numerical boundaries enforced by the SDK before values reach
 * the contract layer.
 *
 * These are SDK safety limits rather than claims about the complete
 * mathematical domain of the pricing model.
 */
export const LIMITS = {
  MIN_SPOT: 0,
  MIN_STRIKE: 0,
  MIN_VOLATILITY: 0,
  MIN_TIME_TO_EXPIRY: 0,

  MIN_OBSERVATIONS: 1,

  /**
   * Conservative client-side ceiling.
   *
   * The engine's second-moment calculation grows approximately O(n²),
   * so extremely large observation counts should not be accepted
   * accidentally by high-level applications.
   */
  MAX_OBSERVATIONS: 365,
} as const;

/**
 * Model identifiers.
 *
 * Keeping identifiers explicit allows future SDK versions to expose
 * additional pricing methods without silently changing existing behavior.
 */
export const MODELS = {
  ARITHMETIC_ASIAN_GBM:
    "arithmetic-asian-gbm",
} as const;

export type ModelId =
  (typeof MODELS)[keyof typeof MODELS];

/**
 * Instrument identifiers currently understood by the SDK.
 */
export const INSTRUMENTS = {
  ASIAN_CALL:
    "asian-call",
} as const;

export type InstrumentId =
  (typeof INSTRUMENTS)[keyof typeof INSTRUMENTS];

/**
 * Current SDK numerical convention.
 */
export const NUMERICAL_CONVENTION = {
  fixedPoint: "WAD",
  decimals: WAD_DECIMALS,
  timeUnit: "years",
  rateConvention: "continuous",
  volatilityConvention: "annualized",
  observationAtStart: false,
  observationAtExpiry: true,
} as const;
