# Furniture v2 - Remix - Boiler Plate

---

This repository is what we call a "subtree split": a read-only copy of one directory of the main repository.

If you want to report or contribute, you should do it on the main repository: https://github.com/CrystallizeAPI/boilerplates

---

# Requirements

-   Volta.sh (that will bring good version of Node )
-   Caddy Server v2
-   `mkcert` for https with local domains

# Installation

For a better experience and respect the [Twelve-Facter App](https://12factor.net/dev-prod-parity) we recomend to have local domain

## Add local domains

Add an entry for the subdomains in your `/etc/hosts` file:

```
127.0.0.1 furniture.superfast.crystal furniture.sapi.superfast.crystal
```

## Installation

```bash
make install
```

> Important!: You need to provide correct credentials in the `frontend/.env` and `service-api/.env`

This will:

-   install the Certificate Authority using `mkcert`
-   generate the certificates `mkcert` for `*.superfast.crystal`
-   `npm install` the `frontend` folder and `service-api` folder

## Run the project

```bash
make serve
```

This will:

-   run the node project on HTTP
-   run the Caddy proxy on HTTPS
-   run the Docker Network

> you can stop non stopped services with `make stop`

-   Frontend: https://furniture.superfast.crystal
-   Service API: https://furniture.sapi.superfast.crystal
-   Mailcatcher - Web: http://localhost:3022
-   Mailcatcher SMTP: http://localhost:3021
-   Redis: tcp://localhost:3023

> Note: to connect to Redis: `docker run --rm --net=host -it redis redis-cli -h 127.0.0.1 -p 3023`

# Gotchas

-   Frontend run in HTTP on 3018
-   Frontend Live Reload WebScoket run in HTTP on 3019
-   Service API run in HTTP on 3020
-   Caddy enables HTTPS on top of them all
