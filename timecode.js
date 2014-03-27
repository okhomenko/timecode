(function (window) {
    'use strict';

    var floor = Math.floor, round = Math.round,
        FRAMERATES, MAX_SECONDS, MAX_MINUTES, MAX_HOURS, MAX_FRAMES;

    FRAMERATES = {
        NTSC:  '29.97',
        PAL:   '25',
        NTSCP: '59.97',
        PALP:  '50'
    };

    MAX_SECONDS = 59;
    MAX_MINUTES = 59;
    MAX_HOURS = 23;

    MAX_FRAMES = {
        '29.97': 24 * 60 * 60 * 30 - 24 * 6 * 9 * 2, // 2589408
        '25': 24 * 60 * 60 * 25 // 2160000
    };

    function pad(n, z, len) {
        n += ''; // stringify number
        return n.length >= len ? n : new Array(len - n.length + 1).join(z) + n;
    }

    function pad2(n) { return pad(n, '0', 2); }

    function parseInt10(str) { return parseInt(str, 10); }

    function isType(variable, type) { return typeof variable === type; }

    function isString(string) { return isType(string, 'string'); }

    function isNumber(number) { return isType(number, 'number'); }

    function isUndef(undefined) { return isType(undefined, 'undefined'); }

    function isNegative(val) { return val.toString().substr(0, 1) === '-'; }

    function timecodeToArray(str) {
        var result = str.replace(/[\-\+]/, '').split(/[\:\;]/);

        if (result[0].length === 8) { result = result[0].match(/[\s\S]{2}/g); }

        while (result.length < 4) result.unshift(0);

        return result;
    }

    function isNTSC(framerate) {
        return framerate === FRAMERATES.NTSC || framerate === FRAMERATES.NTSCP;
    }

    function ceilTimecode(arr, framerate) {
        var h, m, s, f, rate;

        rate = round(framerate);

        h = arr[0];
        m = arr[1];
        s = arr[2];
        f = arr[3];

        if (h > MAX_HOURS) { h = MAX_HOURS; }
        if (m > MAX_MINUTES) { m = MAX_MINUTES; }
        if (s > MAX_SECONDS) { s = MAX_SECONDS; }
        if (f > rate - 1) { f = rate - 1; }

        arr = [h, m, s, f];

        // if not NTSC timecode leave as is
        if (!isNTSC(framerate)) return arr;
        // if this is minutes divisible on 10 leave as is
        if (arr[1] % 10 === 0) return arr;
        // if it is not start of minute leave as is
        if (arr[2] !== 0) return arr;
        // if frame bigger or equal 2 leave as is
        if (arr[3] >= 2) return arr;

        // if all above is false - updated frames up to 2
        arr[3] = 2;
        return arr;
    }

    function computeDropFrames(frames, rate) {
        var minutes, x;

        minutes = floor(floor(frames / rate) / 60);
        x = minutes - floor(minutes / 10);

        return 2 * x;
    }

    function computeAppendFrames(frames, rate, pass) {
        var minutes = floor(floor(frames / rate) / 60),
            koef = minutes - floor(minutes / 10),
            result;

        result = minutes ? koef * 2 : 0;

        if (pass !== 2) {
            result = computeAppendFrames(frames + result, rate, 2);
        }

        return result;
    }

    function isValid(val) {
        return !isUndef(val) && val !== null && val !== '';
    }

    function reduceHMSF(hmsf, rate) {
        var sum = 0;

        sum += hmsf[3];
        sum += hmsf[2] * rate;
        sum += hmsf[1] * 60 * rate;
        sum += hmsf[0] * 3600 * rate;

        return sum;
    }

    function joinHMSF(arr, sign, framerate) {
        var sep = isNTSC(framerate) ? ';' : ':';
        arr = arr.map(pad2);
        return sign + [arr[0], arr[1], [arr[2], arr[3]].join(sep)].join(':');
    }

    function getSign(frames, showSign) {
        var negative = frames < 0, sign;

        sign = negative ? '-' : '';
        if (showSign === true) { sign = !negative ? '+' : '-'; }

        return sign;
    }

    /**
     * Detect frameRate base on format
     *
     * @param timecode
     * @returns {*}
     */
    function detectFrameRate(timecode) {
        return timecode.substr(8, 1) === ';' ? FRAMERATES.NTSC : FRAMERATES.PAL;
    }

    function parse(timecode, framerate) {
        var rate = round(framerate), negative, frames, parts;

        if (!isValid(timecode)) return 0;

        negative = isNegative(timecode);
        parts = timecodeToArray(timecode).map(parseInt10);
        parts = ceilTimecode(parts, framerate);
        frames = reduceHMSF(parts, rate);

        // if NTSC - drop frame labels
        if (isNTSC(framerate)) {
            frames -= computeDropFrames(frames, rate);
        }

        return (negative ? -1 : 1) * frames;
    }

    function format(frames, framerate, showSign) {
        var rate, f, s, m, h, sign, hasDropframes = isNTSC(framerate);

        if (!isValid(frames)) { return ''; }

        rate = round(framerate);
        f = (frames < 0 ? -1 : 1) * frames;

        if (hasDropframes) {
            f += computeAppendFrames(f, rate);
        }

        s = floor(f / rate);
        m = floor(s / 60);
        h = floor(m / 60);

        f -= s * rate;
        s -= m * 60;
        m -= h * 60;

        if (hasDropframes && m % 10 !== 0 && s === 0) {
            if (f === 0) f = 2;
            if (f === 1) f = 3;
        }

        h = h > MAX_HOURS ? 0 : h;

        sign = getSign(frames, showSign);

        return joinHMSF([h, m, s, f], sign, framerate);
    }

    function Timecode(dtc, frameRate) {
        if (!(this instanceof Timecode)) return new Timecode(dtc, frameRate);
        var timecode = dtc.split(' ')[1];

        this.frameRate = (frameRate || detectFrameRate(timecode)) + '';
        this.setDTC(dtc);
    }

    Timecode.prototype = {
        constructor: Timecode,

        _format: function (frames) {
            return format(frames, this.frameRate);
        },

        _parse: function (timecode) {
            return parse(timecode, this.frameRate);
        },

        setDate: function (date) {
            this.date = new Date(date);
        },

        _setTimecode: function (timecode) {
            this._setFrames(this._parse(timecode));
        },

        _setFrames: function (frames) {
            var max = MAX_FRAMES[this.frameRate];

            switch (true) {
            case frames < 0:
                this._subtractDay();
                frames += max;
                break;
            case frames >= max:
                this._addDay();
                frames -= max;
                break;
            }

            this.frames = frames;
        },

        setTimecode: function (timecode) {
            if (isString(timecode)) this._setTimecode(timecode);
            if (isNumber(timecode)) this._setFrames(timecode);
        },

        // setTimecode alias
        setFrames: function () {
            return this.setTimecode.apply(this, arguments);
        },

        setDTC: function (dtc) {
            var buf = dtc.split(' ');

            this.setDate(buf[0]);
            this.setTimecode(buf[1]);

            return this;
        },

        // _format exposer
        formatTimecode: function () {
            return this._format(this.frames);
        },

        formatDate: function () {
            var y, m, d;

            y = this.date.getUTCFullYear();
            m = this.date.getUTCMonth() + 1;
            d = this.date.getUTCDate();

            return [y, m, d].map(pad2).join('-');
        },

        format: function () {
            var date, tc;

            date = this.formatDate();
            tc = this.formatTimecode();

            return [date, tc].join(' ');
        },

        _addTimecode: function (timecode) {
            this._addFrames(this._parse(timecode));
        },

        _addFrames: function (frames) {
            this.setFrames(this.frames + frames);
        },

        _shiftDay: function (days) {
            var milliseconds = days * 24 * 60 * 60 * 1000;
            this.setDate(this.date.getTime() + milliseconds);
        },

        _addDay: function () {
            this._shiftDay(1);
        },

        _subtractDay: function () {
            this._shiftDay(-1);
        },

        add: function (timecode) {
            if (isString(timecode)) this._addTimecode(timecode);
            if (isNumber(timecode)) this._addFrames(timecode);

            return this;
        },

        // facade for add
        subtract: function (timecode) {
            if (isString(timecode)) timecode = this._parse(timecode);
            return this.add(timecode * -1);
        }

    };


    //
    // Static functions
    //

    Timecode.parse = parse;
    Timecode.format = format;
    Timecode.isNTSC = isNTSC;

    //
    // Expose
    //

    window.Timecode = Timecode;

}(window));
