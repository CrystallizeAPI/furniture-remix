// From https://github.com/jkroso/parse-duration
const parse = (duration: string, format: string): number => {
    const durationRegexp = /(-?(?:\d+\.?\d*|\d*\.?\d+)(?:e[-+]?\d+)?)\s*([\p{L}]*)/giu;
    const ms = 1;
    const sec = 1000 * ms;
    const min = 60 * sec;
    const hour = 60 * min;
    const day = 24 * hour;
    const week = 7 * day;
    const month = (365.25 / 12) * day;
    const year = 365.25 * day;
    const ratios = {
        nanosecond: ms / 1e6,
        ns: ms / 1e6,
        µs: ms / 1e3,
        us: ms / 1e3,
        microsecond: ms / 1e3,
        millisecond: ms,
        ms: ms,
        second: sec,
        sec: sec,
        s: sec,
        minute: min,
        min: min,
        m: min,
        hour: hour,
        hr: hour,
        h: hour,
        day: day,
        d: day,
        week: week,
        wk: week,
        w: week,
        month: month,
        b: month,
        year: year,
        yr: year,
        y: year,
    };

    function unit(str: keyof typeof ratios): number | null {
        return ratios[str] || ratios[str.toLowerCase().replace(/s$/, '') as keyof typeof ratios] || null;
    }
    let result = 0.0;
    const str = duration
        .replace(/(\d)[,_](\d)/g, '$1$2')
        .replace(durationRegexp, (_, n: string, units: string): string => {
            const convertedUnits = unit(units as keyof typeof ratios);
            if (convertedUnits) {
                result = (result || 0) + parseFloat(n) * convertedUnits;
            }
            return '';
        });
    return result && result / (unit(format as keyof typeof ratios) || 1);
};

export type HttpCacheHeaders = {
    headers: {
        'Cache-Control': string;
    };
};

export type VarnishHttpCacheHeaders = Required<HttpCacheHeaders> & {
    headers: {
        xkey: string;
    };
};

export type FastlyHttpCacheHeaders = Required<HttpCacheHeaders> & {
    headers: {
        'Surrogate-Key': string; // Fastly cache key
        'Surrogate-Control': string; // Fastly cache control
    };
};

export function HttpCacheHeaderTaggerFromLoader(
    loader: Headers,
): HttpCacheHeaders | VarnishHttpCacheHeaders | FastlyHttpCacheHeaders {
    if (process.env.HTTP_CACHE_SERVICE === 'fastly') {
        return {
            headers: {
                'Cache-Control': loader.get('Cache-Control') as string,
                'Surrogate-Control': loader.get('Surrogate-Control') as string,
                'Surrogate-Key': loader.get('Surrogate-Key') as string,
            },
        };
    }

    if (process.env.HTTP_CACHE_SERVICE === 'varnish') {
        return {
            headers: {
                'Cache-Control': loader.get('Cache-Control') as string,
                xkey: loader.get('xkey') as string,
            },
        };
    }
    return {
        headers: {
            'Cache-Control': loader.get('Cache-Control') as string,
        },
    };
}

/**
 * Return HTTP Cache headers
 */
export function HttpCacheHeaderTagger(
    maxAge: string,
    sharedMaxAge: string,
    tags: string[],
): HttpCacheHeaders | VarnishHttpCacheHeaders | FastlyHttpCacheHeaders {
    const clean = (tag: string) => {
        let w = tag.replace(/\//g, '-');
        if (w[0] === '-') {
            w = w.substring(1);
        }
        return w;
    };

    if (process.env.HTTP_CACHE_SERVICE === 'fastly') {
        // We tell Fastly to cache the response for sharedMaxAge (max-age in Surrogate-Control which has precedence over Cache-Control s-max-age)
        // We tell Fastly to serve a stale only 2 time the sharedMaxAge
        // We tell Fastly to serve a stale for sharedMaxAge if the origin is not available
        // and we tell the browser to cache the response for maxAge
        // and we tell the browser serve a stale only 2 time the maxAge
        return {
            headers: {
                'Cache-Control': `public, max-age=${parse(maxAge, 's')}, s-maxage=${parse(
                    sharedMaxAge,
                    's',
                )}, stale-while-revalidate=${parse(maxAge, 's')}, stale-if-error=${parse(sharedMaxAge, 's')}`,
                'Surrogate-Control': `max-age=${parse(sharedMaxAge, 's')}, stale-while-revalidate=${parse(
                    sharedMaxAge,
                    's',
                )}`,
                'Surrogate-Key': 'all ' + tags.map(clean).join(' '),
            },
        };
    }

    if (process.env.HTTP_CACHE_SERVICE === 'varnish') {
        // We tell Vanish to cache the response for sharedMaxAge
        // We tell Vanish to serve a stale only 2 time the maxAge
        // and we tell the browser to cache the response for maxAge
        // and we tell the browser serve a stale only 2 time the maxAge (same header used for Varnish)
        return {
            headers: {
                'Cache-Control': `public, max-age=${parse(maxAge, 's')}, s-maxage=${parse(
                    sharedMaxAge,
                    's',
                )}, stale-while-revalidate=${parse(maxAge, 's')}`,
                xkey: 'all ' + tags.map(clean).join(' '),
            },
        };
    }

    return {
        headers: {
            'Cache-Control': `public, max-age=${parse(maxAge, 's')}, s-maxage=${parse(
                sharedMaxAge,
                's',
            )}, stale-while-revalidate=${parse(maxAge, 's')}`,
        },
    };
}

export function StoreFrontAwaretHttpCacheHeaderTagger(
    maxAge: string,
    sharedMaxAge: string,
    tags: string[],
    prefix: string = '',
): HttpCacheHeaders | VarnishHttpCacheHeaders | FastlyHttpCacheHeaders {
    return HttpCacheHeaderTagger(maxAge, sharedMaxAge, [...tags.map((tag: string) => `${prefix}-${tag}`), prefix]);
}
