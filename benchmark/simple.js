"use strict";

const { misc } = require("naughty-util");
const { Pmap } = require("../lib/Pmap.js");

const keys = [
  1, 6, 33, 80,
  90, 99, 15, 17,
  42, 43, 555, 1024,
  22222, 55555, 99000, 134456,
  19991, 55512, 11111, 12
];
const lookup = Array.from({ length: 1e6 }, () => misc.random(keys.length - 1, -1));

// nano ~57001349n
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

// nano ~ 60274290n
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

const ratio = 60274290 / 57001349;
const slowdown = (ratio - 1) * 100;
console.log({ ratio, slowdown });