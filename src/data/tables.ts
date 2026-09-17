export type Hexagram = {
  code: number;
  name: string;
  wuxing: string;
  luck: "大吉" | "吉" | "平" | "凶" | "大凶";
  text: string;
  bits: number[];
};

export type Change = { code: number; hao: number };

export const OUTER_CODES = [
  11, 13, 21, 23, 27, 28, 31, 33, 35, 41, 43, 45, 53, 54, 58, 68, 71, 74, 81, 85,
] as const;

/** 外後 51/52/53：Excel 人工篩過的吉變卦 */
export const OUTER_HOU: Record<number, Change[]> = {
  11: [
    { code: 21, hao: 0 },
    { code: 13, hao: 2 },
  ],
  13: [
    { code: 23, hao: 0 },
    { code: 53, hao: 4 },
    { code: 11, hao: 2 },
  ],
  21: [
    { code: 41, hao: 5 },
    { code: 22, hao: 3 },
  ],
  23: [{ code: 43, hao: 5 }],
  27: [
    { code: 28, hao: 3 },
    { code: 23, hao: 1 },
  ],
  28: [{ code: 68, hao: 4 }],
  31: [
    { code: 41, hao: 0 },
    { code: 71, hao: 4 },
    { code: 33, hao: 2 },
  ],
  33: [
    { code: 43, hao: 0 },
    { code: 31, hao: 2 },
  ],
  35: [{ code: 45, hao: 0 }],
  41: [
    { code: 21, hao: 5 },
    { code: 45, hao: 1 },
  ],
  43: [{ code: 23, hao: 5 }],
  45: [
    { code: 46, hao: 3 },
    { code: 41, hao: 1 },
  ],
  53: [
    { code: 63, hao: 0 },
    { code: 13, hao: 4 },
  ],
  54: [
    { code: 74, hao: 5 },
    { code: 53, hao: 3 },
    { code: 58, hao: 1 },
  ],
  58: [
    { code: 57, hao: 3 },
    { code: 54, hao: 1 },
  ],
  68: [
    { code: 58, hao: 0 },
    { code: 28, hao: 4 },
  ],
  71: [
    { code: 81, hao: 0 },
    { code: 31, hao: 4 },
  ],
  74: [{ code: 54, hao: 5 }],
  81: [
    { code: 82, hao: 3 },
    { code: 85, hao: 1 },
  ],
  85: [{ code: 81, hao: 1 }],
};

/** 內前：由外卦下卦（尾數，坤為 0）決定 */
export const NEI_QIAN_BY_WEI: Record<number, number[]> = {
  1: [27, 45, 54, 63, 81],
  3: [21, 74],
  5: [23, 41, 58, 85],
  4: [13, 22, 31, 57],
  7: [43],
  0: [35, 53, 71, 88],
};

/** 內後 51–55 */
export const NEI_HOU: Record<number, Change[]> = {
  11: [
    { code: 21, hao: 0 },
    { code: 31, hao: 5 },
    { code: 13, hao: 2 },
  ],
  13: [
    { code: 23, hao: 0 },
    { code: 33, hao: 5 },
    { code: 53, hao: 4 },
    { code: 11, hao: 2 },
  ],
  21: [
    { code: 11, hao: 0 },
    { code: 41, hao: 5 },
    { code: 22, hao: 3 },
    { code: 23, hao: 2 },
  ],
  23: [
    { code: 13, hao: 0 },
    { code: 43, hao: 5 },
    { code: 63, hao: 4 },
    { code: 21, hao: 2 },
    { code: 27, hao: 1 },
  ],
  27: [
    { code: 28, hao: 3 },
    { code: 23, hao: 1 },
  ],
  28: [
    { code: 68, hao: 4 },
    { code: 27, hao: 3 },
  ],
  31: [
    { code: 41, hao: 0 },
    { code: 11, hao: 5 },
    { code: 71, hao: 4 },
    { code: 33, hao: 2 },
    { code: 35, hao: 1 },
  ],
  33: [
    { code: 43, hao: 0 },
    { code: 13, hao: 5 },
    { code: 31, hao: 2 },
  ],
  35: [
    { code: 45, hao: 0 },
    { code: 31, hao: 1 },
  ],
  41: [
    { code: 31, hao: 0 },
    { code: 21, hao: 5 },
    { code: 81, hao: 4 },
    { code: 43, hao: 2 },
    { code: 45, hao: 1 },
  ],
  43: [
    { code: 33, hao: 0 },
    { code: 23, hao: 5 },
    { code: 41, hao: 2 },
  ],
  45: [
    { code: 35, hao: 0 },
    { code: 85, hao: 4 },
    { code: 46, hao: 3 },
    { code: 41, hao: 1 },
  ],
  53: [
    { code: 63, hao: 0 },
    { code: 13, hao: 4 },
    { code: 54, hao: 3 },
    { code: 57, hao: 1 },
  ],
  54: [
    { code: 74, hao: 5 },
    { code: 53, hao: 3 },
    { code: 58, hao: 1 },
  ],
  57: [
    { code: 58, hao: 3 },
    { code: 53, hao: 1 },
  ],
  58: [
    { code: 68, hao: 0 },
    { code: 57, hao: 3 },
    { code: 54, hao: 1 },
  ],
  63: [
    { code: 53, hao: 0 },
    { code: 23, hao: 4 },
  ],
  68: [
    { code: 58, hao: 0 },
    { code: 88, hao: 5 },
    { code: 28, hao: 4 },
  ],
  71: [
    { code: 81, hao: 0 },
    { code: 31, hao: 4 },
  ],
  74: [{ code: 54, hao: 5 }],
  81: [
    { code: 71, hao: 0 },
    { code: 41, hao: 4 },
    { code: 82, hao: 3 },
    { code: 85, hao: 1 },
  ],
  85: [
    { code: 45, hao: 4 },
    { code: 81, hao: 1 },
  ],
};

export const BAGUA = [
  { n: 1, name: "乾", xiang: "天", wuxing: "金" },
  { n: 2, name: "兌", xiang: "澤", wuxing: "金" },
  { n: 3, name: "離", xiang: "火", wuxing: "火" },
  { n: 4, name: "震", xiang: "雷", wuxing: "木" },
  { n: 5, name: "巽", xiang: "風", wuxing: "木" },
  { n: 6, name: "坎", xiang: "水", wuxing: "水" },
  { n: 7, name: "艮", xiang: "山", wuxing: "土" },
  { n: 8, name: "坤", xiang: "地", wuxing: "土" },
] as const;
