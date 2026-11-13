"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { Pmap } = require("../lib/Pmap.js");

describe("Pmap", () => {
  it("3 items", () => {
    const keys = [55, 44, 22];
    const values = [() => 55, () => 44, () => 22];
    const map = new Pmap(keys, values, 2).test();
    assert.equal(map.get(keys[0])(), keys[0]);
    assert.equal(map.get(keys[1])(), keys[1]);
    assert.equal(map.get(keys[2])(), keys[2]);
    const staticMap = new Pmap(keys, values, 2).use(map.sequence, map.key);
    assert.equal(staticMap.get(keys[0])(), keys[0]);
    assert.equal(staticMap.get(keys[1])(), keys[1]);
    assert.equal(staticMap.get(keys[2])(), keys[2]);
  });
});