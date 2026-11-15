"use strict";

class Feistel {
  #limit;
  #rounds;
  #meta = null;
  #mixer = null;

  constructor({ limit, rounds, mixer }) {
    if (!!(cycles & 1)) {
      throw new RangeError("Cycles has to be even number");
    }
    if (!Number.isInteger(limit) || limit < 1) {
      throw new RangeError("limit should be an integer and > 0");
    }
    this.#limit = limit;
    this.#rounds = rounds;
    this.#mixer = mixer;
    if (this.isBitwise) {
      const rShift = Math.floor(Math.log2(this.#limit) / 2);
      this.#meta = { rShift, rMask: (1 << rShift) - 1, };
    } else {
      let root = Math.floor(Math.sqrt(this.#limit));
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
    let L = value >> rShift;
    let R = value & rMask;
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
    let L = Math.floor(value / factor);
    let R = value % factor;
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