import {useState} from "react";
import {useFirebaseContext} from "../../../context/FirebaseContext";
import {UserProfile} from "../../../types/types";
import ProfileIcon from "./ProfileIcon";
import {useNavigate} from "react-router-dom";

function ProfileMenu() {
    const {account, logoutUser, changeUserProfile, currentProfile, setManageProfiles} = useFirebaseContext();
    const [openMenu, setOpenMenu] = useState(false);
    const navigate = useNavigate();
    return (
        <div
            onMouseEnter={() => setOpenMenu(true)}
            onMouseLeave={() => setOpenMenu(false)}
            className="relative flex gap-2 items-center group cursor-pointer"
        >
            <ProfileIcon profile={currentProfile as UserProfile}></ProfileIcon>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4 group-hover:rotate-180"
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
            {openMenu && (
                <div className="absolute w-[14rem] border border-[#272727] bg-black rounded-md top-[2rem] left-[-10rem] gap-2 flex flex-col pt-6 text-white text-md">
                    {account &&
                        account.profiles.map(profile => (
                            <div
                                key={profile.name}
                                className="flex items-center gap-2  hover:scale-105 transition px-6 hover:underline"
                                onClick={() => changeUserProfile(profile.name)}
                            >
                                <ProfileIcon profile={profile}></ProfileIcon>
                                <p>{profile.name}</p>
                            </div>
                        ))}
                    <span
                        onClick={() => {
                            navigate("/profiles");
                            setManageProfiles(true);
                        }}
                        className="p-4 flex justify-center hover:underline text-zinc-400"
                    >
                        Manage Profiles
                    </span>
                    <span onClick={logoutUser} className="border-t border-[#272727] p-4 flex justify-center hover:underline text-zinc-400">
                        Sign out from Faketflix
                    </span>
                </div>
            )}
        </div>
    );
}

export default ProfileMenu;
