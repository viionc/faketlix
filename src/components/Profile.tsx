import {useFirebaseContext} from "../context/FirebaseContext";
import {UserProfile} from "../types/types";

function Profile({profile}: {profile: UserProfile}) {
    const {changeUserProfile} = useFirebaseContext();
    return (
        <div
            onClick={() => changeUserProfile(profile.name)}
            className="w-[10rem] h-[10rem] border border-white bg-zinc-800 justify-center items-center flex rounded-md"
        >
            {profile.name}
        </div>
    );
}

export default Profile;
