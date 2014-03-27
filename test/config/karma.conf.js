module.exports = function (config) {
    'use strict';

    config.set({
        basePath: '..',
        frameworks: ['mocha'],

        // coverage reporter generates the coverage
//        reporters: ['coverage'],

        preprocessors: {
            // source files, that you wanna generate coverage for
            // do not include tests or libraries
            // (these files will be instrumented by Istanbul)
            '*.js': ['coverage']
        },

        // optionally, configure the reporter
        coverageReporter: {
            type : 'html',
            dir : 'coverage/'
        },

        files: [
            '*.js',

            // Test libs
            'test/lib/chai/chai*.js',
            'test/lib/sinon-chai.js',
            'test/lib/sinon/sinon*.js',

            // tests
            'test/*.js',
        ]
    });
};
