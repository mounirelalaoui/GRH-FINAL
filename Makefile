# GestionRH — Makefile (Linux/Mac/WSL)
.PHONY: install dev build test seed fresh

install:
	cd frontend && npm install
	cd backend && composer install && cp -n .env.example .env || true
	cd backend && php artisan key:generate

dev:
	cd backend && php artisan serve --port=8000 &
	cd frontend && npm run dev

build:
	cd frontend && npm run build

seed:
	cd backend && php artisan db:seed

fresh:
	cd backend && php artisan migrate:fresh --seed
