"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { Pmap } = require("../lib/Pmap.js");

describe("Pmap", () => {
  it("small example", () => {
    const keys = [55, 44, 22];
    const map = new Pmap(keys, keys, 2).test();
    for (const key of keys) assert.equal(map.get(key), key);
    const staticMap = new Pmap(keys, keys, 2).test(map.key);
    for (const key of keys) assert.equal(staticMap.get(key), key);
  });

  it("extended example", () => {
    const ITEMS = 12;
    const keys = Array.from({ length: ITEMS }, (_, idx) => (idx + 1) * 10);
    const values = Array.from(keys, key => key);
    const map = new Pmap(keys, values, 2).test();
    for (const key of keys) assert.equal(map.get(key), key);
    const staticMap = new Pmap(keys, values, 2).test(map.key);
    for (const key of keys) assert.equal(staticMap.get(key), key);
  });
});