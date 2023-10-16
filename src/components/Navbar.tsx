import {useEffect, useState} from "react";
import ProfileMenu from "./pages/profile/ProfileMenu";
import {motion} from "framer-motion";
import clsx from "clsx";
import {Link} from "react-router-dom";
import Burger from "./buttons/Burger";
import SearchBar from "./buttons/SearchBar";

function Navbar() {
    const [opacity, setOpacity] = useState(0);
    const [show, setShow] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY < 100) {
                setOpacity(0);
            } else if (window.scrollY > 600) {
                setOpacity(100);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [opacity]);

    const handleNavbarClick = () => {
        setShow(!show);
    };

    return (
        <motion.nav
            className={clsx(
                `w-full h-[3.5rem] px-2 flex lg:px-16 py-4 justify-between fixed top-0 left-0 z-[10000] transition-all ease-in-out bg-black duration-500`,
                opacity ? "bg-opacity-100" : "bg-opacity-0"
            )}
        >
            <div className="flex gap-8 relative" onClick={handleNavbarClick}>
                <img src="/faketflix-logo.png" alt="" width={100} height={20} className="object-fit"></img>
                <div className={clsx(`absolute top-0 left-0 w-[100vw] h-[100vh]`, show ? "visible" : "invisible")} onClick={handleNavbarClick}></div>
                <ul className="hidden md:flex gap-4 text-md">
                    <li className="hover:text-zinc-400 transition cursor-pointer">
                        <Link to="/movies">Movies</Link>
                    </li>
                    <li className="hover:text-zinc-400 transition cursor-pointer">
                        <Link to="/tv">TV Shows</Link>
                    </li>
                    {/* <li className="hover:text-zinc-400 transition cursor-pointer">
                        <Link to="/new">New & Popular</Link>
                    </li> */}
                    <li className="hover:text-zinc-400 transition cursor-pointer">
                        <Link to="/mylist">My List</Link>
                    </li>
                </ul>
                <ul
                    className={clsx(
                        `flex flex-col md:hidden absolute top-[-20px]  p-12 h-[101vh] w-[18rem] bg-[#202020] text-4xl gap-24 transition-all ease-in-out z-[1]`,
                        show ? "left-[-20px]" : "left-[-330px]"
                    )}
                    onClick={e => e.stopPropagation()}
                >
                    <li className="hover:text-zinc-400 transition cursor-pointer">
                        <Link to="/movies">Movies</Link>
                    </li>
                    <li className="hover:text-zinc-400 transition cursor-pointer">
                        <Link to="/tv">TV Shows</Link>
                    </li>
                    {/* <li className="hover:text-zinc-400 transition cursor-pointer">
                        <Link to="/new">New & Popular</Link>
                    </li> */}
                    <li className="hover:text-zinc-400 transition cursor-pointer">
                        <Link to="/mylist">My List</Link>
                    </li>
                </ul>
            </div>
            <div className="flex gap-6 items-center">
                <Burger callback={handleNavbarClick}></Burger>
                <SearchBar></SearchBar>
                <i className="fa-regular fa-bell fa-lg"></i>
                <ProfileMenu></ProfileMenu>
            </div>
        </motion.nav>
    );
}

export default Navbar;
