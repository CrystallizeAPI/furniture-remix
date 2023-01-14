# Crystallize - Remix Run - Boilerplate

# Installation

```bash
npx @crystallize/cli-next@latest install remix-run
```

And you got your project running thanks to :

```bash
cd remix-run && application
npm run dev
```

# Docker services

By default, docker is not used.
In the `provisioning/dev/` folder you will see a `docker-compose.yaml` that can be used.

```bash
make serve
```

This will start the Docker network, starting Mailcatch and Redis.
You then need to adapt the `.env` file of course to start using those services.

# Custom Local domain and HTTPS

For a better experience and respect the [Twelve-Facter App](https://12factor.net/dev-prod-parity) we recomend to have local domain

And everything is ready for you too.

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
sudo mkdir -p /etc/resolver && echo "nameserver 127.0.0.1" > /etc/resolver/local
sudo brew services restart dnsmasq
```

# Gotchas

`make serve` will:

-   run the node project on HTTP
-   run the Caddy proxy on HTTPS
-   run the Docker Network

And then you can

-   Frontend: https://furniture.superfast.local
-   Mailcatcher - Web: http://localhost:3022
-   Mailcatcher SMTP: http://localhost:3021
-   Redis: tcp://localhost:3023

> you can stop non stopped services with `make stop`

> Note: to connect to Redis: `docker run --rm --net=host -it redis redis-cli -h 127.0.0.1 -p 3023`

Also

-   Frontend run in HTTP on 3018
-   Frontend Live Reload WebScoket run in HTTP on 3019
-   Caddy enables HTTPS on top of them all
