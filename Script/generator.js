"use strict";

/*global game,D*/

const INFINITY_REQUIREMENT=D("1.79e308");

const BASE_COST=[
D(10),
D(100),
D(1e3),
D(1e4),
D(1e6),
D(1e8),
D(1e11),
D(1e15),
D(1e20),
D(1e30),
D(1e45),
D(1e70),
D("1e120")
];

const COST_MULT=[
1.15,
1.15,
1.15,
1.16,
1.17,
1.18,
1.20,
1.25,
1.30,
1.35,
1.45,
1.60,
2.00
];

function initGenerators(){

game.generators=[];

for(let i=0;i<13;i++){

game.generators.push({

id:i+1,

amount:D(0),

bought:0,

baseCost:BASE_COST[i],

cost:BASE_COST[i],

production:D(1)

});

}

}

function updateGenerators(diff){

for(let i=12;i>=0;i--){

const g=game.generators[i];

if(i==12){

g.amount=g.amount.plus(
g.amount.times(g.production).times(diff)
);

}else{

const up=game.generators[i+1];

g.amount=g.amount.plus(
up.amount.times(up.production).times(diff)
);

}

}

game.power=game.power.plus(
game.generators[0].amount
.times(game.generators[0].production)
.times(diff)
);

checkInfinity();

}

function buyGenerator(id){

const g=game.generators[id-1];

if(!g)return;

if(game.power.lt(g.cost))return;

game.power=game.power.minus(g.cost);

g.amount=g.amount.plus(1);

g.bought++;

g.cost=g.baseCost.times(
Decimal.pow(COST_MULT[id-1],g.bought)
);

}

function updateCosts(){

for(let i=0;i<13;i++){

const g=game.generators[i];

g.cost=g.baseCost.times(
Decimal.pow(COST_MULT[i],g.bought)
);

}

}

function getPowerPerSecond(){

return game.generators[0].amount
.times(game.generators[0].production);

}

function checkInfinity(){

if(game.infinityUnlocked)return;

if(game.power.gte(INFINITY_REQUIREMENT)){

game.infinityUnlocked=true;

onInfinityReached();

}

}

function onInfinityReached(){

console.log("INFINITY");

}
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
