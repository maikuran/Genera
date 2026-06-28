"use strict";

/* global game, D, mul, pow, gte */

/* ============================
   Prestige System (Normality)
============================ */

const PRESTIGE_REQUIREMENT = D("1e150");

/* ============================
   Prestigeデータ
============================ */

function initPrestige() {

    game.prestige = {

        points: D(0),

        totalPoints: D(0),

        multiplier: D(1),

        unlocked: false

    };

}

/* ============================
   解放チェック
============================ */

function checkPrestigeUnlock() {

    if (game.prestige.unlocked) return;

    if (game.power.gte(PRESTIGE_REQUIREMENT)) {

        game.prestige.unlocked = true;

        console.log("Prestige unlocked");

    }

}

/* ============================
   Prestige実行
============================ */

function doPrestige() {

    if (game.power.lt(PRESTIGE_REQUIREMENT)) return;

    const gain = calcPrestigeGain(game.power);

    game.prestige.points = game.prestige.points.plus(gain);

    game.prestige.totalPoints =
        game.prestige.totalPoints.plus(gain);

    applyPrestigeBonus();

    hardReset();

}

/* ============================
   Prestige獲得量
   (簡易: logベース)
============================ */

function calcPrestigeGain(power) {

    const log = power.log10();

    if (log.lt(150)) return D(0);

    return log.sub(149).pow(2);

}

/* ============================
   Prestigeボーナス適用
============================ */

function applyPrestigeBonus() {

    // 全ジェネ倍率に適用
    const mult = game.prestige.points.plus(1);

    game.prestige.multiplier = mult;

}

/* ============================
   リセット処理
============================ */

function hardReset() {

    game.power = D(0);

    for (const gen of game.generators) {

        gen.amount = D(0);
        gen.bought = 0;
        gen.cost = gen.baseCost;

    }

}

/* ============================
   全体生産補正
   → Generator.js側で使用
============================ */

function getPrestigeMultiplier() {

    return game.prestige.multiplier;

}
