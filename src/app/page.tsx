"use client";

import { OUTER_CODES } from "@/data/tables";
import {
  BY_CODE,
  checksOf,
  conditionsOf,
  danShuang,
  generateNumbers,
  haoLine,
  labelOf,
  neiQianCodes,
  outerHouOf,
  reverseFromEight,
  validInnerHou,
  weiOf,
} from "@/lib/logic";
import { useMemo, useState } from "react";

function luckClass(luck: string): string {
  if (luck === "大吉") return "bg-cinnabar text-white";
  if (luck === "吉") return "bg-moss text-white";
  if (luck === "平") return "bg-stone-500 text-white";
  if (luck === "凶") return "bg-stone-800 text-white";
  return "bg-black text-white";
}

function Yao({ bits }: { bits: number[] }) {
  return (
    <div className="flex flex-col gap-1.5 py-1">
      {bits.map((b, i) => (
        <div key={i} className="flex h-2.5 items-center justify-center gap-1">
          {b === 1 ? (
            <div className="h-2 w-16 rounded-sm bg-ink" />
          ) : (
            <>
              <div className="h-2 w-7 rounded-sm bg-ink" />
              <div className="h-2 w-7 rounded-sm bg-ink" />
            </>
          )}
        </div>
      ))}
    </div>
  );
}

function GuaCard({
  title,
  code,
  hao,
}: {
  title: string;
  code: number;
  hao?: number;
}) {
  const h = BY_CODE[code];
  if (!h) return null;
  return (
    <div className="rounded-xl border border-line bg-panel p-4">
      <p className="text-xs tracking-widest text-stone-500">{title}</p>
      <div className="mt-2 flex items-start justify-between gap-3">
        <div>
          <p className="font-serif text-xl">{h.name}</p>
          <p className="mt-1 text-sm text-stone-600">
            {h.code} {h.wuxing}
          </p>
          <span className={`mt-2 inline-block rounded px-2 py-0.5 text-xs ${luckClass(h.luck)}`}>
            {h.luck}
          </span>
          {hao !== undefined && (
            <p className="mt-2 text-xs text-stone-500">
              動第 {haoLine(hao)} 爻（號 {hao}）
            </p>
          )}
        </div>
        <Yao bits={h.bits} />
      </div>
      <p className="mt-3 text-sm leading-6 text-stone-600">{h.text}</p>
    </div>
  );
}

