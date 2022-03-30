# Furniture v2 - Remix - Boiler Plate

----

This repository is what we call a "subtree split": a read-only copy of one directory of the main repository. 

If you want to report or contribute, you should do it on the main repository: https://github.com/CrystallizeAPI/boilerplates

----

# Requirements

- Volta.sh (that will bring good version of Node )
- Caddy Server v2
- `mkcert` for https with local domains

# Installation

For a better experience and respect the [Twelve-Facter App](https://12factor.net/dev-prod-parity) we recomend to have local domain

## Add local domains

Add an entry for the subdomains in your `/etc/host` file:

```
127.0.0.1 service-api.app.crystal frontend.app.crystal
```

## Installation

```bash
make install
```

This will:

- install the Certificate Authority using `mkcert`
- generate the certificates `mkcert` for `*.app.crystal`
- `npm install` the `front-end` folder and `service-api` folder

## Run the project

```bash
make serve
```

This will:

- run the node project on HTTP
- run the Caddy proxy on HTTPS
- run the Docker Network

> you can stop non stopped services with `make stop`

Frontend: https://frontend.app.crystal
Service API: https://service-api.app.crystal
Mailcatcher: http://localhost:11080

# Gotchas

- Frontend run in HTTP on 11235
- Frontend Live Reload WebScoket run in HTTP on 11236
- Service API run in HTTP on 11237
- Caddy enables HTTPS on top of them all
