import {FormEvent, useState} from "react";
import {useFirebaseContext} from "../context/FirebaseContext";
import Profile from "./Profile";
import {motion} from "framer-motion";

function ProfileScreen() {
    const {account, createProfile} = useFirebaseContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [profileName, setProfileName] = useState<string>("");
    const openCreateProfile = () => {
        setIsModalOpen(true);
    };

    const handleCreateProfile = (e: FormEvent) => {
        e.preventDefault();
        if (profileName.length < 3 && profileName.length > 15) return;
        createProfile(profileName);
        setIsModalOpen(false);
        setProfileName("");
    };

    return (
        <motion.div
            initial={{scale: 0.8, opacity: 0.7}}
            animate={{scale: 1, opacity: 1}}
            className="w-full h-[100vh] flex justify-center items-center flex-wrap gap-4 relative"
        >
            {account?.profiles.map(profile => (
                <Profile key={profile.name} profile={profile}></Profile>
            ))}
            <div
                onClick={openCreateProfile}
                className="w-[10rem] h-[10rem] border border-white bg-zinc-900 justify-center items-center flex rounded-md cursor-pointer hover:scale-105 transition"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            {isModalOpen && (
                <div className="w-[30rem] h-[15rem] bg-zinc-800 shadow-lg absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] flex items-center flex-col justify-center rounded-lg">
                    <form className="flex flex-col gap-3 mb-2" onSubmit={handleCreateProfile}>
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
                        <button
                            type="submit"
                            className="py-2.5 bg-[#e50914] rounded-md font-semibold hover:bg-opacity-50 active:scale-105 transition"
                        >
                            Add
                        </button>
                    </form>
                </div>
            )}
        </motion.div>
    );
}

export default ProfileScreen;
