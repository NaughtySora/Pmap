"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { Pmap } = require("../lib/js/Pmap.js");

const example = keys => {
  const values = Array.from(keys, key => key);
  const map = new Pmap(keys, values, 2).test();
  for (const key of keys) assert.equal(map.get(key), key);
  const staticMap = new Pmap(keys, values, 2).test(map.key);
  for (const key of keys) assert.equal(staticMap.get(key), key);
};

describe("Pmap", () => {
  it("sqrt 12", () => {
    example([142, -538, -368, 435, 913, -759, -367, 95, 417, -462, -649, 274]);
  });

  it("bitwise 8", () => {
    example([-179, 910, -966, -694, 710, 712, 591, -78]);
  });
});