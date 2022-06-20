import UserIcon from '~/assets/userIcon.svg';
import { Link, useLocation } from '@remix-run/react';
import { SearchBar } from './search';
import { BasketButton } from './basket-button';
import { TopicNavigation } from './topic-navigation';
import { useStoreFront } from '../storefront/provider';
import { useEffect, useState } from 'react';
import CloseIcon from '~/assets/closeIcon.svg';

export const Header: React.FC<{ navigation: any }> = ({ navigation }) => {
    const { state: storeFrontState } = useStoreFront();
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

    return (
        <>
            <div className="lg:block hidden">
                {checkoutFlow.includes(location.pathname) ? (
                    <div className="flex gap-20 flex-auto items-center justify-between mb-5 w-full">
                        <div className="flex flex-auto justify-between items-center w-1/4">
                            <Link to="/" prefetch="intent">
                                <div className="max-h-[80px] h-[30px] max-w-[100%] img-container">
                                    <img
                                        src={storeFrontState.config.logo}
                                        width="150"
                                        height="30"
                                        alt={storeFrontState.config.identifier + ` logo`}
                                        style={{
                                            width: 'auto',
                                            height: '100%',
                                        }}
                                        loading="eager"
                                    />
                                </div>
                            </Link>
                        </div>
                        <div className="flex w-3/4 gap-5 justify-end">
                            {paths.map((path) => (
                                <div
                                    key={path.path}
                                    className={`w-1/4 border-b-4 pb-2 ${
                                        location.pathname === path.path
                                            ? 'border-b-[#000] text-[#000]'
                                            : 'border-b-grey5 text-grey5'
                                    }`}
                                >
                                    <Link to={path.path} prefetch="intent" className="text-sm font-medium">
                                        {path.name}
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="justify-between-full fixed z-40 bg-[#fff] w-full left-0 top-0">
                        <div className="flex flex-auto items-center mx-auto px-6 xl:container  pt-3 pb-2">
                            <div className="flex mx-auto flex-auto justify-between items-center">
                                <div className="flex gap-10 items-center">
                                    <Link to="/" prefetch="intent">
                                        <div className="max-h-[80px] h-[30px] max-w-[100%] img-container">
                                            <img
                                                src={storeFrontState.config.logo}
                                                width="150"
                                                height="30"
                                                alt={storeFrontState.config.identifier + ` logo`}
                                                style={{
                                                    width: 'auto',
                                                    height: '100%',
                                                }}
                                                loading="eager"
                                            />
                                        </div>
                                    </Link>
                                    <div className="flex gap-10 items-center">
                                        <SearchBar />
                                        {navigation?.folders?.tree?.children
                                            .filter((item: any) => {
                                                return (
                                                    item.__typename === 'Folder' &&
                                                    item.children?.length > 0 &&
                                                    !item.name.startsWith('_')
                                                );
                                            })
                                            .map((item: any) => {
                                                return (
                                                    <Link
                                                        to={item.path}
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
                            <div className="flex flex-auto items-center justify-end ">
                                <Link to="/orders" className="p-2 rounded-md hover:bg-[#efefef]">
                                    <img
                                        className="w-[30px] h-[30px]"
                                        src={`${UserIcon}`}
                                        width="25"
                                        height="25"
                                        alt="User icon"
                                    />
                                </Link>
                                <BasketButton />
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="flex items-center justify-between lg:hidden relative p-4">
                <Link to="/" prefetch="intent">
                    <img src={storeFrontState.config.logo} width="150" height="30" loading="eager" />
                </Link>
                <div className="flex items-center gap-5 justify-start">
                    <Link to="/orders" className="rounded-md hover:bg-[#efefef]">
                        <img className="w-[30px] h-[30px]" src={`${UserIcon}`} width="25" height="25" alt="User icon" />
                    </Link>
                    <BasketButton />
                    <div className="z-50" onClick={() => setIsOpen(!isOpen)}>
                        <div className="h-1 w-8 bg-textBlack"></div>
                        <div className="h-1 w-8 bg-textBlack mt-2"></div>
                        <div className="h-1 w-8 bg-textBlack mt-2"></div>
                    </div>
                </div>
                {isOpen ? (
                    <div className="z-50 h-screen bg-[#fff] absolute top-0 left-0 right-0 bottom-0 flex flex-col">
                        <img
                            src={CloseIcon}
                            width="30"
                            height="30"
                            alt="Close icon"
                            className="self-end m-4"
                            onClick={() => setIsOpen(false)}
                        />
                        <div className="flex flex-col items-center gap-4 pt-10">
                            <div className="mb-[20px]">
                                <SearchBar />
                            </div>
                            {navigation?.folders?.tree?.children
                                .filter((item: any) => {
                                    return (
                                        item.__typename === 'Folder' &&
                                        item.children?.length > 0 &&
                                        !item.name.startsWith('_')
                                    );
                                })
                                .map((item: any) => {
                                    return (
                                        <Link
                                            to={item.path}
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
                ) : null}
            </div>
        </>
    );
};
