"use strict";

/* ============================
   Generator System (Normality)
   ============================ */

/* global game, D, add, mul, gte */

const INFINITY_REQUIREMENT = D("1.79e308");

/* ============================
   初期化
============================ */

function initGenerators() {

    game.generators = [];

    for (let i = 1; i <= 13; i++) {

        const baseCost = D(10).pow(i - 1);

        game.generators.push({

            id: i,

            amount: D(0),

            bought: 0,

            baseCost: baseCost,
            cost: baseCost,

            production: D(1)

        });

    }

}

/* ============================
   生産（逆チェーン）
   G13 → G12 → ... → G1 → Power
============================ */

function updateGenerators(diff) {

    // 上位から下位へ流す
    for (let i = 13; i >= 1; i--) {

        const gen = game.generators[i - 1];

        if (!gen) continue;

        let gain = D(0);

        // 最上位は自力生成（仮）
        if (i === 13) {

            gain = gen.amount.times(gen.production);

        } else {

            const upper = game.generators[i];

            gain = upper.amount
                .times(upper.production);

        }

        gen.amount = gen.amount.plus(
            gain.times(diff)
        );

    }

    // G1 → Power
    const g1 = game.generators[0];

    const powerGain = g1.amount.times(g1.production);

    game.power = game.power.plus(
        powerGain.times(diff)
    );

    checkInfinity();

}

/* ============================
   購入
============================ */

function buyGenerator(id) {

    const gen = game.generators[id - 1];

    if (!gen) return;

    if (game.power.lt(gen.cost)) return;

    game.power = game.power.minus(gen.cost);

    gen.amount = gen.amount.plus(1);
    gen.bought++;

    updateCosts();

}

/* ============================
   コスト更新
============================ */

function updateCosts() {

    for (const gen of game.generators) {

        gen.cost = gen.baseCost.times(
            D(1.15).pow(gen.bought)
        );

    }

}

/* ============================
   秒間取得量
============================ */

function getPowerPerSecond() {

    const g1 = game.generators[0];

    return g1.amount.times(g1.production);

}

/* ============================
   Infinityチェック
============================ */

function checkInfinity() {

    if (game.infinityUnlocked) return;

    if (game.power.gte(INFINITY_REQUIREMENT)) {

        game.infinityUnlocked = true;

        onInfinityReached();

    }

}

/* ============================
   Infinity（後で実装）
============================ */

function onInfinityReached() {

    console.log("INFINITY TRIGGERED");

    // 後で追加:
    // - Infinity Points
    // - Reset
    // - Prestige変換
    // - UI切替

}
