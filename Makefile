BASEPATH='../..'
CHROME='Chrome'
FIREFOX='Firefox'
BROWSERS=$(FIREFOX)

.PHONY: test coverage

.DEFAULT_GOAL := all

base_test:
	node ./node_modules/karma/bin/karma start test/config/karma.conf.js --basePath $(BASEPATH) $(EXTRA_OPTS)

test:
	$(MAKE) base_test EXTRA_OPTS="--browsers $(BROWSERS) --single-run"

coverage:
	rm -rf coverage;
	$(MAKE) base_test EXTRA_OPTS="--browsers $(BROWSERS) --single-run --reporters coverage --port 9888"


