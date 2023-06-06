import { Image } from '@crystallize/reactjs-components';

export function TenantLogo({ identifier, logo }: { identifier: string; logo: any }) {
    if (logo.key === 'superfast-originated-logo' && logo.length > 0) {
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
            key={logo.key}
            sizes="150px"
            alt={identifier + ` logo`}
            className="w-auto h-full"
            width={170}
            height={30}
            style={{
                width: 'auto',
                height: '100%',
            }}
            loading="eager"
        />
    );
}
