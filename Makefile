default: build
	cp .env-production .env
	docker-compose up -d

build:
	docker-compose build

destroy:
	docker-compose down -v

dev: build
	cp .env-local .env
	docker-compose up -d

dev-clean: destroy dev

test:
	docker-compose exec server bash -c 'npm test'

fix:
	docker-compose exec server bash -c 'npm run lint:fix'

.PHONY: default destroy dev build dev-clean test fix
