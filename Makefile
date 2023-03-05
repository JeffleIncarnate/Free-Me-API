dev:
	@npm run dev

build:
	@rm -rf dist/
	@npx tsc 

clean:
	@rm -rf dist/

prod:
	@make build
	@node dist/index.js

