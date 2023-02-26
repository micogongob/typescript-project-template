RUN_NPM = npm

install:
	yarn install

build:
	yarn build

lint:
	yarn lint

fmt:
	yarn fmt

.env:
	yarn .env

run:
	yarn run_app