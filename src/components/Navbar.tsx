import {useEffect, useState} from "react";
import ProfileMenu from "./pages/profile/ProfileMenu";
import {motion} from "framer-motion";
import clsx from "clsx";
import {Link} from "react-router-dom";

function Navbar() {
    const [opacity, setOpacity] = useState(0);

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

    return (
        <motion.nav
            className={clsx(
                `w-full h-[3.5rem] flex px-16 py-4 justify-between fixed top-0 left-0 z-20 transition-all ease-in-out bg-black duration-500`,
                opacity ? "bg-opacity-100" : "bg-opacity-0"
            )}
        >
            <div className="flex gap-8">
                <img src="/faketflix-logo.png" alt="" width={100}></img>
                <ul className="flex gap-4 text-md">
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
                <i className="fa-solid fa-magnifying-glass fa-lg"></i>
                <i className="fa-regular fa-bell fa-lg"></i>
                <ProfileMenu></ProfileMenu>
            </div>
        </motion.nav>
    );
}

export default Navbar;