export default function HomePage() {
  const [tab, setTab] = useState<"pick" | "reverse">("pick");
  const [outer, setOuter] = useState(85);
  const [f3Code, setF3Code] = useState(81);
  const [inner, setInner] = useState(85);
  const [f7Code, setF7Code] = useState(81);
  const [eight, setEight] = useState("68083489");
  const [generated, setGenerated] = useState<{ total: number; samples: string[] } | null>(null);

  const houList = outerHouOf(outer);
  const qianList = neiQianCodes(outer);
  const f3 = houList.find((c) => c.code === f3Code) ?? houList[0];
  const houInner = validInnerHou(outer, inner);
  const f7 = houInner.find((c) => c.code === f7Code) ?? houInner[0];

  const checks = checksOf(outer, inner, f7);
  const cond = f3 && f7 ? conditionsOf(outer, f3, inner, f7) : null;
  const allOk =
    f3 &&
    f7 &&
    checks.houSi === "可" &&
    checks.digits356 === "可" &&
    checks.innerChange === "可";

  const reverse = useMemo(() => reverseFromEight(eight), [eight]);

  function onOuter(code: number) {
    setOuter(code);
    const nextHou = outerHouOf(code)[0];
    setF3Code(nextHou.code);
    const nextInner = neiQianCodes(code).find((c) => validInnerHou(code, c).length > 0) ?? neiQianCodes(code)[0];
    setInner(nextInner);
    const nextF7 = validInnerHou(code, nextInner)[0];
    if (nextF7) setF7Code(nextF7.code);
    setGenerated(null);
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-8 md:px-8">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.3em] text-cinnabar">HCDM v2.4</p>
          <h1 className="mt-1 font-serif text-3xl md:text-4xl">起卦</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-stone-600">
            依原表選外卦、外變、內卦、內變，推出七條數字條件，並可列出符合的 8 位數字；也可輸入 8 位數反算卦象。
          </p>
        </div>
        <div className="flex rounded-full border border-line bg-panel p-1 text-sm">
          <button
            className={`rounded-full px-4 py-1.5 ${tab === "pick" ? "bg-ink text-paper" : ""}`}
            onClick={() => setTab("pick")}
          >
            選卦求數
          </button>
          <button
            className={`rounded-full px-4 py-1.5 ${tab === "reverse" ? "bg-ink text-paper" : ""}`}
            onClick={() => setTab("reverse")}
          >
            數字起卦
          </button>
        </div>
      </header>

      {tab === "pick" ? (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <section className="space-y-4">
            <Field label="外卦（前5）">
              <select
                className="w-full rounded-lg border border-line bg-panel px-3 py-2"
                value={outer}
                onChange={(e) => onOuter(Number(e.target.value))}
              >
                {OUTER_CODES.map((code) => (
                  <option key={code} value={code}>
                    {labelOf(code)} · {BY_CODE[code].luck}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="外卦（後5）／外變">
              <select
                className="w-full rounded-lg border border-line bg-panel px-3 py-2"
                value={f3.code}
                onChange={(e) => {
                  setF3Code(Number(e.target.value));
                  setGenerated(null);
                }}
              >
                {houList.map((c) => (
                  <option key={c.code} value={c.code}>
                    {labelOf(c.code)} · 號 {c.hao}（第 {haoLine(c.hao)} 爻）
                  </option>
                ))}
              </select>
            </Field>
            <Field label="內卦">
              <select
                className="w-full rounded-lg border border-line bg-panel px-3 py-2"
                value={inner}
                onChange={(e) => {
                  const code = Number(e.target.value);
                  setInner(code);
                  const next = validInnerHou(outer, code)[0];
                  if (next) setF7Code(next.code);
                  setGenerated(null);
                }}
              >
                {qianList.map((code) => (
                  <option key={code} value={code}>
                    {labelOf(code)}
                    {validInnerHou(outer, code).length === 0 ? "（無內後表）" : ""}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="內卦（變）">
              {houInner.length === 0 ? (
                <p className="rounded-lg border border-cinnabar/30 bg-red-50 px-3 py-2 text-sm text-cinnabar">
                  此內卦在原表沒有內後清單（兌為澤、坤為地），請改選其他內卦。
                </p>
              ) : (
                <select
                  className="w-full rounded-lg border border-line bg-panel px-3 py-2"
                  value={f7?.code ?? ""}
                  onChange={(e) => {
                    setF7Code(Number(e.target.value));
                    setGenerated(null);
                  }}
                >
                  {houInner.map((c) => (
                    <option key={c.code} value={c.code}>
                      {labelOf(c.code)} · 號 {c.hao}（第 {haoLine(c.hao)} 爻）
                    </option>
                  ))}
                </select>
              )}
            </Field>
            <p className="text-xs text-stone-500">
              外卦下卦為 {weiOf(outer) === 0 ? 8 : weiOf(outer)}（{danShuang(weiOf(outer))}
              ）。內變只列出號的單雙與下卦相同的候選。
            </p>
          </section>

          <section className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <GuaCard title="外卦" code={outer} />
              {f3 && <GuaCard title="外變" code={f3.code} hao={f3.hao} />}
              <GuaCard title="內卦" code={inner} />
              {f7 && <GuaCard title="內變" code={f7.code} hao={f7.hao} />}
            </div>

            <div className="rounded-xl border border-line bg-panel p-4">
              <h2 className="font-serif text-lg">一致性</h2>
              <ul className="mt-3 space-y-2 text-sm">
                <CheckRow name="後四？" value={checks.houSi} note="後四÷8 與後四÷6 單雙須相同" />
                <CheckRow name="356？" value={checks.digits356} note="五六餘＋七八餘須等於後四餘或＋8" />
                <CheckRow name="內變？" value={checks.innerChange} note="內變號單雙須等於外卦下卦單雙" />
              </ul>
            </div>

            {cond && (
              <div className="rounded-xl border border-line bg-panel p-4">
                <h2 className="font-serif text-lg">七個條件</h2>
                <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm leading-7">
                  <li>頭 4 個數字以 9 開頭</li>
                  <li>頭 4 個數字總和除以 8，餘額為 {cond.r2}</li>
                  <li>後 4 個數字總和除以 8，餘額為 {cond.r3}</li>
                  <li>8 個數字總和除以 6，餘額為 {cond.r4}</li>
                  <li>第 5、6 個數字總和除以 8，餘額為 {cond.r5}</li>
                  <li>第 7、8 個數字總和除以 8，餘額為 {cond.r6}</li>
                  <li>後 4 個數字總和除以 6，餘額為 {cond.r7}</li>
                </ol>
                <button
                  disabled={!allOk}
                  onClick={() => setGenerated(generateNumbers(cond))}
                  className="mt-4 rounded-full bg-cinnabar px-5 py-2 text-sm text-white disabled:cursor-not-allowed disabled:bg-stone-300"
                >
                  列出符合的 8 位數
                </button>
                {!allOk && (
                  <p className="mt-2 text-xs text-cinnabar">四卦尚未全部「可」，請先改內卦或內變。</p>
                )}
              </div>
            )}

            {generated && (
              <div className="rounded-xl border border-line bg-panel p-4">
                <h2 className="font-serif text-lg">符合組合 {generated.total} 個</h2>
                <p className="mt-1 text-xs text-stone-500">
                  下列最多顯示 400 個。這是原 Excel「全數列出」沒接上的那一步。
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2 font-mono text-sm sm:grid-cols-4">
                  {generated.samples.map((n) => (
                    <button
                      key={n}
                      className="rounded border border-line px-2 py-1 hover:bg-paper"
                      onClick={() => {
                        setEight(n);
                        setTab("reverse");
                      }}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      ) : (
        <section className="mx-auto max-w-2xl space-y-5">
          <Field label="8 位數字">
            <input
              value={eight}
              maxLength={8}
              onChange={(e) => setEight(e.target.value.replace(/\D/g, "").slice(0, 8))}
              className="w-full rounded-lg border border-line bg-panel px-3 py-3 font-mono text-2xl tracking-[0.4em]"
              placeholder="68083489"
            />
          </Field>
          {reverse ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <GuaCard title="外卦" code={reverse.outerCode} />
              <GuaCard
                title="外變"
                code={reverse.changedOuterCode}
                hao={reverse.movingOuter}
              />
              <GuaCard title="內卦" code={reverse.innerCode} />
              <GuaCard
                title="內變"
                code={reverse.changedInnerCode}
                hao={reverse.movingInner}
              />
              <div className="sm:col-span-2 rounded-xl border border-line bg-panel p-4 text-sm leading-7 text-stone-600">
                前四餘 {reverse.outerCode.toString()[0]}、後四餘 {reverse.outerCode.toString()[1]}
                ；八位總和動爻號 {reverse.movingOuter}；五六／七八組成內卦 {reverse.innerCode}，後四÷6
                動爻號 {reverse.movingInner}。
              </div>
            </div>
          ) : (
            <p className="text-sm text-stone-500">請輸入完整 8 位數字。</p>
          )}
        </section>
      )}
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs tracking-widest text-stone-500">{label}</span>
      {children}
    </label>
  );
}

function CheckRow({ name, value, note }: { name: string; value: "可" | "不可"; note: string }) {
  return (
    <li className="flex items-start justify-between gap-3">
      <span>
        <span className="font-medium">{name}</span>
        <span className="ml-2 text-stone-500">{note}</span>
      </span>
      <span className={value === "可" ? "text-moss" : "text-cinnabar"}>{value}</span>
    </li>
  );
}
