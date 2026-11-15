"use strict";

const { misc } = require("naughty-util");
const { Pmap } = require("../lib/js/Pmap.js");

const keys = [
  1, 6, 33, 80,
  90, 99, 15, 17,
  42, 43, 555, 1024,
  22222, 55555, 99000, 134456,
  19991, 55512, 11111, 12
];
const lookup = Array.from({ length: 1e6 }, () => misc.random(keys.length - 1, -1));

// nano ~54077557n
// {
//   const jsMap = new Map();
//   for (const k of keys) jsMap.set(k, k);
//   const start = process.hrtime.bigint();
//   const values = [];
//   for (const key of lookup) {
//     values.push(jsMap.get(key));
//   }
//   const end = process.hrtime.bigint();
//   console.log({ length: values.length, time: end - start });
// }

// nano ~ 64624418n
// {
//   const pMap = new Pmap(keys, keys, 2).test();
//   const start = process.hrtime.bigint();
//   const values = [];
//   for (const key of lookup) {
//     values.push(pMap.get(key));
//   }
//   const end = process.hrtime.bigint();
//   console.log(values.length, end - start);
// }

const ratio = 64624418 / 54077557;
const slowdown = (ratio - 1) * 100;
console.log({ ratio, slowdown });