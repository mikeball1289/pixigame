"use strict";
/*
  I've wrapped Makoto Matsumoto and Takuji Nishimura's code in a namespace
  so it's better encapsulated. Now you can have multiple random number generators
  and they won't stomp all over eachother's state.
  
  If you want to use this as a substitute for Math.random(), use the random()
  method like so:
  
  var m = new MersenneTwister();
  var randomNumber = m.random();
  
  You can also call the other genrand_{foo}() methods on the instance.
  If you want to use a specific seed in order to get a repeatable random
  sequence, pass an integer into the constructor:
  var m = new MersenneTwister(123);
  and that will always produce the same random sequence.
  Sean McCullough (banksean@gmail.com)
*/
// exports.__esModule = true;
/*
   A C-program for MT19937, with initialization improved 2002/1/26.
   Coded by Takuji Nishimura and Makoto Matsumoto.
 
   Before using, initialize the state by using init_genrand(seed)
   or init_by_array(init_key, key_length).
 
   Copyright (C) 1997 - 2002, Makoto Matsumoto and Takuji Nishimura,
   All rights reserved.
 
   Redistribution and use in source and binary forms, with or without
   modification, are permitted provided that the following conditions
   are met:
 
     1. Redistributions of source code must retain the above copyright
        notice, this list of conditions and the following disclaimer.
 
     2. Redistributions in binary form must reproduce the above copyright
        notice, this list of conditions and the following disclaimer in the
        documentation and/or other materials provided with the distribution.
 
     3. The names of its contributors may not be used to endorse or promote
        products derived from this software without specific prior written
        permission.
 
   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
   "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
   LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
   A PARTICULAR PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR
   CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
   EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
   PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
   PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
   LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
   NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
   SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 
 
   Any feedback is very welcome.
   http://www.math.sci.hiroshima-u.ac.jp/~m-mat/MT/emt.html
   email: m-mat @ math.sci.hiroshima-u.ac.jp (remove space)
*/
var MersenneTwister = /** @class */ (function () {
    function MersenneTwister(seed) {
        /* initializes mt[N] with a seed */
        this.init_genrand = function (_s) {
            this.mt[0] = _s >>> 0;
            for (this.mti = 1; this.mti < this.N; this.mti++) {
                var s = this.mt[this.mti - 1] ^ (this.mt[this.mti - 1] >>> 30);
                this.mt[this.mti] = (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) + (s & 0x0000ffff) * 1812433253)
                    + this.mti;
                /* See Knuth TAOCP Vol2. 3rd Ed. P.106 for multiplier. */
                /* In the previous versions, MSBs of the seed affect   */
                /* only MSBs of the array mt[].                        */
                /* 2002/01/09 modified by Makoto Matsumoto             */
                this.mt[this.mti] >>>= 0;
                /* for >32 bit machines */
            }
        };
        /* initialize by an array with array-length */
        /* init_key is the array for initializing keys */
        /* key_length is its length */
        /* slight change for C++, 2004/2/26 */
        this.init_by_array = function (init_key, key_length) {
            var i, j, k;
            this.init_genrand(19650218);
            i = 1;
            j = 0;
            k = (this.N > key_length ? this.N : key_length);
            for (; k; k--) {
                var s = this.mt[i - 1] ^ (this.mt[i - 1] >>> 30);
                this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1664525) << 16) + ((s & 0x0000ffff) * 1664525)))
                    + init_key[j] + j; /* non linear */
                this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
                i++;
                j++;
                if (i >= this.N) {
                    this.mt[0] = this.mt[this.N - 1];
                    i = 1;
                }
                if (j >= key_length)
                    j = 0;
            }
            for (k = this.N - 1; k; k--) {
                var s = this.mt[i - 1] ^ (this.mt[i - 1] >>> 30);
                this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1566083941) << 16) + (s & 0x0000ffff) * 1566083941))
                    - i; /* non linear */
                this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
                i++;
                if (i >= this.N) {
                    this.mt[0] = this.mt[this.N - 1];
                    i = 1;
                }
            }
            this.mt[0] = 0x80000000; /* MSB is 1; assuring non-zero initial array */
        };
        /* generates a random number on [0,0xffffffff]-interval */
        this.genrand_int32 = function () {
            var y;
            var mag01 = new Array(0x0, this.MATRIX_A);
            /* mag01[x] = x * MATRIX_A  for x=0,1 */
            if (this.mti >= this.N) { /* generate N words at one time */
                var kk;
                if (this.mti == this.N + 1) /* if init_genrand() has not been called, */
                    this.init_genrand(5489); /* a default initial seed is used */
                for (kk = 0; kk < this.N - this.M; kk++) {
                    y = (this.mt[kk] & this.UPPER_MASK) | (this.mt[kk + 1] & this.LOWER_MASK);
                    this.mt[kk] = this.mt[kk + this.M] ^ (y >>> 1) ^ mag01[y & 0x1];
                }
                for (; kk < this.N - 1; kk++) {
                    y = (this.mt[kk] & this.UPPER_MASK) | (this.mt[kk + 1] & this.LOWER_MASK);
                    this.mt[kk] = this.mt[kk + (this.M - this.N)] ^ (y >>> 1) ^ mag01[y & 0x1];
                }
                y = (this.mt[this.N - 1] & this.UPPER_MASK) | (this.mt[0] & this.LOWER_MASK);
                this.mt[this.N - 1] = this.mt[this.M - 1] ^ (y >>> 1) ^ mag01[y & 0x1];
                this.mti = 0;
            }
            y = this.mt[this.mti++];
            /* Tempering */
            y ^= (y >>> 11);
            y ^= (y << 7) & 0x9d2c5680;
            y ^= (y << 15) & 0xefc60000;
            y ^= (y >>> 18);
            return y >>> 0;
        };
        /* generates a random number on [0,0x7fffffff]-interval */
        this.genrand_int31 = function () {
            return (this.genrand_int32() >>> 1);
        };
        /* generates a random number on [0,1]-real-interval */
        this.genrand_real1 = function () {
            return this.genrand_int32() * (1.0 / 4294967295.0);
            /* divided by 2^32-1 */
        };
        /* generates a random number on [0,1)-real-interval */
        this.random = function () {
            return this.genrand_int32() * (1.0 / 4294967296.0);
            /* divided by 2^32 */
        };
        /* generates a random number on (0,1)-real-interval */
        this.genrand_real3 = function () {
            return (this.genrand_int32() + 0.5) * (1.0 / 4294967296.0);
            /* divided by 2^32 */
        };
        /* generates a random number on [0,1) with 53-bit resolution*/
        this.genrand_res53 = function () {
            var a = this.genrand_int32() >>> 5, b = this.genrand_int32() >>> 6;
            return (a * 67108864.0 + b) * (1.0 / 9007199254740992.0);
        };
        if (seed == undefined) {
            seed = new Date().getTime();
        }
        /* Period parameters */
        this.N = 624;
        this.M = 397;
        this.MATRIX_A = 0x9908b0df; /* constant vector a */
        this.UPPER_MASK = 0x80000000; /* most significant w-r bits */
        this.LOWER_MASK = 0x7fffffff; /* least significant r bits */
        this.mt = new Array(this.N); /* the array for the state vector */
        this.mti = this.N + 1; /* mti==N+1 means mt[N] is not initialized */
        this.init_genrand(seed);
    }
    return MersenneTwister;
}());
export var opts = {
    width: 41,
    height: 41,
    turnRate: 0.1,
    roomSize: 7,
    roomSizeRange: 0.6,
    roomAttempts: 30,
    maxSectionConnections: 2,
    extraConnectionRate: 0.8
};
var adjacencies = [[-1, 0], [1, 0], [0, -1], [0, 1]];
export var Map2d = /** @class */ (function () {
    function Map2d(width, height, initializer) {
        this.width = width;
        this.height = height;
        this.changeLog = [];
        this.data = [];
        for (var i = 0; i < width * height; i++) {
            if (typeof initializer === "function") {
                this.data[i] = initializer(i % width, Math.floor(i / width));
            }
            else {
                this.data[i] = initializer;
            }
        }
    }
    Map2d.prototype.get = function (x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height)
            throw new Error("Index out of bounds");
        return this.data[x + y * this.width];
    };
    Map2d.prototype.set = function (x, y, val) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height)
            throw new Error("Index out of bounds");
        this.changeLog.push([x, y, val]);
        return this.data[x + y * this.width] = val;
    };
    Map2d.prototype.toString = function (strfn) {
        var _this = this;
        if (!strfn)
            strfn = function (d) { return d.toString(); };
        return this.data.map(strfn).map(function (str, i) { return (i + 1) % _this.width === 0 ? (str + "\n") : (str + " "); }).join("");
    };
    return Map2d;
}());
export function DunGen(config, seed) {
    var width = config.width;
    var height = config.height;
    var roomAttempts = config.roomAttempts || 50;
    var roomSize = config.roomSize || Math.min(width, height) / 5;
    var turnRate = config.turnRate || 0.15;
    var roomSizeRange = config.roomSizeRange || 0.25;
    var extraConnectionRate = config.extraConnectionRate !== undefined ? config.extraConnectionRate : 0.1;
    var maxSectionConnections = config.maxSectionConnections || 3;
    var sectionLabel = 1;
    var rooms = [];
    if (seed === undefined)
        seed = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
    var mt = new MersenneTwister(seed);
    var maxRoomId = 0;
    var dungeon = new Map2d(width, height, 0);
    roomLoop: for (var i = 0; i < roomAttempts; i++) {
        var roomWidth = Math.max(5, Math.abs(Math.round(roomSize + (mt.random() - 0.5) * 2 * roomSize * roomSizeRange)));
        if (roomWidth % 2 === 0)
            roomWidth++;
        var roomHeight = Math.max(5, Math.abs(Math.round(roomSize + (mt.random() - 0.5) * 2 * roomSize * roomSizeRange)));
        if (roomHeight % 2 === 0)
            roomHeight++;
        var x = Math.floor(mt.random() * (width - roomWidth) / 2) * 2 + 1;
        var y = Math.floor(mt.random() * (height - roomHeight) / 2) * 2 + 1;
        for (var u = x; u < x + roomWidth; u++) {
            for (var v = y; v < y + roomHeight; v++) {
                if (dungeon.get(u, v) !== 0) {
                    continue roomLoop;
                }
            }
        }
        for (var u = x; u < x + roomWidth; u++) {
            for (var v = y; v < y + roomHeight; v++) {
                dungeon.set(u, v, sectionLabel);
            }
        }
        rooms.push({ x: x, y: y, width: roomWidth, height: roomHeight });
        maxRoomId = sectionLabel;
        sectionLabel++;
    }
    function depthFirstMaze(x, y, direction) {
        dungeon.set(x, y, sectionLabel);
        var tryDirection = direction;
        if (direction === 0 && mt.random() < turnRate) {
            tryDirection = mt.random() < 0.5 ? 1 : 3;
        }
        else if (direction === 1 && mt.random() < turnRate) {
            tryDirection = mt.random() < 0.5 ? 0 : 2;
        }
        else if (direction === 2 && mt.random() < turnRate) {
            tryDirection = mt.random() < 0.5 ? 1 : 3;
        }
        else if (direction === 3 && mt.random() < turnRate) {
            tryDirection = mt.random() < 0.5 ? 0 : 2;
        }
        var flipflop = Math.floor(mt.random() * 2) * 2;
        var attemps = [tryDirection, (tryDirection + 2) % 4,
            (tryDirection + 1 + flipflop) % 4, (tryDirection + 3 + flipflop) % 4];
        for (var _i = 0, attemps_1 = attemps; _i < attemps_1.length; _i++) {
            var dir = attemps_1[_i];
            if (dir === (direction + 2) % 4)
                continue;
            var px = x;
            var py = y;
            var hx = x;
            var hy = y;
            switch (dir) {
                case 0:
                    hx++;
                    px += 2;
                    break;
                case 1:
                    hy++;
                    py += 2;
                    break;
                case 2:
                    hx--;
                    px -= 2;
                    break;
                case 3:
                    hy--;
                    py -= 2;
                    break;
            }
            if (px < 0 || px >= dungeon.width || py < 0 || py >= dungeon.height || dungeon.get(px, py) !== 0)
                continue;
            dungeon.set(hx, hy, sectionLabel);
            depthFirstMaze(px, py, dir);
        }
    }
    var offx = Math.floor(mt.random() * dungeon.width);
    var offy = Math.floor(mt.random() * dungeon.height);
    for (var i = 1; i < dungeon.width; i += 2) {
        for (var j = 1; j < dungeon.height; j += 2) {
            var x = (i + offx) % (dungeon.width - 1);
            var y = (j + offy) % (dungeon.height - 1);
            if (x % 2 === 0)
                x++;
            if (y % 2 === 0)
                y++;
            if (dungeon.get(x, y) === 0) {
                depthFirstMaze(x, y, mt.random() < 0.5 ? 0 : 1);
                sectionLabel++;
            }
        }
    }
    var buckets = {};
    for (var i = 1; i < dungeon.width - 1; i++) {
        for (var j = (i % 2 === 0) ? 1 : 2; j < dungeon.height - 1; j += 2) {
            var a = dungeon.get(i - 1, j) || dungeon.get(i, j - 1);
            var b = dungeon.get(i + 1, j) || dungeon.get(i, j + 1);
            if (a !== 0 && b !== 0 && a !== b) {
                var label = Math.min(a, b) + "," + Math.max(a, b);
                buckets[label] = buckets[label] || [];
                buckets[label].push([i, j]);
            }
        }
    }
    for (var label in buckets) {
        var hallway = parseInt(label.split(",")[1]) > maxRoomId;
        var entrances = void 0;
        if (hallway) {
            entrances = Math.floor(Math.pow(mt.random(), 2) * maxSectionConnections) + 1;
        }
        else {
            entrances = Math.round(mt.random());
        }
        for (var i = 0; i < entrances; i++) {
            var e = buckets[label][Math.floor(mt.random() * buckets[label].length)];
            dungeon.set(e[0], e[1], sectionLabel);
        }
        sectionLabel++;
    }
    function cullDeadEnd(x, y, recurse) {
        if (recurse === void 0) { recurse = true; }
        var paths = 0;
        if (dungeon.get(x - 1, y) !== 0)
            paths++;
        if (dungeon.get(x + 1, y) !== 0)
            paths += 2;
        if (dungeon.get(x, y - 1) !== 0)
            paths += 4;
        if (dungeon.get(x, y + 1) !== 0)
            paths += 8;
        if (paths === 1 || paths === 2 || paths === 4 || paths === 8)
            dungeon.set(x, y, 0);
        if (!recurse)
            return;
        switch (paths) {
            case 1: {
                dungeon.set(x - 1, y, 0);
                cullDeadEnd(x - 2, y);
                break;
            }
            case 2: {
                dungeon.set(x + 1, y, 0);
                cullDeadEnd(x + 2, y);
                break;
            }
            case 4: {
                dungeon.set(x, y - 1, 0);
                cullDeadEnd(x, y - 2);
                break;
            }
            case 8: {
                dungeon.set(x, y + 1, 0);
                cullDeadEnd(x, y + 2);
                break;
            }
        }
    }
    for (var i = 1; i < dungeon.width; i += 2) {
        for (var j = 1; j < dungeon.height; j += 2) {
            if (dungeon.get(i, j) !== 0)
                cullDeadEnd(i, j);
        }
    }
    for (var i = 1; i < dungeon.width - 1; i++) {
        for (var j = (i % 2 === 0) ? 1 : 2; j < dungeon.height - 1; j += 2) {
            if (dungeon.get(i, j) !== 0)
                continue;
            var a = dungeon.get(i - 1, j) || dungeon.get(i, j - 1);
            var b = dungeon.get(i + 1, j) || dungeon.get(i, j + 1);
            if (a !== 0 && b !== 0 && a === b && mt.random() < extraConnectionRate) {
                dungeon.set(i, j, a);
            }
        }
    }
    for (var i = 1; i < dungeon.width - 1; i++) {
        for (var j = 1; j < dungeon.height - 1; j++) {
            if (dungeon.get(i, j) === 0)
                dungeon.set(i, j, -1);
        }
    }
    function seedSectionCull(x, y, boundingSquares, sectionBounds) {
        if (sectionBounds === void 0) { sectionBounds = 0; }
        if (x === 1 || x === dungeon.width - 2 || y === 1 || y === dungeon.height - 2)
            sectionBounds = -1;
        dungeon.set(x, y, 0);
        for (var _i = 0, _a = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, -1], [-1, 1], [1, 1]]; _i < _a.length; _i++) {
            var off = _a[_i];
            var tile = dungeon.get(x + off[0], y + off[1]);
            if (tile === -1) {
                var bounds = seedSectionCull(x + off[0], y + off[1], boundingSquares, sectionBounds);
                if (bounds < 0 || sectionBounds < 0 || (sectionBounds && bounds !== sectionBounds))
                    sectionBounds = -1;
                else
                    sectionBounds = bounds;
            }
            else if (tile > 0) {
                if ((sectionBounds && sectionBounds !== tile) || sectionBounds < 0)
                    sectionBounds = -1;
                else {
                    sectionBounds = tile;
                    boundingSquares.push([x + off[0], y + off[1]]);
                }
            }
        }
        return sectionBounds;
    }
    var overall = [];
    for (var i = 0; i < dungeon.width; i++) {
        for (var j = 0; j < dungeon.height; j++) {
            if (dungeon.get(i, j) === -1) {
                var outline = [];
                if (seedSectionCull(i, j, outline) > 0) {
                    overall = overall.concat(outline);
                }
            }
        }
    }
    for (var _i = 0, overall_1 = overall; _i < overall_1.length; _i++) {
        var point = overall_1[_i];
        dungeon.set(point[0], point[1], -2);
    }
    function adjacentToCarved(x, y) {
        if (dungeon.get(x - 1, y) > 0)
            return true;
        if (dungeon.get(x + 1, y) > 0)
            return true;
        if (dungeon.get(x, y - 1) > 0)
            return true;
        if (dungeon.get(x, y + 1) > 0)
            return true;
        return false;
    }
    function connectsSelf(x, y, ownId) {
        var selfConnections = 0;
        if (Math.abs(dungeon.get(x - 1, y)) === Math.abs(ownId))
            selfConnections++;
        if (Math.abs(dungeon.get(x + 1, y)) === Math.abs(ownId))
            selfConnections++;
        if (Math.abs(dungeon.get(x, y - 1)) === Math.abs(ownId))
            selfConnections++;
        if (Math.abs(dungeon.get(x, y + 1)) === Math.abs(ownId))
            selfConnections++;
        return selfConnections > 1;
    }
    var openList = [];
    var openLabel = -sectionLabel;
    for (var _a = 0, overall_2 = overall; _a < overall_2.length; _a++) {
        var point = overall_2[_a];
        if (dungeon.get(point[0], point[1]) < -2)
            continue;
        if (adjacentToCarved(point[0], point[1])) {
            openList.push([point[0], point[1], openLabel]);
            dungeon.set(point[0], point[1], openLabel);
            openLabel--;
        }
    }
    function paintBack(x, y, newId) {
        var oldId = dungeon.get(x, y);
        if (oldId === newId)
            return;
        dungeon.set(x, y, newId);
        if (dungeon.get(x - 1, y) === oldId)
            paintBack(x - 1, y, newId);
        if (dungeon.get(x + 1, y) === oldId)
            paintBack(x + 1, y, newId);
        if (dungeon.get(x, y - 1) === oldId)
            paintBack(x, y - 1, newId);
        if (dungeon.get(x, y + 1) === oldId)
            paintBack(x, y + 1, newId);
    }
    while (openList.length > 0) {
        var cell = openList.shift();
        var tile = dungeon.get(cell[0], cell[1]);
        if (tile === cell[2]) {
            if (connectsSelf(cell[0], cell[1], cell[2])) {
                dungeon.set(cell[0], cell[1], 0);
            }
            else {
                dungeon.set(cell[0], cell[1], -cell[2]);
                for (var _b = 0, adjacencies_1 = adjacencies; _b < adjacencies_1.length; _b++) {
                    var off = adjacencies_1[_b];
                    if (dungeon.get(cell[0] + off[0], cell[1] + off[1]) < -1) {
                        dungeon.set(cell[0] + off[0], cell[1] + off[1], cell[2]);
                        openList.push([cell[0] + off[0], cell[1] + off[1], cell[2]]);
                    }
                }
            }
        }
        else if (tile < -2) {
            dungeon.set(cell[0], cell[1], -tile);
            paintBack(cell[0], cell[1], -cell[2]);
            for (var _c = 0, openList_1 = openList; _c < openList_1.length; _c++) {
                var openCell = openList_1[_c];
                if (openCell[2] === tile) {
                    if (dungeon.get(openCell[0], openCell[1]) === openCell[2]) {
                        dungeon.set(openCell[0], openCell[1], cell[2]);
                    }
                    openCell[2] = cell[2];
                }
            }
            for (var _d = 0, adjacencies_2 = adjacencies; _d < adjacencies_2.length; _d++) {
                var off = adjacencies_2[_d];
                if (dungeon.get(cell[0] + off[0], cell[1] + off[1]) < -1) {
                    dungeon.set(cell[0] + off[0], cell[1] + off[1], cell[2]);
                    openList.push([cell[0] + off[0], cell[1] + off[1], cell[2]]);
                }
            }
        }
    }
    for (var i = 1; i < dungeon.width - 1; i++) {
        for (var j = 1; j < dungeon.height - 1; j++) {
            if (dungeon.get(i, j) < 0)
                dungeon.set(i, j, 0);
            else if ((i % 2 === 0 || j % 2 === 0) && dungeon.get(i, j) !== 0)
                cullDeadEnd(i, j, false);
        }
    }
    for (var i = 1; i < dungeon.width; i += 2) {
        for (var j = 1; j < dungeon.height; j += 2) {
            if (dungeon.get(i, j) !== 0)
                cullDeadEnd(i, j);
        }
    }
    return { map: dungeon, rooms: rooms, seed: seed };
}
// exports.DunGen = DunGen;
