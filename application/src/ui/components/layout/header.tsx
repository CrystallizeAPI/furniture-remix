'use client';
import UserIcon from '~/assets/userIcon.svg';
import Link from '~/bridge/ui/Link';
import { SearchBar } from '../search/search-bar';
import { BasketButton } from './basket-button';
import { TopicNavigation } from './topic-navigation';
import { useEffect, useState } from 'react';
import { useAppContext } from '../../app-context/provider';
import { Image } from '@crystallize/reactjs-components';
import { Price } from '../price';
import { LanguageSwitcher } from './language-switcher';
import { Tree } from '../../../use-cases/contracts/Tree';
import { TenantLogo } from '../../lib/tenant-logo';
import useLocation from '~/bridge/ui/useLocation';

export const Header: React.FC<{
    navigation: {
        folders: Tree[];
        topics: Tree[];
    };
}> = ({ navigation }) => {
    const { state: appContextState, dispatch: appContextDispatch, path } = useAppContext();
    let checkoutFlow = ['/cart', '/checkout', '/confirmation'];
    let [isOpen, setIsOpen] = useState(false);
    let location = useLocation();
    let paths = [
        { path: '/cart', name: 'Cart' },
        { path: '/checkout', name: 'Checkout' },
        { path: '/confirmation', name: 'Confirmation' },
    ];

    useEffect(() => {
        setIsOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        if (appContextState.latestAddedCartItems.length === 0) {
            return;
        }
        let timeout: ReturnType<typeof setTimeout>;
        setTimeout(() => {
            appContextDispatch.resetLastAddedItems();
        }, 3000);
        return () => clearTimeout(timeout);
    }, [appContextState.latestAddedCartItems]);

    return (
        <header className="2xl w-full mx-auto lg:p-8 lg:px-6">
            {appContextState.latestAddedCartItems.length > 0 && (
                <div className="border-[#dfdfdf] border rounded-md shadow fixed max-w-full sm:top-2 sm:right-2 bg-[#fff]  z-[60]  p-6">
                    <p className="font-bold text-md mb-3 pb-2">Added product(s) to cart</p>
                    {appContextState.latestAddedCartItems.map((item, index) => {
                        return (
                            <div className="flex p-3 mt-1 items-center bg-grey2 gap-3" key={index}>
                                <div className="max-w-[35px] max-h-[50px] img-container img-contain">
                                    <Image {...item.images?.[0]} sizes="100px" fallbackAlt={item.name} />
                                </div>
                                <div>
                                    <p className="text-sm">{item.name}</p>
                                    <div className="text-sm font-bold">
                                        <Price variant={item} size="small" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <div className="flex gap-3 mt-3 items-center border-t pt-2 border-t-[#dfdfdf]">
                        <button
                            data-testid="go-to-cart-button"
                            className="bg-grey text-sm text-[#000] font-bold py-2 px-4 rounded-md"
                        >
                            <Link to={path('/cart')}>Go to cart</Link>
                        </button>
                    </div>
                </div>
            )}
            <div className="lg:mb-5 mb-20">
                {checkoutFlow.includes(location.pathname) ? (
                    <nav className="flex container px-4 mx-auto gap-20 flex-auto items-center justify-between mb-5 w-full">
                        <div className="flex flex-auto justify-between items-center w-1/4">
                            <Link to={path('/')}>
                                <div className="max-h-[80px] h-[30px] max-w-[100%] img-container">
                                    <TenantLogo
                                        logo={appContextState.logo}
                                        identifier={appContextState.crystallize.tenantIdentifier}
                                    />
                                </div>
                            </Link>
                        </div>
                        <div className="flex w-3/4 gap-5 justify-end">
                            {paths.map((urlPath) => (
                                <div
                                    key={urlPath.path}
                                    className={`w-1/4 border-b-4 pb-2 ${
                                        location.pathname === urlPath.path
                                            ? 'border-b-[#000] text-[#000]'
                                            : 'border-b-grey5 text-grey5'
                                    }`}
                                >
                                    <Link to={path(urlPath.path)} prefetch="intent" className="text-sm font-medium">
                                        {urlPath.name}
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </nav>
                ) : (
                    <div className="justify-between-full fixed z-40 bg-[#fff] w-full left-0 top-0">
                        <div className="flex flex-auto items-center mx-auto px-6 xl:container pt-3 pb-2">
                            <div className="flex mx-auto flex-auto justify-between items-center relative">
                                <div className="flex gap-4 md:gap-10 items-center">
                                    <Link to={path('/')}>
                                        <div className="max-h-[80px] h-[30px] max-w-[100%] img-container">
                                            <TenantLogo
                                                logo={appContextState.logo}
                                                identifier={appContextState.crystallize.tenantIdentifier}
                                            />
                                        </div>
                                    </Link>
                                    <div
                                        className={`flex gap-10 lg:flex lg:items-center lg:flex-row flex-col lg:w-auto lg:h-auto lg:relative lg:px-0 lg:py-0 lg:mt-0 lg:top-0 ${
                                            isOpen ? 'block' : 'hidden'
                                        } top-10 mt-5 bg-[#fff] w-full right-0 left-0 z-50 h-screen fixed left-0 bottom-0 px-10 py-10`}
                                    >
                                        <SearchBar />
                                        {navigation.folders
                                            .filter((item) => {
                                                return (
                                                    item.type === 'folder' &&
                                                    item.children.length > 0 &&
                                                    !item.name.startsWith('_')
                                                );
                                            })
                                            .map((item: any) => {
                                                return (
                                                    <Link
                                                        to={path(item.path)}
                                                        prefetch="intent"
                                                        key={item.path}
                                                        className="hover:underline"
                                                    >
                                                        {item.name}
                                                    </Link>
                                                );
                                            })}
                                        <TopicNavigation navigation={navigation.topics} />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-auto items-center justify-end h-[40px] w-[100px]">
                                <Link to={path('/orders')} className="p-2 rounded-md hover:bg-[#efefef]">
                                    <img
                                        className="w-[30px] h-[30px]"
                                        src={`${UserIcon}`}
                                        width="25"
                                        height="25"
                                        alt="User icon"
                                    />
                                </Link>
                                <BasketButton />
                                <LanguageSwitcher />
                            </div>
                            <div className="z-50 p-[10px] h-[40px] text-center rounded-md cursor-pointer hover:bg-[#efefef] lg:hidden block">
                                <button
                                    onClick={() => setIsOpen(!isOpen)}
                                    type="button"
                                    className="focus:outline-none"
                                    aria-controls="mobile-menu"
                                    aria-label="Mobile Menu"
                                    title="Mobile Menu"
                                    aria-expanded="false"
                                >
                                    {!isOpen ? (
                                        <svg
                                            className="block h-6 w-6"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M4 6h16M4 12h16M4 18h16"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            className="block h-6 w-6"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};
