/**
 * Shared public types for the n0paths SDK.
 *
 * These types describe pricing inputs and outputs independently from
 * transport, RPC provider, or contract interaction.
 */

export type Address = `0x${string}`;

/**
 * Market state used by the pricing engine.
 *
 * Values are represented as human-readable numbers at the SDK boundary.
 *
 * Example:
 *   spot: 100
 *   volatility: 0.60
 *   riskFreeRate: 0.04
 *   dividendYield: 0
 */
export interface MarketState {
  /**
   * Current underlying price.
   */
  spot: number;

  /**
   * Annualized volatility.
   *
   * 0.60 represents 60%.
   */
  volatility: number;

  /**
   * Continuously compounded risk-free rate.
   *
   * 0.04 represents 4%.
   */
  riskFreeRate: number;

  /**
   * Continuous dividend or convenience yield.
   */
  dividendYield: number;
}

/**
 * Discretely monitored arithmetic Asian call.
 */
export interface AsianCall {
  /**
   * Option strike.
   */
  strike: number;

  /**
   * Time to expiry expressed in years.
   */
  timeToExpiry: number;

  /**
   * Number of future monitoring observations.
   *
   * The current engine convention excludes t = 0.
   */
  observations: number;
}

/**
 * Input accepted by an Asian call quote.
 */
export interface AsianCallQuoteRequest {
  market: MarketState;
  option: AsianCall;
}

/**
 * First two moments of the arithmetic average.
 */
export interface AsianMoments {
  firstMoment: number;
  secondMoment: number;
}

/**
 * Effective lognormal distribution parameters produced by moment matching.
 */
export interface LognormalFit {
  logMean: number;
  logVariance: number;
  logStandardDeviation: number;
}

/**
 * Numerical Greeks exposed by the SDK.
 */
export interface AsianGreeks {
  delta: number;
  vega: number;
}

/**
 * Complete high-level quote returned by the SDK.
 */
export interface AsianCallQuote {
  /**
   * Discounted deterministic option value.
   */
  price: number;

  /**
   * Analytical moments used by the approximation.
   */
  moments: AsianMoments;

  /**
   * Effective distribution parameters.
   *
   * Null represents a degenerate zero-variance distribution.
   */
  fit: LognormalFit | null;

  /**
   * Numerical sensitivities.
   */
  greeks?: AsianGreeks;
}

/**
 * Supported chain configuration.
 *
 * chainId remains generic so the SDK is not artificially restricted
 * to a single deployment.
 */
export interface ChainConfig {
  chainId: number;
  engineAddress: Address;
}

/**
 * Basic SDK configuration.
 *
 * RPC transport will be introduced separately so the public pricing
 * types do not depend on a particular Ethereum library.
 */
export interface N0PathsConfig {
  chain: ChainConfig;
}

/**
 * Error categories exposed by the SDK.
 */
export type N0PathsErrorCode =
  | "INVALID_INPUT"
  | "INVALID_ADDRESS"
  | "UNSUPPORTED_CHAIN"
  | "RPC_ERROR"
  | "ENGINE_ERROR";

/**
 * Structured SDK error.
 */
export class N0PathsError extends Error {
  readonly code: N0PathsErrorCode;

  readonly cause?: unknown;

  constructor(
    code: N0PathsErrorCode,
    message: string,
    cause?: unknown,
  ) {
    super(message);

    this.name = "N0PathsError";
    this.code = code;
    this.cause = cause;
  }
}
