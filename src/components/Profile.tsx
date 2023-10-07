import {useFirebaseContext} from "../context/FirebaseContext";
import {UserProfile} from "../types/types";

function Profile({profile}: {profile: UserProfile}) {
    const {changeUserProfile} = useFirebaseContext();
    return (
        <div
            onClick={e => {
                e.stopPropagation();
                changeUserProfile(profile.name);
            }}
            className="w-[10rem] h-[10rem] border border-white bg-blue-400 justify-center items-center flex rounded-md flex-col gap-8 hover:scale-105 active:scale-110 transition cursor-pointer"
        >
            <i className="fa-solid fa-user fa-2xl pt-11"></i>
            {profile.name}
        </div>
    );
}

export default Profile;
