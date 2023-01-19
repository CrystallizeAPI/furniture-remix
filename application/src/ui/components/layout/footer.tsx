'use client';
import { ContentTransformer, Image } from '@crystallize/reactjs-components';
import CrystallizeLogo from '~/assets/crystallizeLogo.svg';
import { TenantLogo } from '../../lib/tenant-logo';
import { useAppContext } from '../../app-context/provider';
import { Footer as FooterType } from '~/use-cases/contracts/Footer';

export const Footer: React.FC<{
    footer: FooterType;
}> = ({ footer }) => {
    const { state: appContextState } = useAppContext();

    return (
        <footer className="2xl w-full mx-auto">
            <div className="mt-60">
                <div className="px-6">
                    <div className="grid sm:grid-cols-3 grid-cols-1 gap-3">
                        <div className="flex flex-col gap-4">
                            <div className="max-h-[80px] h-[30px] max-w-[100%] img-container">
                                <TenantLogo
                                    logo={appContextState.logo}
                                    identifier={appContextState.crystallize.tenantIdentifier}
                                />
                            </div>
                            <div>
                                <ContentTransformer json={footer.contact.json} />
                            </div>
                            {footer.socialLinks && (
                                <div className="flex gap-2 items-center">
                                    {footer.socialLinks.map((socialLink, index) => (
                                        <a
                                            key={socialLink.link + index}
                                            href={socialLink.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Image
                                                {...socialLink.logo?.[0]}
                                                sizes="100px"
                                                fallbackAlt={socialLink.link}
                                                width={23}
                                                height={23}
                                            />
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="footer-links">
                            <ContentTransformer json={footer.links.json} />
                        </div>
                    </div>

                    <div className="mx-auto flex items-center mt-20 mb-5 border-t border-grey pt-3 justify-between items-center">
                        <div className="flex items-center">
                            <img src={`${CrystallizeLogo}`} alt="Crystallize logo" width="38" height="31" />
                            <p>
                                Powered by{' '}
                                <a href="https://crystallize.com" className="underline">
                                    Crystallize
                                </a>
                            </p>
                        </div>
                        <p>{footer.copyright}</p>
                    </div>
                </div>
                {footer.promotions.cards.length > 0 && (
                    <div className="bg-footerBg p-5">
                        <p className="text-2xl text-center text-white max-w-[50%] mx-auto my-10">
                            {footer.promotions.heading}
                        </p>
                        <div className="flex flex-wrap md:justify-between mt-5 gap-3 justify-center mb-10">
                            {footer.promotions.cards.map((promotion, index) => (
                                <div key={promotion.title + index} className="flex border-white border flex-col p-5">
                                    <div className="w-[40px] h-[40px] img-container overflow-hidden border-white border rounded-full p-1">
                                        <Image {...promotion.image?.[0]} sizes="100vw" fallbackAlt={promotion.title} />
                                    </div>
                                    <div className="flex justify-between mt-5 items-end">
                                        <p className="text-lg text-[#fff] max-w-[80%]">{promotion.title}</p>
                                        <a href={promotion.link} className="text-white" title={promotion.title}>
                                            →
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </footer>
    );
};
