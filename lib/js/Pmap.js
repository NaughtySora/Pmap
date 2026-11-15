"use strict"

const { Feistel } = require("./Feistel.js");

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


const ROUNDS = 2;

class Pmap {
  #key;
  #keys = null;
  #values = null;
  #sequence = null;
  #permutation = null;

  constructor(keys, values) {
    const limit = keys.length;
    this.#values = values;
    this.#keys = keys;
    this.#permutation = new Feistel({ limit, mixer, rounds: ROUNDS });
  }

  test(key = 0) {
    const keys = this.#keys;
    const length = keys.length;
    const sequence = Array(length);
    let i = 0;
    this.#key = key;
    while (i < length) {
      const idx = this.#permutation.get(keys[i], this.#key);
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

  get(value) {
    return this.#values[this.#sequence[this.#permutation.get(value, this.#key)]];
  }

  get key() {
    return this.#key;
  }
}

module.exports = { Pmap };