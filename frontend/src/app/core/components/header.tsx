import UserIcon from '~/assets/userIcon.svg';
import { Link, useLocation } from '@remix-run/react';
import { SearchBar } from './search';
import { BasketButton } from './basket-button';
import { TopicNavigation } from './topic-navigation';
import { useStoreFront } from '../storefront/provider';

export const Header: React.FC<{ navigation: any }> = ({ navigation }) => {
    const { state: storeFrontState } = useStoreFront();
    let checkoutFlow = ['/cart', '/checkout', '/confirmation'];
    let location = useLocation();
    let paths = [
        { path: '/cart', name: 'Cart' },
        { path: '/checkout', name: 'Checkout' },
        { path: '/confirmation', name: 'Confirmation' },
    ];

    return (
        <>
            {checkoutFlow.includes(location.pathname) ? (
                <div className="flex gap-20 flex-auto items-center justify-between mb-5 w-full">
                    <div className="flex flex-auto justify-between items-center w-1/4">
                        <Link to="/" prefetch="intent">
                            <img src={storeFrontState.config.logo} width="150" height="30" />
                        </Link>
                    </div>
                    <div className="flex w-3/4 gap-5">
                        {paths.map((path) => (
                            <div
                                key={path.path}
                                className={`w-1/4 border-b-2 pb-2 ${
                                    location.pathname === path.path
                                        ? 'border-b-[#000] text-[#000]'
                                        : 'border-b-grey5 text-grey5'
                                }`}
                            >
                                <Link to={path.path} prefetch="intent">
                                    {path.name}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex flex-auto items-center justify-between mb-5 w-full">
                    <div className="flex flex-auto justify-between items-center">
                        <div className="flex gap-10 items-center">
                            <Link to="/" prefetch="intent">
                                <img src={storeFrontState.config.logo} width="150" height="30" alt="Logo" />
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
                        <Link to="/" prefetch="intent" className="p-2 rounded-md hover:bg-[#efefef]">
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
            )}
        </>
    );
};
