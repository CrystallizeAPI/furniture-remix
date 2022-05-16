import type { EntryContext } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { renderToString } from "react-dom/server";

export default function handleRequest(
    request: Request,
    responseStatusCode: number,
    responseHeaders: Headers,
    remixContext: EntryContext
) {
    let markup = renderToString(
        <RemixServer context={remixContext} url={request.url} />
    );
    responseHeaders.set("Content-Type", "text/html");

    let http2PushLinksHeaders = remixContext.matches.reduce(( acc:string[], { route: { module, imports } }) => {
        acc.push(module);
        if (imports) {
            acc.push(...imports);
        } 
        return acc;
    }, []);
    http2PushLinksHeaders.push(...[remixContext.manifest.url, remixContext.manifest.entry.module, ...remixContext.manifest.entry.imports])
    responseHeaders.set("Link", (responseHeaders.has("Link") ? responseHeaders.get("Link") + "," : '') + http2PushLinksHeaders.map((link: string) => `<${link}>; rel=preload; as=script`).join(","));

    return new Response("<!DOCTYPE html>" + markup, {
        status: responseStatusCode,
        headers: responseHeaders,
    });
}
