import {useFirebaseContext} from "../context/FirebaseContext";
import {UserProfile} from "../types/types";

function Profile({profile}: {profile: UserProfile}) {
    const {changeUserProfile} = useFirebaseContext();
    return (
        <div className="flex flex-col gap-2 justify-center items-center">
            <div
                onClick={e => {
                    e.stopPropagation();
                    changeUserProfile(profile.name);
                }}
                className={`w-[10rem] h-[10rem] border border-white justify-center items-center flex rounded-md flex-col hover:scale-105 active:scale-110 transition cursor-pointer ${profile.profileColor}`}
            >
                <i className="fa-solid fa-user fa-2xl"></i>
            </div>
            <p className="text-xl font-semibold text-zinc-400">{profile.name}</p>
        </div>
    );
}

export default Profile;
