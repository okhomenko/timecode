timecode
========

Library for working with Timecodes (support drop frames for NTSC)

## Tests:

`npm install`
`make test`

### Coverage

`make coverage`

### Brutal test

I have commented test that look over all possible timecodes and check if dropframes treated in proper maner. These tests are commented as they run about 30 seconds.

## Use:

`Timecode.parse(timecode, frameRate)`

`Timecode.format(frames, frameRate)`

`new Timecode(DateTimecode, frameRate)`

## Instance methods:

- setTimecode(timecode)
- setFrames(frames)
- setDTC(DateTimecode)

- formatDate() -- return date in format '2014-03-31'
- formatTimecode() -- return timecode in format '00:00:00;00'
- format() -- return DTC in format '2014-03-31 00:00:00;00'

- add(timecode|frames) - you can add some timecode or amount of frames to current DTC, timecode/frames can be negative
- subtract(timecode|frames) - the same as above but subtract frames

`add` and `subtract` methods shift date if time is over 23:59:59;29 or above 00:00:00;00
