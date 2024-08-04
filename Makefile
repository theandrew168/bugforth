.POSIX:
.SUFFIXES:

.PHONY: default
default: build

node_modules:
	npm install

.PHONY: build
build: node_modules
	npm run build

.PHONY: run
run: node_modules
	npm run dev

.PHONY: test
test: node_modules
	npm run test

.PHONY: format
format: node_modules
	npm run format

.PHONY: update
update:
	npm update --save

.PHONY: clean
clean:
	rm -fr dist/
