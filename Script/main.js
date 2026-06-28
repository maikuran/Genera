"use strict";

/*global game,D,initGenerators,updateGenerators,initPrestige,checkPrestigeUnlock,updateUI*/

const DB_NAME="NormalityDB";
const STORE_NAME="Save";

game={
power:D(0),
generators:[],
prestige:null,
infinityUnlocked:false,
lastUpdate:Date.now()
};

window.addEventListener("DOMContentLoaded",async()=>{

initGenerators();

initPrestige();

await loadGame();

updateCosts();

buildUI();

game.lastUpdate=Date.now();

setInterval(loop,50);

setInterval(saveGame,10000);

});

function loop(){

const now=Date.now();

const diff=(now-game.lastUpdate)/1000;

game.lastUpdate=now;

updateGenerators(diff);

checkPrestigeUnlock();

updateUI();

}

function openDB(){

return new Promise((resolve,reject)=>{

const req=indexedDB.open(DB_NAME,1);

req.onupgradeneeded=e=>{

e.target.result.createObjectStore(STORE_NAME);

};

req.onsuccess=()=>resolve(req.result);

req.onerror=()=>reject(req.error);

});

}

async function saveGame(){

const db=await openDB();

const tx=db.transaction(STORE_NAME,"readwrite");

tx.objectStore(STORE_NAME).put({

power:game.power.toString(),

infinityUnlocked:game.infinityUnlocked,

prestige:{
points:game.prestige.points.toString(),
total:game.prestige.total.toString(),
mult:game.prestige.mult.toString(),
unlocked:game.prestige.unlocked
},

generators:game.generators.map(g=>({

amount:g.amount.toString(),

bought:g.bought

}))

},"Save");

}

async function loadGame(){

const db=await openDB();

return new Promise(resolve=>{

const tx=db.transaction(STORE_NAME,"readonly");

const req=tx.objectStore(STORE_NAME).get("Save");

req.onsuccess=()=>{

const s=req.result;

if(!s){

resolve();

return;

}

game.power=D(s.power);

game.infinityUnlocked=s.infinityUnlocked;

game.prestige.points=D(s.prestige.points);

game.prestige.total=D(s.prestige.total);

game.prestige.mult=D(s.prestige.mult);

game.prestige.unlocked=s.prestige.unlocked;

for(let i=0;i<13;i++){

if(!s.generators[i])continue;

game.generators[i].amount=D(s.generators[i].amount);

game.generators[i].bought=s.generators[i].bought;

}

resolve();

};

req.onerror=()=>resolve();

});

}
