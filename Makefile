# === Makefile Helper ===

# Styles
YELLOW=$(shell echo "\033[00;33m")
RED=$(shell echo "\033[00;31m")
RESTORE=$(shell echo "\033[0m")

# Variables
DOCKER_COMPOSE_ARGS := COMPOSE_PROJECT_NAME=furnituremix COMPOSE_FILE=provisioning/dev/docker-compose.yaml
DOCKER_COMPOSE := $(DOCKER_COMPOSE_ARGS) docker compose
NPM := npm
CADDY = caddy
CADDY_PID_FILE := provisioning/dev/caddy.dev.pid

.DEFAULT_GOAL := list

.PHONY: list
list:
	@echo "******************************"
	@echo "${YELLOW}Available targets${RESTORE}:"
	@grep -E '^[a-zA-Z-]+:.*?## .*$$' Makefile | sort | awk 'BEGIN {FS = ":.*?## "}; {printf " ${YELLOW}%-15s${RESTORE} > %s\n", $$1, $$2}'
	@echo "${RED}==============================${RESTORE}"

.PHONY: clean
clean: stop ## Clean non-essential files
	@rm -rf application/node_modules
	@$(DOCKER_COMPOSE) down
	
.PHONY: install
install:
	@$(NPM) install
	@cd application && cp .env.dist .env && cd ..
	@cd application && $(NPM) install && cd ..	

.PHONY: npmupdate
npmupdate: ## npmupdate
	@cd application && $(NPM) update && cd ..

.PHONY: serve-application
serve-application: ## Service the Application
	@cd application && $(NPM) run dev

.PHONY: stop
stop: ## Stop all the local services you need
	-@$(DOCKER_COMPOSE) stop > /dev/null 2>&1
	-@$(CADDY) stop > /dev/null 2>&1 &
	-@if [ -f $(CADDY_PID_FILE) ]; then \
		kill -9 `cat $(CADDY_PID_FILE)`; \
		rm -f  $(CADDY_PID_FILE); \
	fi

run: ## Run node+caddy outside on host
	@touch $(CADDY_PID_FILE)
	@$(CADDY) start \
		--config provisioning/dev/Caddyfile \
		--pidfile $(CADDY_PID_FILE)
	@$(MAKE) serve-application

.PHONY: serve
serve: stop ## Run all the local services you need
	@$(DOCKER_COMPOSE) up -d
	@$(CADDY) start --config provisioning/dev/Caddyfile --pidfile provisioning/dev/caddy.dev.pid
	@$(MAKE) serve-application
	
.PHONY: codeclean
codeclean: ## Code Clean
	@npm run prettier
