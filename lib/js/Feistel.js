"use strict";

const bitLength = n => {
  for (var bits = 0; n > 0; n >>= 1, bits++);
  return bits;
};

const isqrt = n => {
  if (n == 0 || n == 1) return n;
  for (var result = 1; result <= (n / result); result++);
  return result - 1;
};

// https://en.wikipedia.org/wiki/Feistel_cipher
class Feistel {
  #limit;
  #rounds;
  #meta = null;
  #mixer = null;

  constructor({ limit, rounds, mixer }) {
    if (!!(rounds & 1)) {
      throw new RangeError("Rounds has to be even number");
    }
    if (!Number.isInteger(limit) || limit < 1) {
      throw new RangeError("limit should be an integer and > 0");
    }
    this.#limit = limit;
    this.#rounds = rounds;
    this.#mixer = mixer;
    if (this.isBitwise) {
      const rShift = (bitLength(this.#limit) - 1) / 2;
      this.#meta = { rShift, rMask: (1 << rShift) - 1, };
    } else {
      let root = isqrt(this.#limit);
      while ((this.#limit % root) !== 0) root--;
      this.#meta = { factor: this.#limit / root, };
    }
  }

  get isBitwise() {
    return (this.#limit & (this.#limit - 1)) === 0;
  }

  get(value, key) {
    return this.isBitwise ? this.bitwise(value, key) :
      this.sqrt(value, key);
  }

  bitwise(value, key) {
    const { rShift, rMask } = this.#meta;
    let L = value >>> rShift;
    let R = (value >>> 0) & rMask;
    let round = 0;
    while (round++ < this.#rounds) {
      const l = L;
      L = R;
      R = l ^ this.#mixer(key, R);
    }
    return ((L << rShift) | R) & (this.#limit - 1);
  }

  sqrt(value, key) {
    const factor = this.#meta.factor;
    let L = Math.floor((value >>> 0) / factor);
    let R = (value >>> 0) % factor;
    let round = 0;
    while (round++ < this.#rounds) {
      const l = L;
      L = R;
      R = l + this.#mixer(key, R);
    }
    return (L * factor + R) % this.#limit;
  }
}

module.exports = { Feistel };