"use strict"

const mixer = (key, R) => {
  let x = (R ^ key) >>> 0;
  x ^= x >> 16;
  x = Math.imul(x, 0x45d9f3b3) >>> 0;
  x = (x + 0x9e3779b1) >>> 0;
  x = ((x << 13) | (x >>> 19)) >>> 0;
  x ^= x >> 15;
  x = Math.imul(x, 0x355d5bd9) >>> 0;
  x ^= x >> 16;
  return x >>> 0;
};

class Pmap {
  #key;
  #limit;
  #cycles;
  #meta = null;
  #keys = null;
  #values = null;
  #sequence = null;

  constructor(keys, values, cycles) {
    if (!!(cycles & 1)) {
      throw new RangeError("Cycles has to be even number");
    }
    const limit = keys.length;
    if (!Number.isInteger(limit) || limit < 1) {
      throw new RangeError("limit should be an integer and > 0");
    }
    this.#limit = limit;
    this.#cycles = cycles;
    this.#values = values;
    this.#keys = keys;
    this.#init();
  }

  #init() {
    const limit = this.#limit;
    const isBitwise = (limit & (limit - 1)) === 0;
    this.#meta = { isBitwise, };
    if (isBitwise) {
      const rShift = Math.floor(Math.log2(this.#limit) / 2);
      this.#meta.data = { rShift, rMask: (1 << rShift) - 1, };
    } else {
      let root = Math.floor(Math.sqrt(this.#limit));
      while ((this.#limit % root) !== 0) root--;
      this.#meta.data = { factor: this.#limit / root, };
    }
  }

  #index(key) {
    return this.#meta.isBitwise ? this.#bitwise(key) : this.#sqrt(key);
  }

  #bitwise(value) {
    const { rShift, rMask } = this.#meta.data;
    let L = value >> rShift;
    let R = value & rMask;
    let round = 0;
    while (round++ < this.#cycles) {
      const l = L;
      L = R;
      R = l ^ mixer(this.#key, R);
    }
    return ((L << rShift) | R) & (this.#limit - 1);
  }

  #sqrt(value) {
    const factor = this.#meta.data.factor;
    let L = Math.floor(value / factor);
    let R = value % factor;
    let round = 0;
    while (round++ < this.#cycles) {
      const l = L;
      L = R;
      R = l + mixer(this.#key, R);
    }
    return (L * factor + R) % this.#limit;
  }

  test(key = 0) {
    const keys = this.#keys;
    const length = keys.length;
    const sequence = Array(length);
    let i = 0;
    this.#key = key;
    while (i < length) {
      const idx = this.#index(keys[i]);
      if (sequence[idx] != undefined) {
        sequence.length = 0;
        this.#key++;
        i = 0;
        continue;
      }
      sequence[idx] = i;
      i++;
    }
    this.#sequence = sequence;
    return this;
  }

  get(key) {
    return this.#values[this.#sequence[this.#index(key)]];
  }

  get key() {
    return this.#key;
  }
}

module.exports = { Pmap };