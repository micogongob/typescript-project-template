RUN_NPM = npm

envfile ?= .env.example

.env:
	cp -f $(envfile) .env

install:
	$(RUN_NPM) install

build:
	$(RUN_NPM) run build

test:
	$(RUN_NPM) test

lint:
	$(RUN_NPM) run lint

fmt:
	$(RUN_NPM) run fmt

run:
	$(RUN_NPM) start