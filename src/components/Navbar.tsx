import ProfileSettingsModal from "./modals/ProfileMenu";

function Navbar() {
    return (
        <nav className="w-full h-[3.5rem] flex px-16 py-4 bg-[#141414] justify-between fixed top-0 left-0 z-20">
            <div className="flex gap-8">
                <img src="/faketflix-logo.png" alt="" width={100}></img>
                <ul className="flex gap-4 text-md">
                    <li className="hover:text-zinc-400 transition cursor-pointer">Home</li>
                    <li className="hover:text-zinc-400 transition cursor-pointer">Tv Shows</li>
                    <li className="hover:text-zinc-400 transition cursor-pointer">Movies</li>
                    <li className="hover:text-zinc-400 transition cursor-pointer">New & Popular</li>
                    <li className="hover:text-zinc-400 transition cursor-pointer">My List</li>
                </ul>
            </div>
            <div className="flex gap-6 items-center">
                <i className="fa-solid fa-magnifying-glass fa-lg"></i>
                <i className="fa-regular fa-bell fa-lg"></i>
                <ProfileSettingsModal></ProfileSettingsModal>
            </div>
        </nav>
    );
}

export default Navbar;
