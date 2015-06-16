// File: melodia.js
// Author: Thomas ABASSI
// License: CC0 1.0 Universal

//  Model
var tempo = 1;
var nbSamples = 12;
var C0 = 16.35;
var nbOctaves = 8;

var level = 0;
var mulPrime = 2;
var sumPrime = 2;
var listPrime = [2, 3];
var listFrequencies = [];
var _timbre;

function getTime() {
    var d = new Date();
    return d.getTime() / 1000;
}

function isPrime(n) {
    if(n % 2 == 0)
        return false;
    for(var i = 3; i <= Math.sqrt(n); i += 2)
        if(n % i == 0)
            return false;
    return true;
}

function getNextPrime(number) {
    while(!isPrime(number)) {
        number += 2;
    }
    return number;
}

function getPrime(ind) {
    if(listPrime.length <= ind) {
        for(var i = listPrime.length; i <= ind; i++) {
            var lastPrime = listPrime[i - 1];
            listPrime[i] = getNextPrime(lastPrime + 2);
        }
    }
    return listPrime[ind];
}

function getLevelAndStep(frequency) {
    frequency.step = frequency.time - (sumPrime - mulPrime);
    while(true) {
        if(sumPrime > frequency.time) {
            break;
        }
        frequency.step = frequency.time - sumPrime;
        mulPrime *= getPrime(++frequency.level);
        sumPrime += mulPrime;
    }
    return frequency;
}

function getValue(frequency) {
    for(i = 0; i <= frequency.level; i++) {
        frequency.value += Math.sin(Math.PI * (frequency.step % getPrime(i)) / getPrime(i)) / getPrime(i);
    }
    return frequency;
}

function getFrequency(time) {
    var frequency = {};
    frequency.time = time;
    frequency.level = level;
    frequency.step = 0;
    frequency.value = 0;
    frequency = getLevelAndStep(frequency);
    frequency = getValue(frequency);
    frequency.frequency = Math.pow(2, frequency.value * nbOctaves) * C0;
    level = frequency.level;
    console.log("time: " + frequency.time + ", level: " + frequency.level +  ", step: " +
                frequency.step + ", value: " + frequency.value + ", frequency: " + frequency.frequency);
    return frequency;
}

// Controller
var init = 0;
function fillListFrequencies() {
    for(var i = 0; i < tempo * nbSamples * 2; i++) {
        if(listFrequencies.length == tempo * nbSamples * 4)
            break;
        var nextTime = (getTime() - init + 1) * tempo;
        if(listFrequencies.length > 0) {
            nextTime = listFrequencies[listFrequencies.length - 1].time + 1 / nbSamples;
        }
        listFrequencies.push(getFrequency(nextTime));
    }
}

function getCachedFrequency(time) {
    while(listFrequencies.length > 0) {
        var frequency = listFrequencies.shift();
        if(frequency.time > time) {
            return frequency;
        }
    }
    return null;
}

function tick() {
    if(listFrequencies.length > 0) {
        var frequency = getCachedFrequency((getTime() - init) * tempo);
        if(frequency) {
            if(_timbre) {
                _timbre.removeAll();
                _timbre.pause();
                _timbre = T("sin", {freq:frequency.frequency}).play();
            } else
                _timbre = T("sin", {freq:frequency.frequency}).play();
        }
    }
}

fillListFrequencies();
setInterval(fillListFrequencies, 1000);
setInterval(tick, 1000 / (tempo * nbSamples));
