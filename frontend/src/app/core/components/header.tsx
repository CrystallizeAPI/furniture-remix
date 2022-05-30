import HamburgerIcon from '~/assets/hamburgerIcon.svg';
import UserIcon from '~/assets/userIcon.svg';
import { Link, useLocation } from '@remix-run/react';
import { useSuperFast } from 'src/lib/superfast/SuperFastProvider/Provider';
import { SearchBar } from './search';
import { BasketButton } from './basket-button';
import { TopicNavigation } from './topic-navigation';

export const Header: React.FC<{ navigation: any }> = ({ navigation }) => {
    const { state: superFast } = useSuperFast();
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
                            <img src={superFast.config.logo} style={{ width: '200px' }} />
                        </Link>
                    </div>
                    <div className="flex w-3/4 gap-5">
                        {paths.map((path) => (
                            <div
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
                        <TopicNavigation />
                        <Link to="/" prefetch="intent">
                            <img src={superFast.config.logo} style={{ width: '200px' }} />
                        </Link>
                        <SearchBar />
                        <p className="hover:underline">
                            <Link to="/shop" prefetch="intent">
                                {navigation.tree.name}
                            </Link>
                        </p>
                        <p className="hover:underline">
                            <Link to="/stories" prefetch="intent">
                                Stories
                            </Link>
                        </p>
                    </div>
                    <div className="flex flex-auto items-center justify-end gap-5">
                        <img src={`${UserIcon}`} />
                        <BasketButton />
                    </div>
                </div>
            )}
        </>
    );
};
