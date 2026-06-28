"use strict";

/*global game,D*/

const PRESTIGE_REQ=D("1e150");

function initPrestige(){

game.prestige={

points:D(0),

total:D(0),

mult:D(1),

unlocked:false

};

}

function checkPrestigeUnlock(){

if(game.prestige.unlocked)return;

if(game.power.gte(PRESTIGE_REQ))
game.prestige.unlocked=true;

}

function prestigeGain(){

if(game.power.lt(PRESTIGE_REQ))
return D(0);

return Decimal.pow(
10,
game.power.log10().sub(150).div(25)
).floor().max(1);

}

function canPrestige(){

return game.power.gte(PRESTIGE_REQ);

}

function doPrestige(){

if(!canPrestige())return;

const gain=prestigeGain();

game.prestige.points=
game.prestige.points.plus(gain);

game.prestige.total=
game.prestige.total.plus(gain);

game.prestige.mult=
game.prestige.points.plus(1).sqrt();

resetNormality();

}

function prestigeMultiplier(){

return game.prestige.mult;

}

function resetNormality(){

game.power=D(0);

for(const g of game.generators){

g.amount=D(0);

g.bought=0;

g.cost=g.baseCost;

}

game.infinityUnlocked=false;

}

function prestigeEffect(){

return "×"+shortFormat(
game.prestige.mult
);

}

function prestigeText(){

if(!canPrestige())
return "Need "+shortFormat(PRESTIGE_REQ)+" Power";

return "Gain "+
shortFormat(prestigeGain())+
" Prestige Points";

}
