"use strict";

/* global game, buyGenerator, doPrestige, shortFormat */

/* ============================
   UI初期化
============================ */

window.addEventListener("DOMContentLoaded", function () {

    buildUI();

});

/* ============================
   UI構築
============================ */

function buildUI() {

    const game = document.getElementById("game");

    game.innerHTML = "";

    const Root = document.createElement("div");
    Root.id = "Root";

    game.appendChild(Root);

    /* ===== タイトル ===== */

    const title = document.createElement("h1");
    title.textContent = "Normality Zone";

    Root.appendChild(title);

    /* ===== Power ===== */

    Root.appendChild(createDiv("Power: ", "power"));

    /* ===== Prestige ===== */

    Root.appendChild(createDiv("Prestige: ", "pp"));

    /* ===== Prestige Button ===== */

    const prestigeBtn = document.createElement("button");

    prestigeBtn.id = "prestigeButton";

    prestigeBtn.textContent = "Prestige";

    prestigeBtn.onclick = doPrestige;

    Root.appendChild(prestigeBtn);

    /* ===== Generator一覧 ===== */

    const generators = document.createElement("div");

    generators.id = "generators";

    Root.appendChild(generators);

    buildGeneratorsUI();

}

/* ============================
   Generator UI生成
============================ */

function buildGeneratorsUI() {

    const container = document.getElementById("generators");

    container.innerHTML = "";

    for (let i = 0; i < 13; i++) {

        const box = document.createElement("div");

        box.className = "generator";

        box.id = `generator_${i}`;

        const title = document.createElement("h3");
        title.textContent = `Generator ${i + 1}`;

        const amount = createDiv("Amount: ", `g_amt_${i}`);

        const cost = createDiv("Cost: ", `g_cost_${i}`);

        const button = document.createElement("button");

        button.textContent = "Buy";

        button.onclick = function () {

            buyGenerator(i + 1);

        };

        box.appendChild(title);
        box.appendChild(amount);
        box.appendChild(cost);
        box.appendChild(button);

        container.appendChild(box);

    }

}

/* ============================
   UI更新
============================ */

function updateUI() {

    if (!game.generators) return;

    document.getElementById("power").textContent =
        shortFormat(game.power);

    if (game.prestige) {

        document.getElementById("pp").textContent =
            shortFormat(game.prestige.points);

    }

    for (let i = 0; i < 13; i++) {

        const gen = game.generators[i];

        document.getElementById(`g_amt_${i}`).textContent =
            shortFormat(gen.amount);

        document.getElementById(`g_cost_${i}`).textContent =
            shortFormat(gen.cost);

    }

}

/* ============================
   Div生成
============================ */

function createDiv(label, id) {

    const div = document.createElement("div");

    const text = document.createTextNode(label);

    const span = document.createElement("span");

    span.id = id;

    span.textContent = "0";

    div.appendChild(text);

    div.appendChild(span);

    return div;

}
