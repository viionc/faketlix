import {useFirebaseContext} from "../../context/FirebaseContext";
import {useModalContext} from "../../context/ModalContext";
import {UserProfile} from "../../types/types";
import ProfileIcon from "../ProfileIcon";

function ProfileSettingsModal() {
    const {closeModal, openModal, modalState} = useModalContext();
    const {account, logoutUser, changeUserProfile, currentProfile} = useFirebaseContext();
    return (
        <div
            onMouseEnter={() => openModal("isProfileSettingsModalOpen")}
            onMouseLeave={() => closeModal("isProfileSettingsModalOpen")}
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
            {modalState.isProfileSettingsModalOpen && (
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
                    <span onClick={logoutUser} className="border-t border-[#272727] p-4 flex justify-center hover:underline text-zinc-400">
                        Sign out from Faketflix
                    </span>
                </div>
            )}
        </div>
    );
}

export default ProfileSettingsModal;
