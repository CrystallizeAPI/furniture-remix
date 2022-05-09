import HamburgerIcon from "~/assets/hamburgerIcon.svg";
import Logo from "~/assets/logo.svg";
import SearchIcon from "~/assets/searchIcon.svg";
import UserIcon from "~/assets/userIcon.svg";
import BasketIcon from "~/assets/basketIcon.svg";
import { Link } from "@remix-run/react";

export const Header: React.FC<{ navigation: any }> = ({ navigation }) => {
    return (
        <div className="flex flex-auto items-center justify-between mb-5 w-full">
            <div className="flex flex-auto justify-between items-center">
                <img src={`${HamburgerIcon}`} />
                <Link to="/"><img src={`${Logo}`} /></Link>
                <div className="bg-grey w-60 p-2">
                    <img src={`${SearchIcon}`} />
                </div>
                {navigation.tree.children.map((child: any) => (
                    <p key={child.path}><Link to={child.path}>{child.name}</Link></p>
                ))}
            </div>
            <div className="flex flex-auto items-center justify-end gap-5">
                <img src={`${UserIcon}`} />
                <Link to="/cart"><img src={`${BasketIcon}`} /></Link>
            </div>
        </div>
    );
};
