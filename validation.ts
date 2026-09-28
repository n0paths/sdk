import {
  N0PathsError,
  type Address,
  type AsianCall,
  type AsianCallQuoteRequest,
  type ChainConfig,
  type MarketState,
} from "./types.js";

/**
 * Throws a structured SDK error when a condition is not satisfied.
 */
function assert(
  condition: boolean,
  message: string,
): asserts condition {
  if (!condition) {
    throw new N0PathsError(
      "INVALID_INPUT",
      message,
    );
  }
}

/**
 * Validate a finite JavaScript number.
 */
function assertFinite(
  value: number,
  name: string,
): void {
  assert(
    Number.isFinite(value),
    `${name} must be finite`,
  );
}

/**
 * Validate an Ethereum address.
 *
 * This performs structural validation only.
 * Checksum validation can be introduced later at the transport layer.
 */
export function isAddress(
  value: string,
): value is Address {
  return /^0x[a-fA-F0-9]{40}$/.test(
    value,
  );
}

/**
 * Validate market inputs accepted by the SDK.
 */
export function validateMarketState(
  market: MarketState,
): void {
  assertFinite(
    market.spot,
    "spot",
  );

  assert(
    market.spot > 0,
    "spot must be greater than zero",
  );

  assertFinite(
    market.volatility,
    "volatility",
  );

  assert(
    market.volatility >= 0,
    "volatility must be non-negative",
  );

  assertFinite(
    market.riskFreeRate,
    "riskFreeRate",
  );

  assertFinite(
    market.dividendYield,
    "dividendYield",
  );
}

/**
 * Validate an arithmetic Asian call definition.
 */
export function validateAsianCall(
  option: AsianCall,
): void {
  assertFinite(
    option.strike,
    "strike",
  );

  assert(
    option.strike > 0,
    "strike must be greater than zero",
  );

  assertFinite(
    option.timeToExpiry,
    "timeToExpiry",
  );

  assert(
    option.timeToExpiry > 0,
    "timeToExpiry must be greater than zero",
  );

  assert(
    Number.isInteger(
      option.observations,
    ),
    "observations must be an integer",
  );

  assert(
    option.observations > 0,
    "observations must be greater than zero",
  );
}

/**
 * Validate a complete Asian call quote request.
 */
export function validateAsianCallQuoteRequest(
  request: AsianCallQuoteRequest,
): void {
  if (
    request === null ||
    typeof request !== "object"
  ) {
    throw new N0PathsError(
      "INVALID_INPUT",
      "quote request must be an object",
    );
  }

  validateMarketState(
    request.market,
  );

  validateAsianCall(
    request.option,
  );
}

/**
 * Validate chain configuration used by the SDK.
 */
export function validateChainConfig(
  chain: ChainConfig,
): void {
  assert(
    Number.isInteger(chain.chainId),
    "chainId must be an integer",
  );

  assert(
    chain.chainId > 0,
    "chainId must be greater than zero",
  );

  if (
    !isAddress(
      chain.engineAddress,
    )
  ) {
    throw new N0PathsError(
      "INVALID_ADDRESS",
      "engineAddress must be a valid Ethereum address",
    );
  }
}

/**
 * Convert an unknown address string into the SDK Address type.
 *
 * Useful when addresses originate from configuration files,
 * environment variables, or user input.
 */
export function parseAddress(
  value: string,
): Address {
  if (!isAddress(value)) {
    throw new N0PathsError(
      "INVALID_ADDRESS",
      `invalid Ethereum address: ${value}`,
    );
  }

  return value;
}
