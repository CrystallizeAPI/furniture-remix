import { useEffect, useState, ReactElement } from "react";
let hydrating = true;
export function useHydrated() {
    let [hydrated, setHydrated] = useState(() => !hydrating);

    useEffect(() => {
        hydrating = false;
        setHydrated(true);
    }, []);

    return hydrated;
}
export const ClientOnly: React.FC<{ children: ReactElement<any, any>, fallback?: ReactElement<any, any> }> = ({ children, fallback = null }) => {
    const hydrated = useHydrated();
    if (hydrated) {
        return children;
    }
    return fallback;
}
