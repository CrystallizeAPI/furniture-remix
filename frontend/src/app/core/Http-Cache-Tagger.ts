import parse from 'parse-duration';

export type HttpCacheHeaders = {
    headers: {
        'Cache-Control': string;
    }
};

export type VarnishHttpCacheHeaders = Required<HttpCacheHeaders> & {
    headers: {
        'xkey': string;
    }
}

export type FastlyHttpCacheHeaders = Required<HttpCacheHeaders> & {
    headers: {
        'Surrogate-Key': string; // Fastly cache key
        'Surrogate-Control': string; // Fastly cache control
    }
}

export function HttpCacheHeaderTaggerFromLoader(loader: Headers): HttpCacheHeaders | VarnishHttpCacheHeaders | FastlyHttpCacheHeaders {

    if (process.env.HTTP_CACHE_SERVICE === 'fastly') {
        return {
            headers: {
                'Cache-Control': loader.get('Cache-Control') as string,
                'Surrogate-Control': loader.get('Surrogate-Control') as string,
                'Surrogate-Key': loader.get('Surrogate-Control') as string
            }
        }
    }

    if (process.env.HTTP_CACHE_SERVICE === 'varnish') {
        return {
            headers: {
                'Cache-Control': loader.get('Cache-Control') as string,
                'xkey': loader.get('xkey') as string
            }
        }
    }
    return {
        headers: {
            'Cache-Control': loader.get('Cache-Control') as string
        }
    }
}

/**
 * Return HTTP Cache headers
 */
export function HttpCacheHeaderTagger(maxAge: string, sharedMaxAge: string, tags: string[]): HttpCacheHeaders | VarnishHttpCacheHeaders | FastlyHttpCacheHeaders {

    const clean = (tag: string) => {
        let w = tag.replace(/\//g, '-');
        if (w[0] === '-') {
            w = w.substring(1);
        }
        return w;
    }


    if (process.env.HTTP_CACHE_SERVICE === 'fastly') {

        // We tell Fastly to cache the response for sharedMaxAge (max-age in Surrogate-Control which has precedence over Cache-Control s-max-age)
        // We tell Fastly to serve a stale only 2 time the sharedMaxAge
        // We tell Fastly to serve a stale for sharedMaxAge if the origin is not available
        // and we tell the browser to cache the response for maxAge
        // and we tell the browser serve a stale only 2 time the maxAge
        return {
            headers: {
                'Cache-Control': `public, max-age=${parse(maxAge, 's')}, s-maxage=${parse(sharedMaxAge, 's')}, stale-while-revalidate=${parse(maxAge, 's')}, stale-if-error=${parse(sharedMaxAge, 's')}`,
                'Surrogate-Control': `max-age=${parse(sharedMaxAge, 's')}, stale-while-revalidate=${parse(sharedMaxAge, 's')}`,
                'Surrogate-Key': 'all ' + tags.map(clean).join(' ')
            }
        }
    }

    if (process.env.HTTP_CACHE_SERVICE === 'varnish') {
        // We tell Vanish to cache the response for sharedMaxAge
        // We tell Vanish to serve a stale only 2 time the maxAge
        // and we tell the browser to cache the response for maxAge
        // and we tell the browser serve a stale only 2 time the maxAge (same header used for Varnish)
        return {
            headers: {
                'Cache-Control': `public, max-age=${parse(maxAge, 's')}, s-maxage=${parse(sharedMaxAge, 's')}, stale-while-revalidate=${parse(maxAge, 's')}`,
                'xkey': 'all ' + tags.map(clean).join(' '),
            }
        }
    }

    return {
        headers: {
            'Cache-Control': `public, max-age=${parse(maxAge, 's')}, s-maxage=${parse(sharedMaxAge, 's')}, stale-while-revalidate=${parse(maxAge, 's')}`,
        }
    }
}
