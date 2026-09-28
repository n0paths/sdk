import {
  N0PathsError,
} from "./types.js";

/**
 * n0paths engine fixed-point scale.
 *
 * 1 WAD = 1e18
 */
export const WAD =
  1_000_000_000_000_000_000n;

export const WAD_DECIMALS = 18;

/**
 * Convert a human-readable decimal value into WAD.
 *
 * Examples:
 *
 * 1      -> 1000000000000000000n
 * 100    -> 100000000000000000000n
 * 0.60   -> 600000000000000000n
 * 0.04   -> 40000000000000000n
 *
 * String input is preferred when exact decimal representation matters.
 */
export function toWad(
  value: number | string,
): bigint {
  const input =
    typeof value === "number"
      ? numberToDecimalString(value)
      : value.trim();

  if (input.length === 0) {
    throw new N0PathsError(
      "INVALID_INPUT",
      "cannot convert an empty value to WAD",
    );
  }

  const match =
    /^([+-]?)(\d+)(?:\.(\d*))?$/.exec(
      input,
    );

  if (match === null) {
    throw new N0PathsError(
      "INVALID_INPUT",
      `invalid decimal value: ${input}`,
    );
  }

  const sign =
    match[1] === "-"
      ? -1n
      : 1n;

  const whole =
    match[2] ?? "0";

  const fraction =
    match[3] ?? "";

  if (
    fraction.length >
    WAD_DECIMALS
  ) {
    throw new N0PathsError(
      "INVALID_INPUT",
      `value has more than ${WAD_DECIMALS} decimal places`,
    );
  }

  const paddedFraction =
    fraction.padEnd(
      WAD_DECIMALS,
      "0",
    );

  const wholeWad =
    BigInt(whole) * WAD;

  const fractionalWad =
    paddedFraction.length === 0
      ? 0n
      : BigInt(
          paddedFraction,
        );

  return (
    sign *
    (
      wholeWad +
      fractionalWad
    )
  );
}

/**
 * Convert WAD into an exact decimal string.
 *
 * Trailing fractional zeroes are removed.
 */
export function fromWad(
  value: bigint,
): string {
  const negative =
    value < 0n;

  const absolute =
    negative
      ? -value
      : value;

  const whole =
    absolute / WAD;

  const fraction =
    absolute % WAD;

  if (fraction === 0n) {
    return `${
      negative ? "-" : ""
    }${whole.toString()}`;
  }

  const fractionString =
    fraction
      .toString()
      .padStart(
        WAD_DECIMALS,
        "0",
      )
      .replace(
        /0+$/,
        "",
      );

  return `${
    negative ? "-" : ""
  }${whole.toString()}.${fractionString}`;
}

/**
 * Convert WAD into a JavaScript number.
 *
 * Useful for UI/display calculations.
 *
 * This conversion can lose precision because JavaScript numbers use
 * IEEE-754 floating-point representation.
 */
export function wadToNumber(
  value: bigint,
): number {
  const result =
    Number(
      fromWad(value),
    );

  if (!Number.isFinite(result)) {
    throw new N0PathsError(
      "INVALID_INPUT",
      "WAD value cannot be represented as a finite JavaScript number",
    );
  }

  return result;
}

/**
 * Convert a finite JavaScript number into a normal decimal string.
 *
 * Scientific notation is expanded because toWad intentionally accepts
 * canonical decimal notation only.
 */
function numberToDecimalString(
  value: number,
): string {
  if (!Number.isFinite(value)) {
    throw new N0PathsError(
      "INVALID_INPUT",
      "WAD input must be finite",
    );
  }

  const stringValue =
    value.toString();

  if (
    !stringValue.includes("e") &&
    !stringValue.includes("E")
  ) {
    return stringValue;
  }

  return expandScientificNotation(
    stringValue,
  );
}

/**
 * Expand values such as:
 *
 * 1e-7  -> 0.0000001
 * 1e3   -> 1000
 */
function expandScientificNotation(
  value: string,
): string {
  const match =
    /^([+-]?)(\d+)(?:\.(\d+))?[eE]([+-]?\d+)$/.exec(
      value,
    );

  if (match === null) {
    throw new N0PathsError(
      "INVALID_INPUT",
      `invalid numeric value: ${value}`,
    );
  }

  const sign =
    match[1] ?? "";

  const integer =
    match[2] ?? "0";

  const fraction =
    match[3] ?? "";

  const exponent =
    Number(match[4]);

  const digits =
    integer + fraction;

  const decimalPosition =
    integer.length +
    exponent;

  if (decimalPosition <= 0) {
    return (
      sign +
      "0." +
      "0".repeat(
        -decimalPosition,
      ) +
      digits
    );
  }

  if (
    decimalPosition >=
    digits.length
  ) {
    return (
      sign +
      digits +
      "0".repeat(
        decimalPosition -
        digits.length,
      )
    );
  }

  return (
    sign +
    digits.slice(
      0,
      decimalPosition,
    ) +
    "." +
    digits.slice(
      decimalPosition,
    )
  );
}
