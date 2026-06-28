"use strict";

/* global game, initGenerators, updateGenerators, initPrestige, checkPrestigeUnlock, format */

/* ============================
   メイン初期化
============================ */

window.onload = async function () {

    initGenerators();
    initPrestige();

    await loadGame();

    game.lastUpdate = Date.now();

    setInterval(loop, 50);
    setInterval(saveGame, 10000);

};

/* ============================
   メインループ
============================ */

function loop() {

    const now = Date.now();
    const diff = (now - game.lastUpdate) / 1000;

    game.lastUpdate = now;

    updateGenerators(diff);

    checkPrestigeUnlock();

    updateUI();

}

/* ============================
   UI更新
============================ */

function updateUI() {

    const powerEl = document.getElementById("power");
    const ppEl = document.getElementById("pp");

    if (powerEl) {
        powerEl.textContent = shortFormat(game.power);
    }

    if (ppEl && game.prestige) {
        ppEl.textContent = shortFormat(game.prestige.points);
    }

}

/* ============================
   数値省略表示
   a..z → aa..zz → aaa...
============================ */

const alphabet = "abcdefghijklmnopqrstuvwxyz";

function shortFormat(num) {

    let n = new Decimal(num);

    if (n.lt(1000)) return n.floor().toString();

    const e = n.log10().floor();

    const m = n.div(Decimal.pow(10, e)).toFixed(2);

    return `${m}e${e}`;

}

/* ============================
   IndexedDB セーブ
============================ */

const DB_NAME = "NormalityDB";
const STORE_NAME = "save";

function openDB() {

    return new Promise((resolve, reject) => {

        const req = indexedDB.open(DB_NAME, 1);

        req.onupgradeneeded = function (e) {

            const db = e.target.result;

            db.createObjectStore(STORE_NAME);

        };

        req.onsuccess = () => resolve(req.result);

        req.onerror = () => reject(req.error);

    });

}

/* ============================
   セーブ
============================ */

async function saveGame() {

    const db = await openDB();

    const tx = db.transaction(STORE_NAME, "readwrite");

    const store = tx.objectStore(STORE_NAME);

    const data = {

        power: game.power.toString(),

        prestige: game.prestige,

        generators: game.generators.map(g => ({
            amount: g.amount.toString(),
            bought: g.bought,
            cost: g.cost.toString()
        }))

    };

    store.put(data, "save");

}

/* ============================
   ロード
============================ */

async function loadGame() {

    const db = await openDB();

    return new Promise((resolve) => {

        const tx = db.transaction(STORE_NAME, "readonly");

        const store = tx.objectStore(STORE_NAME);

        const req = store.get("save");

        req.onsuccess = function () {

            const data = req.result;

            if (!data) return resolve();

            game.power = new Decimal(data.power);

            if (data.prestige) {

                game.prestige = data.prestige;

                game.prestige.points =
                    new Decimal(data.prestige.points);

                game.prestige.totalPoints =
                    new Decimal(data.prestige.totalPoints);

                game.prestige.multiplier =
                    new Decimal(data.prestige.multiplier);

            }

            if (data.generators) {

                for (let i = 0; i < data.generators.length; i++) {

                    game.generators[i].amount =
                        new Decimal(data.generators[i].amount);

                    game.generators[i].bought =
                        data.generators[i].bought;

                    game.generators[i].cost =
                        new Decimal(data.generators[i].cost);

                }

            }

            resolve();

        };

        req.onerror = () => resolve();

    });

}

/* ============================
   ヘルパー：文字列省略（将来拡張用）
============================ */

function letterIndex(n) {

    let result = "";

    while (n >= 0) {

        result = alphabet[n % 26] + result;

        n = Math.floor(n / 26) - 1;

    }

    return result;

}
