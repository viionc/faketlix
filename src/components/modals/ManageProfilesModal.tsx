import {motion} from "framer-motion";
import {FormEvent, useEffect, useState} from "react";
import CloseModalButton from "../buttons/CloseModalButton";
import {useModalContext} from "../../context/ModalContext";
import {useFirebaseContext} from "../../context/FirebaseContext";
import {PROFILE_COLORS} from "../../types/constants";

function ManageProfilesModal() {
    const [profileName, setProfileName] = useState<string>("");
    const [profileColor, setProfileColor] = useState<string>("bg-blue-400");
    const [autoplay, setAutoplay] = useState<boolean>(false);

    const {account, updateProfile} = useFirebaseContext();
    const {closeModal, modalState} = useModalContext();

    const handleUpdateProfile = (e: FormEvent) => {
        e.preventDefault();
        if (!account || !modalState.profileCliked) return;
        if (profileName.length < 3 && profileName.length > 15) return;
        if (account.profiles.find(profile => profile.name === profileName && profileName !== modalState.profileCliked?.name)) return;
        updateProfile(modalState.profileCliked, profileName, profileColor, autoplay);
        closeModal("isManageProfilesModalOpen");
    };

    useEffect(() => {
        if (!modalState.profileCliked) return;
        setProfileName(modalState.profileCliked.name);
        setProfileColor(modalState.profileCliked.profileColor);
        setAutoplay(modalState.profileCliked.autoplay || true);
    }, [modalState.profileCliked]);

    return (
        <>
            <div
                className="w-full h-[100vh] bg-black bg-opacity-50 absolute top-0 left-0 z-10"
                onClick={() => closeModal("isManageProfilesModalOpen")}
            ></div>
            <motion.div
                initial={{transform: "translate(-50%, -50%) scale(0.8)"}}
                animate={{transform: "translate(-50%, -50%) scale(1)"}}
                className="w-[24rem] h-[24rem] bg-zinc-800 shadow-lg absolute top-1/2 left-1/2 rounded-lg z-10"
                onClick={e => e.stopPropagation()}
            >
                <div className="relative w-full h-full flex items-center flex-col justify-center py-16">
                    <CloseModalButton modal={"isManageProfilesModalOpen"}></CloseModalButton>
                    <form className="flex flex-col gap-6 mb-2 p-10" onSubmit={handleUpdateProfile}>
                        <label htmlFor="profile" className="text-2xl">
                            Profile name:
                        </label>
                        <input
                            className="py-2 px-1 rounded-md"
                            id="profile"
                            value={profileName}
                            onChange={e => setProfileName(e.target.value)}
                        ></input>
                        {profileName.length < 3 || profileName.length > 15 ? (
                            <p className="text-red-500 text-xs">Profile name has to have 3 to 15 characters.</p>
                        ) : null}
                        {account && account.profiles.find(profile => profile.name === profileName) && (
                            <p className="text-red-500 text-xs">Profile with that names already exists.</p>
                        )}
                        <div className="flex flex-col justify-center w-full items-center gap-2">
                            <div className="flex gap-2 flex-wrap w-full justify-center">
                                {PROFILE_COLORS.map(color => (
                                    <div
                                        key={color}
                                        onClick={() => setProfileColor(color)}
                                        className={`w-[2rem] h-[2rem] justify-center items-center rounded-md transition cursor-pointer flex ${color} ${
                                            profileColor === color ? "border border-white" : null
                                        }`}
                                    >
                                        <i className="fa-solid fa-user fa-sm"></i>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <label htmlFor="autoplay">Autoplay preview videos? </label>
                            <input
                                id="autoplay"
                                type="checkbox"
                                className="w-6 h-6"
                                checked={autoplay}
                                onChange={() => setAutoplay(!autoplay)}
                            ></input>
                        </div>
                        <button
                            type="submit"
                            className="py-2.5 bg-[#e50914] rounded-md font-semibold hover:bg-opacity-50 active:scale-105 transition"
                        >
                            Save
                        </button>
                    </form>
                </div>
            </motion.div>
        </>
    );
}

export default ManageProfilesModal;
