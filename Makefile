.PHONY: init
init:
	make clean
	docker-compose build
	docker-compose run --rm app npm ci
	docker-compose run --rm app prisma migrate deploy

.PHONY: clean
clearn:
	docker-compose down --volumes

.PHONY: dev
dev:
	docker-compose down app
	docker-compose up app

.PHONY: unit
unit:
	docker-compose run --rm app npm run test

.PHONY: e2e
e2e:
	docker-compose run --rm app npm run test:e2e

.PHONY: infra
infra:
	docker-compose down postgres 
	docker-compose up postgres

.PHONY: bash
bash:
	docker-compose up --no-start app 
	docker-compose start app
	docker-compose exec app sh
