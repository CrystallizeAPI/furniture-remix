import HamburgerIcon from '~/assets/hamburgerIcon.svg';
import Logo from '~/assets/logo.svg';
import SearchIcon from '~/assets/searchIcon.svg';
import UserIcon from '~/assets/userIcon.svg';
import BasketIcon from '~/assets/basketIcon.svg';
import { Link } from '@remix-run/react';
import { Routes, Route, useLocation } from 'react-router-dom';

interface Props {
    navItem: String;
}

export const Header: React.FC<Props> = ({ navItem }) => {
    let paths = ['/cart', '/checkout', '/confirmation'];
    let location = useLocation();

    return (
        <>
            {paths.includes(location.pathname) ? (
                <div className="flex gap-20 flex-auto items-center justify-between mb-5 w-full">
                    <div className="flex flex-auto justify-between items-center w-1/4">
                        <img src={`${HamburgerIcon}`} />
                        <Link to="/">
                            <img src={`${Logo}`} />
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
                        <img src={`${HamburgerIcon}`} />
                        <Link to="/">
                            <img src={`${Logo}`} />
                        </Link>
                        <div className="bg-grey w-60 p-2">
                            <img src={`${SearchIcon}`} />
                        </div>
                        <p>
                            <Link to="/shop/plants">{navItem}</Link>
                        </p>
                        <p>
                            <Link to="/stories">Stories</Link>
                        </p>
                    </div>
                    <div className="flex flex-auto items-center justify-end gap-5">
                        <img src={`${UserIcon}`} />
                        <Link to="/cart">
                            <img src={`${BasketIcon}`} />
                        </Link>
                    </div>
                </div>
            )}
        </>
    );
};
