
chai.should();

describe('Timecode lib', function () {
    'use strict';

    var Timecode = window.Timecode;

    describe('#parse', function () {

        describe('fps#25 (default)', function () {
            var parse = function (val) {
                return Timecode.parse(val, '25');
            };

            it('should parse 00:00:00;00 to 0', function () {
                parse('00:00:00;00').should.equal(0);
            });
            it('should parse 00:00:00;01 to 1', function () {
                parse('00:00:00;01').should.equal(1);
            });
            it('should parse 00:00:00;24 to 24', function () {
                parse('00:00:00;24').should.equal(24);
            });
            it('should parse 00:00:01;00 to 25', function () {
                parse('00:00:01;00').should.equal(25);
            });
            it('should parse 00:00:02;00 to 50', function () {
                parse('00:00:02;00').should.equal(50);
            });
            it('should parse 00:01:00;00 to 1500', function () {
                parse('00:01:00;00').should.equal(1500);
            });
            it('should parse 01:00:00;00 to 90000', function () {
                parse('01:00:00;00').should.equal(90000);
            });
        });

        describe('fps#29.97', function () {
            var parse = function (val) {
                return Timecode.parse(val, '29.97');
            };

            it('should parse 00:00:00;00 to 0', function () {
                parse('00:00:00;00').should.equal(0);
            });
            it('should parse 00:00:00;01 to 1', function () {
                parse('00:00:00;01').should.equal(1);
            });
            it('should parse 00:00:00;29 to 29', function () {
                parse('00:00:00;29').should.equal(29);
            });
            it('should parse 00:00:01;00 to 30', function () {
                parse('00:00:01;00').should.equal(30);
            });
            it('should parse 00:00:02;00 to 60', function () {
                parse('00:00:02;00').should.equal(60);
            });

            // dropframes
            describe('with dropframes', function () {
                it('should parse 00:00:59;29 to 1799', function () {
                    parse('00:00:59;29').should.equal(1799);
                });
                it('should parse 00:01:00;00 to 1800', function () {
                    parse('00:01:00;00').should.equal(1800);
                });
                it('should parse 00:01:00;01 to 1800', function () {
                    parse('00:01:00;01').should.equal(1800);
                });
                it('should parse 00:01:00;02 to 1800', function () {
                    parse('00:01:00;02').should.equal(1800);
                });
                it('should parse 00:01:00;03 to 1801', function () {
                    parse('00:01:00;03').should.equal(1801);
                });
                it('should parse 00:09:59;29 to 17981', function () {
                    parse('00:09:59;29').should.equal(17981);
                });
                it('should parse 00:10:00;00 to 17982', function () {
                    parse('00:10:00;00').should.equal(17982);
                });
                it('should parse 00:10:00;01 to 17983', function () {
                    parse('00:10:00;01').should.equal(17983);
                });
            });
        });

        describe('positive signed fps#25 (default)', function () {
            var parse = function (val) {
                return Timecode.parse(val, '25');
            };

            it('should parse +00:00:00;00 to 0', function () {
                parse('+00:00:00;00').should.equal(0);
            });
            it('should parse +00:00:00;01 to 1', function () {
                parse('+00:00:00;01').should.equal(1);
            });
            it('should parse +00:00:00;24 to 24', function () {
                parse('+00:00:00;24').should.equal(24);
            });
            it('should parse +00:00:01;00 to 25', function () {
                parse('+00:00:01;00').should.equal(25);
            });
            it('should parse +01:00:00;00 to 90000', function () {
                parse('+01:00:00;00').should.equal(90000);
            });
        });

        describe('negative fps#25 (default)', function () {
            var parse = function (val) {
                return Timecode.parse(val, '25');
            };

            it('should parse -00:00:00;01 to -1', function () {
                parse('-00:00:00;01').should.equal(-1);
            });
            it('should parse -00:00:00;24 to -24', function () {
                parse('-00:00:00;24').should.equal(-24);
            });
            it('should parse -00:00:01;00 to -25', function () {
                parse('-00:00:01;00').should.equal(-25);
            });
            it('should parse -00:00:02;00 to -50', function () {
                parse('-00:00:02;00').should.equal(-50);
            });
            it('should parse -00:01:00;00 to -1500', function () {
                parse('-00:01:00;00').should.equal(-1500);
            });
            it('should parse -01:00:00;00 to -90000', function () {
                parse('-01:00:00;00').should.equal(-90000);
            });
        });

        describe('incorrect values', function () {
            var parse = function (val) {
                return Timecode.parse(val, '25');
            };
            it('should parse undefined to 0', function () {
                parse(undefined).should.equal(0);
            });
            it('should parse "" to 0', function () {
                parse("").should.equal(0);
            });
            it('should parse null to 0', function () {
                parse(null).should.equal(0);
            });

            it('should fill at the start if not enough info', function () {
                parse('00:00').should.equal(0);
            });

        });

        describe('maximum values', function () {
            var parseFormat = function (val) {
                var framerate = '25',
                    parsed = Timecode.parse(val, framerate);
                return Timecode.format(parsed, framerate);
            };

            it('should set maximum hours', function () {
                parseFormat('24:00:00:00').should.equal('23:00:00:00');
            });
            it('should set maximum minutes', function () {
                parseFormat('23:60:00:00').should.equal('23:59:00:00');
            });
            it('should set maximum seconds', function () {
                parseFormat('23:59:70:00').should.equal('23:59:59:00');
            });
            it('should set maximum frames', function () {
                parseFormat('23:59:59:30').should.equal('23:59:59:24');
            });
        });

        describe('value without separators', function () {
            var parseFormat = function (val) {
                var framerate = '25',
                    parsed = Timecode.parse(val, framerate);
                return Timecode.format(parsed, framerate);
            };

            it('should parse 00000001 to 00000001', function () {
                parseFormat('00000001').should.equal('00:00:00:01');
            });

        });

    });

    describe('#format', function () {

        describe('fps#25 (default)', function () {
            var format = function (val) {
                return Timecode.format(val, '25');
            };

            it('should format 0 to 00:00:00:00', function () {
                format(0).should.equal('00:00:00:00');
            });
            it('should format 1 to 00:00:00:01', function () {
                format(1).should.equal('00:00:00:01');
            });
            it('should format 24 to 00:00:00:24', function () {
                format(24).should.equal('00:00:00:24');
            });
            it('should format 25 to 00:00:01:00', function () {
                format(25).should.equal('00:00:01:00');
            });
            it('should format 50 to 00:00:02:00', function () {
                format(50).should.equal('00:00:02:00');
            });
            it('should format 1499 to 00:00:59:24', function () {
                format(1499).should.equal('00:00:59:24');
            });
            it('should format 1500 to 00:01:00:00', function () {
                format(1500).should.equal('00:01:00:00');
            });
            it('should format 90000 to 01:00:00:00', function () {
                format(90000).should.equal('01:00:00:00');
            });
        });

        describe('fps#29.97', function () {
            var format = function (val) {
                return Timecode.format(val, '29.97');
            };

            it('should format 0 to 00:00:00;00', function () {
                format(0).should.equal('00:00:00;00');
            });
            it('should format 1 to 00:00:00;01', function () {
                format(1).should.equal('00:00:00;01');
            });
            it('should format 29 to 00:00:00;29', function () {
                format(29).should.equal('00:00:00;29');
            });
            it('should format 30 to 00:00:01;00', function () {
                format(30).should.equal('00:00:01;00');
            });
            it('should format 1799 to 00:00:59;29', function () {
                format(1799).should.equal('00:00:59;29');
            });
            it('should format 1800 to 00:01:00;02', function () {
                format(1800).should.equal('00:01:00;02');
            });
            it('should format 1801 to 00:01:00;03', function () {
                format(1801).should.equal('00:01:00;03');
            });
            it('should format 3597 to 00:01:59;29', function () {
                format(3597).should.equal('00:01:59;29');
            });
            it('should format 3598 to 00:02:00;02', function () {
                format(3598).should.equal('00:02:00;02');
            });
            it('should format 3599 to 00:02:00;03', function () {
                format(3599).should.equal('00:02:00;03');
            });
            it('should format 17981 to 00:09:59;29', function () {
                format(17981).should.equal('00:09:59;29');
            });
            it('should format 17982 to 00:10:00;00', function () {
                format(17982).should.equal('00:10:00;00');
            });
            it('should format 19781 to 00:10:59;29', function () {
                format(19781).should.equal('00:10:59;29');
            });
            it('should format 19782 to 00:11:00;02', function () {
                format(19782).should.equal('00:11:00;02');
            });
            it('should format 19782 to 00:11:00;02', function () {
                format(19782).should.equal('00:11:00;02');
            });
            it('should format 1801798 to 16:42:00;02', function () {
                format(1801798).should.equal('16:42:00;02');
            });
            it('should format 1801799 to 16:42:00;03', function () {
                format(1801799).should.equal('16:42:00;03');
            });
        });

        describe('negative fps#25 (default)', function () {
            var format = function (val) {
                return Timecode.format(val, '25');
            };

            it('should format -1 to -00:00:00:01', function () {
                format(-1).should.equal('-00:00:00:01');
            });
            it('should format -2 to -00:00:00:02', function () {
                format(-2).should.equal('-00:00:00:02');
            });
            it('should format -24 to -00:00:00:24', function () {
                format(-24).should.equal('-00:00:00:24');
            });
            it('should format -25 to -00:00:01:00', function () {
                format(-25).should.equal('-00:00:01:00');
            });
            it('should format -1499 to -00:00:59:24', function () {
                format(-1499).should.equal('-00:00:59:24');
            });
            it('should format -1500 to -00:01:00:00', function () {
                format(-1500).should.equal('-00:01:00:00');
            });
            it('should format -1501 to -00:01:00:01', function () {
                format(-1501).should.equal('-00:01:00:01');
            });
        });

        describe('negative fps#29.97', function () {
            var format = function (val) {
                return Timecode.format(val, '29.97');
            };

            it('should format -1 to -00:00:00;01', function () {
                format(-1).should.equal('-00:00:00;01');
            });
            it('should format -2 to -00:00:00;02', function () {
                format(-2).should.equal('-00:00:00;02');
            });
            it('should format -30 to -00:00:01;00', function () {
                format(-30).should.equal('-00:00:01;00');
            });
            it('should format -1799 to -00:00:59;29', function () {
                format(-1799).should.equal('-00:00:59;29');
            });
            it('should format -1800 to -00:01:00;02', function () {
                format(-1800).should.equal('-00:01:00;02');
            });
        });

        describe('offset fps#29.97', function () {
            var format = function (val) {
                return Timecode.format(val, '29.97', true);
            };

            it('should format 0 to +00:00:00;00', function () {
                format(0).should.equal('+00:00:00;00');
            });
            it('should format -2 to -00:00:00;02', function () {
                format(-2).should.equal('-00:00:00;02');
            });
            it('should format 30 to +00:00:01;00', function () {
                format(30).should.equal('+00:00:01;00');
            });
        });

        describe('incorrect values', function () {
            var format = function (val) {
                return Timecode.format(val, '29.97');
            };

            it('should format "" to ""', function () {
                format("").should.equal("");
            });
            it('should format undefined to ""', function () {
                format(undefined).should.equal("");
            });
        });

        describe('max hours', function () {
            var format = function (val) {
                return Timecode.format(val, '29.97');
            };

            it('should format amount of frames > 23hrs to "00:"', function () {
                var val = Timecode.parse('23:59:59;29', '29.97') + 1;
                format(val).should.equal("00:00:00;00");
            });
        });

//        describe('format brut test', function () {
//            var formats;
//            function parseInt10(val) { return parseInt(val, 10); }
//
//            describe('fps#29.97', function () {
//                function format(val) { return Timecode.format(val, '29.97'); }
//                function parse(val) { return Timecode.parse(val, '29.97'); }
//                function generateFormats() {
//                    var result = [], i = 0, l = 24 * 60 * 60 * 30 - 2592;
//                    for (; i < l; i++) {
//                        result.push({key: i, val: format(i)});
//                    }
//                    return result;
//                }
//                before(function () {
//                    formats = generateFormats();
//                });
//
//                it('all format should be fine', function () {
//                    var output = formats, result;
//
//                    result = output.filter(function (el) {
//                        var arr, m, s, f, lastChar = el.val.substr(-1, 1);
//
//                        if (lastChar !== '0' && lastChar !== '1') return !!0;
//                        arr = el.val.split(/[\:\;]/).map(parseInt10);
//
//                        m = arr[1];
//                        s = arr[2];
//                        f = arr[3];
//
//                        return s === 0 &&
//                            (f === 0 || f === 1) &&
//                            (m % 10 !== 0);
//                    });
//
//                    if (result.length) {
//                        console.log(result);
//                        chai.assert.fail();
//                    }
//
//                    (s(result)).should.equal(s([]));
//                });
//                it('all parseFormat should be fine', function () {
//                    var output = formats, result;
//
//                    result = output.filter(function (el) {
//                        var key = el.key, val = el.val;
//                        return parse(val) !== key;
//                    });
//
//                    if (result.length) {
//                        console.log(result.slice(0, 10), result.length);
//                        chai.assert.fail();
//                    }
//
//                    (s(result)).should.equal(s([]));
//                });
//            });
//
//        });

    });

    describe('Class', function () {
        var date = '2014-01-01', timecode = '00:00:00;00', dtc, t;
        dtc = [date, timecode].join(' ');


        beforeEach(function () {
            t = new Timecode(dtc, '29.97');
        });

        describe('#setDate', function () {

            it('should set date from text', function () {
                t.setDate('2015-01-01');
                t.date.should.eql(new Date('2015-01-01'));
            });

            it('should set date', function () {
                t.setDate(new Date('2015-01-01'));
                t.date.should.eql(new Date('2015-01-01'));
            });

        });

        describe('#setTimecode', function () {

            it('should set frames base on timecode', function () {
                t.setTimecode('00:00:01;00');
                t.frames.should.equal(30);
            });

        });

        describe('#setFrames', function () {

            it('should set frames amount', function () {
                t.setFrames(10);
                t.frames.should.equal(10);
            });

        });

        describe('#setDTC', function () {

            it('should set whole date-timecode', function () {
                t.setDTC(dtc);
                t.date.should.eql(new Date(date));
                t.frames.should.eql(0);
            });

        });

        describe('#formatDate', function () {

            it('should return date formatted YYYY-MM-DD', function () {
                t.formatDate().should.equal('2014-01-01');
            });

        });

        describe('#formatTimecode', function () {

            it('should format frames', function () {
                t.formatTimecode().should.equal('00:00:00;00');
            });

        });

        describe('#format', function () {

            it('should format dtc', function () {
                t.format().should.equal('2014-01-01 00:00:00;00');
            });

        });

        describe('#constructor', function () {

            it('should treat execution as creating new obj', function () {
                var t = Timecode('2014-01-01 00:00:00;00');
                t.should.be.instanceOf(Timecode);
            });

            it('should set date, frames, frameRate', function () {
                var t = new Timecode('2014-01-01 00:00:01;00', '29.97');
                t.date.should.eql(new Date(date));
                t.frames.should.equal(30);
                t.frameRate.should.equal('29.97');
            });

            it('should detect PAL', function () {
                var t = new Timecode('2014-01-01 00:00:00:00');
                t.frameRate.should.equal('25');
            });

            it('should detect NTSC', function () {
                var t = new Timecode('2014-01-01 00:00:00;00');
                t.frameRate.should.equal('29.97');
            });

        });

        describe('obj#add', function () {
            var t, validDTC;

            beforeEach(function () {
                validDTC = '2014-01-01 00:00:01;00';
                t = new Timecode(validDTC, '29.97');
            });

            it('should add frames', function () {
                t.add(30);
                t.frames.should.equal(60);
            });

            it('should subtract frames', function () {
                t.add(-10);
                t.frames.should.equal(20);
            });

            it('should add by timecode', function () {
                t.add('00:00:01;00');
                t.frames.should.equal(60);
            });

            it('should subtract by timecode', function () {
                t.add('-00:00:00;10');
                t.frames.should.equal(20);
            });

            it('should respect switching to previous day', function () {
                t.add(-31);
                t.format().should.equal('2013-12-31 23:59:59;29');
            });

            it('should respect switching to next day', function () {
                t.setDTC('2014-01-01 23:59:59;29');
                t.add('00:00:00:01');
                t.format().should.equal('2014-01-02 00:00:00;00');
            });

            it('should respect switching to next day', function () {
                t.add('00:00:00:01').should.equal(t);
            });

        });

        describe('obj#subtract', function () {
            var t, validDTC;

            beforeEach(function () {
                validDTC = '2014-01-01 00:00:01;00';
                t = new Timecode(validDTC, '29.97');
            });

            it('should subtract frames', function () {
                t.subtract(30);
                t.frames.should.equal(0);
            });

            it('should subtract negative frames', function () {
                t.subtract(-10);
                t.frames.should.equal(40);
            });

            it('should subtract by timecode', function () {
                t.subtract('00:00:01;00');
                t.frames.should.equal(0);
            });

            it('should subtract negative by timecode', function () {
                t.subtract('-00:00:00;10');
                t.frames.should.equal(40);
            });

            it('should return obj', function () {
                t.subtract(1).should.equal(t);
            });

        });

    });

});


