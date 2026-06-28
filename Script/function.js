
"use strict";

/* ============================
   Decimal安全化
============================ */

function D(x) {
    return new Decimal(x);
}

/* ============================
   加算・減算・乗算ショートカット
============================ */

function add(a, b) {
    return D(a).plus(b);
}

function sub(a, b) {
    return D(a).minus(b);
}

function mul(a, b) {
    return D(a).times(b);
}

function pow(a, b) {
    return Decimal.pow(a, b);
}

/* ============================
   比較系
============================ */

function gte(a, b) {
    return D(a).gte(b);
}

function lte(a, b) {
    return D(a).lte(b);
}

function lt(a, b) {
    return D(a).lt(b);
}

/* ============================
   数値フォーマット
============================ */

function format(x) {
    const v = D(x);

    if (!v.isFinite()) return "∞";

    return v.toString();
}

/* ============================
   コスト計算
============================ */

function cost(base, bought, mult = 1.15) {
    return mul(
        base,
        pow(mult, bought)
    );
}

/* ============================
   安全セーブ用変換
============================ */

function toSave(x) {
    if (x instanceof Decimal) return x.toString();
    return x;
}

/* ============================
   ロード用変換
============================ */

function fromSave(x) {
    return D(x);
}

/* ============================
   clamp
============================ */

function clamp(x, min, max) {
    const v = D(x);
    if (v.lt(min)) return D(min);
    if (v.gt(max)) return D(max);
    return v;
}

/* ============================
   秒変換
============================ */

function perSecond(value, diff) {
    return mul(value, diff);
}
