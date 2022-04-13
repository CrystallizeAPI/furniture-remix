import { HeadersFunction } from "@remix-run/node";
import { HttpCacheHeaderTagger } from "~/core/Http-Cache-Tagger";

export const headers: HeadersFunction = () => {
    return HttpCacheHeaderTagger("1m", "1w", ["home"]).headers;
}

export default function HomePage() {
    return (
        <div>
            <h1>HOME PAGE</h1>
        </div>
    );
}
