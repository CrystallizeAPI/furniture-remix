import { useLocalStorage, writeStorage } from '@rehooks/local-storage';
import { useLocation, useNavigate, useSearchParams } from '@remix-run/react';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { useEffect } from 'react';
export function useAuth() {
    const [token] = useLocalStorage<string>('jwt', '');
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Note that we are on the frontend here, and this token is just here to hold some non sensitive data.
        // Service API has a Cookie (http only and Safari only) that is used to hold a really token.
        if (searchParams.has('token')) {
            const urlToken = searchParams.get('token') as string;
            searchParams.delete('token');
            try {
                const decoded = jwtDecode<JwtPayload>(urlToken);
                if (decoded) {
                    if (decoded.sub === 'isSupposedToBeLoggedInOnServiceApi') {
                        writeStorage('jwt', urlToken);
                    }
                }
            } catch (exception) {
                console.log(exception);
            }
            navigate(location.pathname, { replace: true });
        }
    });

    let userInfos: any = {};
    let isAuthenticated = false;
    try {
        const decoded = jwtDecode<any>(token);
        if (decoded && decoded.exp > Date.now() / 1000) {
            isAuthenticated = true;
            userInfos = {
                email: decoded.email,
                firstname: decoded.firstname,
                lastname: decoded.lastname,
            };
        }
    } catch (exception) {}
    return {
        login: (jwt: string) => {
            writeStorage('jwt', jwt);
        },
        logout: () => {
            writeStorage('jwt', '');
        },
        isAuthenticated,
        userInfos,
    };
}
