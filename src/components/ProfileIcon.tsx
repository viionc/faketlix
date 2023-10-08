import {UserProfile} from "../types/types";

function ProfileIcon({profile}: {profile: UserProfile}) {
    return (
        <div
            className={`w-[2rem] h-[2rem] justify-center items-center flex rounded-md flex-col hover:scale-105 active:scale-110 transition cursor-pointer ${profile.profileColor} `}
        >
            <i className="fa-solid fa-user fa-sm"></i>
        </div>
    );
}

export default ProfileIcon;
