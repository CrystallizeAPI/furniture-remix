import HamburgerIcon from '~/assets/hamburgerIcon.svg';
import UserIcon from '~/assets/userIcon.svg';
import { Link, useLocation } from '@remix-run/react';
import { useSuperFast } from 'src/lib/superfast/SuperFastProvider/Provider';
import { SearchBar } from './search';
import { BasketButton } from './basket-button';

export const Header: React.FC<{ navigation: any }> = ({ navigation }) => {
    const { state: superFast } = useSuperFast();
    let paths = ['/cart', '/checkout', '/confirmation'];
    let location = useLocation();
    return (
        <>
            {paths.includes(location.pathname) ? (
                <div className="flex gap-20 flex-auto items-center justify-between mb-5 w-full">
                    <div className="flex flex-auto justify-between items-center w-1/4">
                        <Link to="/">
                            <img src={superFast.config.logo} style={{ width: '200px' }} />
                        </Link>
                    </div>
                    <div className="flex w-3/4 gap-5">
                        <div
                            className={`w-1/4 border-b-2 pb-2 ${
                                location.pathname === '/cart'
                                    ? 'border-b-[#000] text-[#000]'
                                    : 'border-b-grey5 text-grey5'
                            }`}
                        >
                            <Link to="/cart">Cart</Link>
                        </div>
                        <div
                            className={`w-1/4 border-b-2 pb-2 ${
                                location.pathname === '/checkout'
                                    ? 'border-b-[#000] text-[#000]'
                                    : 'border-b-grey5 text-grey5'
                            }`}
                        >
                            Checkout
                        </div>
                        <div
                            className={`w-1/4 border-b-2 pb-2 ${
                                location.pathname === '/checkout'
                                    ? 'border-b-[#000] text-[#000]'
                                    : 'border-b-grey5 text-grey5'
                            }`}
                        >
                            Details
                        </div>
                        <div
                            className={`w-1/4 border-b-2 pb-2 ${
                                location.pathname === '/confirmation'
                                    ? 'border-b-[#000] text-[#000]'
                                    : 'border-b-grey5 text-grey5'
                            }`}
                        >
                            Confirmation
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-auto items-center justify-between mb-5 w-full">
                    <div className="flex flex-auto justify-between items-center">
                        {/* <img src={`${HamburgerIcon}`} /> */}
                        <Link to="/">
                            <img src={superFast.config.logo} style={{ width: '200px' }} />
                        </Link>
                        <SearchBar />
                        <p>
                            <Link to="/shop/plants">{navigation.tree.name}</Link>
                        </p>
                        <p>
                            <Link to="/stories">Stories</Link>
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
