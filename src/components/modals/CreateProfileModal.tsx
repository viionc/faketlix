import {motion} from "framer-motion";
import {FormEvent, useState} from "react";
import CloseModalButton from "../buttons/CloseModalButton";
import {useModalContext} from "../../context/ModalContext";
import {useFirebaseContext} from "../../context/FirebaseContext";
import {PROFILE_COLORS} from "../../types/constants";

function CreateProfileModal() {
    const [profileName, setProfileName] = useState<string>("");
    const [profileColor, setProfileColor] = useState<string>("bg-blue-400");

    const {account, createProfile} = useFirebaseContext();
    const {closeModal} = useModalContext();

    const handleCreateProfile = (e: FormEvent) => {
        e.preventDefault();
        if (!account) return;
        if (profileName.length < 3 && profileName.length > 15) return;
        if (account.profiles.find(profile => profile.name === profileName)) return;
        createProfile(profileName, profileColor);
        closeModal("isCreateProfileModalOpen");
        setProfileName("");
    };

    return (
        <>
            <div
                className="w-full h-[100vh] bg-black bg-opacity-50 absolute top-0 left-0"
                onClick={() => closeModal("isCreateProfileModalOpen")}
            ></div>
            <motion.div
                initial={{transform: "translate(-50%, -50%) scale(0.8)"}}
                animate={{transform: "translate(-50%, -50%) scale(1)"}}
                className="w-[24rem] h-[24rem] bg-zinc-800 shadow-lg absolute top-1/2 left-1/2 rounded-lg"
                onClick={e => e.stopPropagation()}
            >
                <div className="relative w-full h-full flex items-center flex-col justify-center py-16">
                    <CloseModalButton modal={"isCreateProfileModalOpen"}></CloseModalButton>
                    <form className="flex flex-col gap-3 mb-2 p-10" onSubmit={handleCreateProfile}>
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
                        <button
                            type="submit"
                            className="py-2.5 bg-[#e50914] rounded-md font-semibold hover:bg-opacity-50 active:scale-105 transition"
                        >
                            Add
                        </button>
                    </form>
                </div>
            </motion.div>
        </>
    );
}

export default CreateProfileModal;
