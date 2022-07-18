import UserIcon from '~/assets/userIcon.svg';
import { Link, useLocation } from '@remix-run/react';
import { SearchBar } from './search';
import { BasketButton } from './basket-button';
import { TopicNavigation } from './topic-navigation';
import { useStoreFront } from '../storefront/provider';
import { useEffect, useState } from 'react';
import CloseIcon from '~/assets/closeIcon.svg';
import { useAppContext } from '../app-context/provider';
import { Image } from '@crystallize/reactjs-components';

export const Header: React.FC<{ navigation: any }> = ({ navigation }) => {
    const { state: storeFrontState } = useStoreFront();
    const { state: appContextState, dispatch: appContextDispatch } = useAppContext();
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
        <>
            {appContextState.latestAddedCartItems.length > 0 && (
                <div className="border-[#dfdfdf] border rounded-md shadow fixed max-w-full sm:top-2 sm:right-2 bg-[#fff]  z-[60]  p-6">
                    <p className="font-bold text-md mb-3 pb-2">
                        Added {appContextState.latestAddedCartItems.length} product to cart
                    </p>
                    {appContextState.latestAddedCartItems.map((item: any, index: number) => (
                        <div className="flex p-3 mt-1 items-center bg-grey2 gap-3" key={index}>
                            <div className="max-w-[35px] max-h-[50px] img-container img-contain">
                                <Image {...item.images?.[0]} size="100px" />
                            </div>
                            <div>
                                <p className="text-sm">{item.name}</p>
                                <p className="text-sm font-bold">
                                    {appContextState.currency.code} {item.price}
                                </p>
                            </div>
                        </div>
                    ))}
                    <div className="flex gap-3 mt-3 items-center border-t pt-2 border-t-[#dfdfdf]">
                        <button className="bg-grey text-sm text-[#000] font-bold py-2 px-4 rounded-md">
                            <Link to={'/cart'}>Go to cart</Link>
                        </button>
                    </div>
                </div>
            )}
            <div className="lg:block hidden">
                {checkoutFlow.includes(location.pathname) ? (
                    <div className="flex container px-4 mx-auto gap-20 flex-auto items-center justify-between mb-5 w-full">
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
            <div className="flex items-center justify-between lg:hidden relative p-5">
                <div className="flex flex-auto justify-between items-center w-1/4">
                    <Link to="/" prefetch="intent">
                        <div className="max-h-[80px] h-[50px] max-w-[180px]  img-container img-contain">
                            <img
                                src={storeFrontState.config.logo}
                                width="150"
                                height="30"
                                alt={storeFrontState.config.identifier + ` logo`}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                }}
                                loading="eager"
                            />
                        </div>
                    </Link>
                </div>
                <div className="flex items-center gap-3 justify-start">
                    <Link to="/orders" className="p-2 rounded-md hover:bg-[#efefef]">
                        <img className="w-[30px] h-[30px]" src={`${UserIcon}`} width="25" height="25" alt="User icon" />
                    </Link>
                    <BasketButton />
                    <div
                        className="z-50 p-[10px] w-[50px] h-[50px] relative items-center rounded-md cursor-pointer hover:bg-[#efefef] "
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <div className="burger" />
                        <div className="burger top" />
                        <div className="burger bottom" />
                    </div>
                </div>
                {isOpen ? (
                    <div className="z-50 h-screen bg-[#fff] fixed top-0 left-0 right-0 bottom-0 flex flex-col">
                        <div className="p-5 flex justify-between items-center">
                            <Link to="/" prefetch="intent">
                                <div className="max-h-[80px] h-[50px] max-w-[180px]  img-container img-contain">
                                    <img
                                        src={storeFrontState.config.logo}
                                        width="150"
                                        height="30"
                                        alt={storeFrontState.config.identifier + ` logo`}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                        }}
                                        loading="eager"
                                    />
                                </div>
                            </Link>
                            <img
                                src={CloseIcon}
                                width="30"
                                height="30"
                                alt="Close icon"
                                // className="self-end m-4"
                                onClick={() => setIsOpen(false)}
                            />
                        </div>

                        <div className="flex flex-col items-left gap-4 pt-2">
                            <div className="mb-[20px]">
                                <SearchBar />
                            </div>
                            <div className="flex flex-col px-6">
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
                                                className="text-xl block py-2 hover:underline"
                                            >
                                                {item.name}
                                            </Link>
                                        );
                                    })}
                                <TopicNavigation navigation={navigation.topics} />
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </>
    );
};
