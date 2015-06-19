# Melodia
Melodia is a evolutionary serie without redundancy applied to sound frequencies.

##  Serie
- `level(time) = min(l), sum(i = 0 .. l + 1) { mul(j = 0 .. i) { prem(j) } } > time`
- `step(level, time) = (time - sum(i = 0 .. level) { mul(j = 0 .. i) { prem(j) } })`
- `mel(level, step) = sum(i = 0 .. level) { sin(π * mod(step, prem(i)) / prem(i)) } / (level + 1)`

## Application
Sound frequency is computed by `frequency = (2 ^ mel(level, step) * nbOctaves) * C0` with C0 = 16.35, nbOctaves = 10. Time reference is the numer of seconds from 1/1/70 with 4 ticks per seconds and 3 samples for each.

## Implementation
It has been implemented in JavaScript and use [timber.js] to generate sound frequencies.
A node.js server has been added for hosting needs.

## Test
This project is configured to autodeploy on the [OpenShift `nodejs`] cartridge.
A running instance is hosted on http://melodia-betthefuture.rhcloud.com.

## Source code
The source code is available on [Github].

[OpenShift `nodejs`]:http://openshift.github.io/documentation/oo_cartridge_guide.html#nodejs
[Github]:https://github.com/thomas-abassi/Melodia
[timber.js]:http://mohayonao.github.io/timbre.js/
