SHELL := /bin/bash

build:
	@node_modules/interleave/bin/interleave src/fui.js --wrap oldschool --uglify

test:
	@mocha --reporter spec

.PHONY: test