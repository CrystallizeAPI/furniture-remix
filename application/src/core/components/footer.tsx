import { ContentTransformer, Image } from '@crystallize/reactjs-components';
import CrystallizeLogo from '~/assets/crystallizeLogo.svg';
import { TenantLogo } from '~/lib/tenant-logo';
import { useAppContext } from '../app-context/provider';
import { Footer as FooterType } from '../contracts/Footer';

export const Footer: React.FC<{
    footer: FooterType;
}> = ({ footer }) => {
    const { state: appContextState } = useAppContext();

    return (
        <div className="mt-60">
            <div className="flex flex-col gap-4">
                <div className="max-h-[80px] h-[30px] max-w-[100%] img-container">
                    <TenantLogo logo={appContextState.logo} identifier={appContextState.crystallize.tenantIdentifier} />
                </div>
                <div>
                    <ContentTransformer json={footer.contact.json} />
                </div>
                <div className="flex gap-2 items-center">
                    {footer.socialLinks.map((socialLink) => (
                        <a key={socialLink.url} href={socialLink.url} target="_blank" rel="noopener noreferrer">
                            <Image {...socialLink.logo?.[0]} sizes="100px" />
                        </a>
                    ))}
                </div>
            </div>
            <div className="mx-auto flex items-center  mt-20">
                <img src={`${CrystallizeLogo}`} alt="Crystallize logo" width="38" height="31" />
                <p>
                    Powered by{' '}
                    <a href="https://crystallize.com" className="underline">
                        Crystallize
                    </a>
                </p>
            </div>
        </div>
    );
};
