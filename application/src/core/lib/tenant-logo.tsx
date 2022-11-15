import { Image } from '@crystallize/reactjs-components';

export function TenantLogo({ identifier, logo }: { identifier: string; logo: any }) {
    if (logo.key === 'superfast-originated-logo') {
        return (
            <img
                src={logo.url}
                width="150"
                height="30"
                alt={identifier + ` logo`}
                style={{
                    width: 'auto',
                    height: '100%',
                }}
                loading="eager"
            />
        );
    }
    return (
        <Image
            {...logo}
            sizes="150px"
            alt={identifier + ` logo`}
            className="w-auto h-full"
            style={{
                width: 'auto',
                height: '100%',
            }}
            loading="eager"
        />
    );
}
