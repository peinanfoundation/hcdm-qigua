import hexagramsJson from "@/data/hexagrams.json";
import {
  NEI_HOU,
  NEI_QIAN_BY_WEI,
  OUTER_HOU,
  type Change,
  type Hexagram,
} from "@/data/tables";

export const HEXAGRAMS = hexagramsJson as Hexagram[];
export const BY_CODE: Record<number, Hexagram> = Object.fromEntries(
  HEXAGRAMS.map((h) => [h.code, h]),
);

export function labelOf(code: number): string {
  const h = BY_CODE[code];
  return h ? `${h.name} ${h.wuxing}` : String(code);
}

export function upperOf(code: number): number {
  return Math.floor(code / 10);
}

export function lowerOf(code: number): number {
  return code % 10;
}

/** 坤下卦在表內寫成 0，其餘用下卦 1–8 */
export function weiOf(code: number): number {
  const lower = lowerOf(code);
  return lower === 8 ? 0 : lower;
}

export function rem8(sum: number): number {
  const r = sum % 8;
  return r === 0 ? 8 : r;
}

export function rem6(sum: number): number {
  return sum % 6;
}

export function isOdd(n: number): boolean {
  return n % 2 === 1;
}

export function danShuang(n: number): "單" | "雙" {
  return isOdd(n) ? "單" : "雙";
}

export function haoLine(hao: number): number {
  return hao === 0 ? 6 : hao;
}

export type Conditions = {
  r2: number;
  r3: number;
  r4: number;
  r5: number;
  r6: number;
  r7: number;
};

export function conditionsOf(
  outer: number,
  outerHou: Change,
  inner: number,
  innerHou: Change,
): Conditions {
  return {
    r2: upperOf(outer),
    r3: lowerOf(outer),
    r4: outerHou.hao,
    r5: upperOf(inner),
    r6: lowerOf(inner),
    r7: innerHou.hao,
  };
}

export type Checks = {
  houSi: "可" | "不可";
  digits356: "可" | "不可";
  innerChange: "可" | "不可";
};

export function checksOf(
  outer: number,
  inner: number,
  innerHou: Change | undefined,
): Checks {
  const r3 = lowerOf(outer);
  const r5 = upperOf(inner);
  const r6 = lowerOf(inner);
  const pairParity = danShuang(r5 + r6);
  const houSi: Checks["houSi"] = danShuang(r3) === pairParity ? "可" : "不可";
  const digits356: Checks["digits356"] =
    r5 + r6 === r3 || r5 + r6 === r3 + 8 ? "可" : "不可";
  const innerChange: Checks["innerChange"] = !innerHou
    ? "不可"
    : danShuang(innerHou.hao) === danShuang(weiOf(outer))
      ? "可"
      : "不可";
  return { houSi, digits356, innerChange };
}

export function neiQianCodes(outer: number): number[] {
  return NEI_QIAN_BY_WEI[weiOf(outer)] ?? [];
}

export function validInnerHou(outer: number, inner: number): Change[] {
  const list = NEI_HOU[inner] ?? [];
  const wantOdd = isOdd(weiOf(outer));
  return list.filter((c) => isOdd(c.hao) === wantOdd);
}

export type ReverseResult = {
  digits: number[];
  outerCode: number;
  outerName: string;
  movingOuter: number;
  changedOuterCode: number;
  changedOuterName: string;
  innerCode: number;
  innerName: string;
  movingInner: number;
  changedInnerCode: number;
  changedInnerName: string;
};

export function reverseFromEight(raw: string): ReverseResult | null {
  const s = raw.replace(/\D/g, "");
  if (s.length !== 8) return null;
  const d = s.split("").map(Number);
  const front = d[0] + d[1] + d[2] + d[3];
  const back = d[4] + d[5] + d[6] + d[7];
  const outerCode = rem8(front) * 10 + rem8(back);
  const movingOuter = rem6(front + back);
  const innerCode = rem8(d[4] + d[5]) * 10 + rem8(d[6] + d[7]);
  const movingInner = rem6(back);
  const outer = BY_CODE[outerCode];
  const inner = BY_CODE[innerCode];
  if (!outer || !inner) return null;
  const changedOuter = changeByHao(outerCode, movingOuter);
  const changedInner = changeByHao(innerCode, movingInner);
  return {
    digits: d,
    outerCode,
    outerName: labelOf(outerCode),
    movingOuter,
    changedOuterCode: changedOuter,
    changedOuterName: labelOf(changedOuter),
    innerCode,
    innerName: labelOf(innerCode),
    movingInner,
    changedInnerCode: changedInner,
    changedInnerName: labelOf(changedInner),
  };
}

export function changeByHao(code: number, hao: number): number {
  const h = BY_CODE[code];
  const bits = [...h.bits];
  const line = haoLine(hao);
  const idx = 6 - line;
  bits[idx] = bits[idx] === 1 ? 0 : 1;
  const found = HEXAGRAMS.find(
    (g) =>
      g.bits[0] === bits[0] &&
      g.bits[1] === bits[1] &&
      g.bits[2] === bits[2] &&
      g.bits[3] === bits[3] &&
      g.bits[4] === bits[4] &&
      g.bits[5] === bits[5],
  );
  return found?.code ?? code;
}

export function generateNumbers(c: Conditions, limit = 400): { total: number; samples: string[] } {
  const fronts: number[][] = [];
  for (let a = 0; a <= 9; a++) {
    for (let b = 0; b <= 9; b++) {
      for (let c3 = 0; c3 <= 9; c3++) {
        if (rem8(9 + a + b + c3) === c.r2) fronts.push([9, a, b, c3]);
      }
    }
  }
  const p56: number[][] = [];
  const p78: number[][] = [];
  for (let x = 0; x <= 9; x++) {
    for (let y = 0; y <= 9; y++) {
      if (rem8(x + y) === c.r5) p56.push([x, y]);
      if (rem8(x + y) === c.r6) p78.push([x, y]);
    }
  }
  const backs: number[][] = [];
  for (const [e, f] of p56) {
    for (const [g, h] of p78) {
      const sum = e + f + g + h;
      if (rem8(sum) === c.r3 && rem6(sum) === c.r7) backs.push([e, f, g, h]);
    }
  }
  const samples: string[] = [];
  let total = 0;
  for (const f of fronts) {
    const fs = f[0] + f[1] + f[2] + f[3];
    for (const b of backs) {
      const bs = b[0] + b[1] + b[2] + b[3];
      if (rem6(fs + bs) !== c.r4) continue;
      total += 1;
      if (samples.length < limit) samples.push(f.join("") + b.join(""));
    }
  }
  return { total, samples };
}

export function outerHouOf(code: number): Change[] {
  return OUTER_HOU[code] ?? [];
}
