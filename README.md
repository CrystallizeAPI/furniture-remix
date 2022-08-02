# Furniture v2 - Remix Run - Boilerplate

---

This repository is what we call a "subtree split": a read-only copy of one directory of the main repository.

If you want to report or contribute, you should do it on the main repository: https://github.com/CrystallizeAPI/boilerplates

---

# Requirements

-   Volta.sh (that will bring good version of Node )
-   Caddy Server v2

# Installation

For a better experience and respect the [Twelve-Facter App](https://12factor.net/dev-prod-parity) we recomend to have local domain

## Add local domains

Add an entry for the subdomains in your `/etc/hosts` file:

### Using /etc/hosts

```
127.0.0.1 SUPERFASTPROJECTIDENTIFIER.superfast.local
```

### Using dnsmasq for multiple tenants

You only ever need to do this once for all Superfast stores you might set up

```
brew install dnsmasq
echo "address=/superfast.local/127.0.0.1" >> /opt/homebrew/etc/dnsmasq.conf
sudo mdkir -p /etc/resolver && echo "nameserver 127.0.0.1" > /etc/resolver/local
sudo brew services restart dnsmasq
```

## Installation

```bash
make install
```

> Important!: You need to provide correct credentials in the `frontend/.env`.

This will:

-   `npm install` the `frontend` folder

## Run the project

```bash
make serve
```

This will:

-   run the node project on HTTP
-   run the Caddy proxy on HTTPS
-   run the Docker Network

> you can stop non stopped services with `make stop`

-   Frontend: https://furniture.superfast.local
-   Mailcatcher - Web: http://localhost:3022
-   Mailcatcher SMTP: http://localhost:3021
-   Redis: tcp://localhost:3023

> Note: to connect to Redis: `docker run --rm --net=host -it redis redis-cli -h 127.0.0.1 -p 3023`

# Gotchas

-   Frontend run in HTTP on 3018
-   Frontend Live Reload WebScoket run in HTTP on 3019
-   Caddy enables HTTPS on top of them all
