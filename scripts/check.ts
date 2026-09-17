import { checksOf, conditionsOf, generateNumbers, reverseFromEight } from "../src/lib/logic.ts";

const r = reverseFromEight("68083489");
console.log("reverse", r?.outerName, r?.innerName, r?.movingOuter, r?.movingInner);

const f3 = { code: 81, hao: 1 };
const f7 = { code: 81, hao: 1 };
console.log("checks", checksOf(85, 85, f7));
const cond = conditionsOf(85, f3, 85, f7);
console.log("cond", cond);
const g = generateNumbers(cond, 5);
console.log("count", g.total, "samples", g.samples);
if (!g.samples.every((n) => n.startsWith("9") && n.length === 8)) throw new Error("bad samples");
if (r?.outerCode !== 68 || r.innerCode !== 71) throw new Error("reverse mismatch");
console.log("ok");
