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

    const container = document.getElementById("game");

    const powerDiv = createDiv("Power: ", "power");

    const ppDiv = createDiv("Prestige: ", "pp");

    const prestigeBtn = document.createElement("button");

    prestigeBtn.textContent = "Prestige";

    prestigeBtn.onclick = () => doPrestige();

    container.appendChild(powerDiv);
    container.appendChild(ppDiv);
    container.appendChild(prestigeBtn);

    const genContainer = document.createElement("div");

    genContainer.id = "generators";

    container.appendChild(genContainer);

    buildGeneratorsUI();

}

/* ============================
   Generator UI生成
============================ */

function buildGeneratorsUI() {

    const container = document.getElementById("generators");

    container.innerHTML = "";

    for (let i = 0; i < 13; i++) {

        const gen = game.generators[i];

        const div = document.createElement("div");

        div.className = "generator";

        div.innerHTML = `
            <h3>Generator ${i + 1}</h3>
            <p>Amount: <span id="g_amt_${i}">0</span></p>
            <p>Cost: <span id="g_cost_${i}">0</span></p>
            <button onclick="buyGenerator(${i + 1})">Buy</button>
        `;

        container.appendChild(div);

    }

}

/* ============================
   UI更新（毎フレーム）
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

        const amt = document.getElementById(`g_amt_${i}`);
        const cost = document.getElementById(`g_cost_${i}`);

        if (amt) amt.textContent = shortFormat(gen.amount);
        if (cost) cost.textContent = shortFormat(gen.cost);

    }

}

/* ============================
   DOMヘルパー
============================ */

function createDiv(label, id) {

    const div = document.createElement("div");

    div.innerHTML = `${label}<span id="${id}">0</span>`;

    return div;

}
