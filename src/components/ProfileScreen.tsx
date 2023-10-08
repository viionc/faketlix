import {useFirebaseContext} from "../context/FirebaseContext";
import Profile from "./Profile";
import {motion} from "framer-motion";
import {useModalContext} from "../context/ModalContext";
import CreateProfileModal from "./modals/CreateProfileModal";

function ProfileScreen() {
    const {account} = useFirebaseContext();

    const {openModal, modalState} = useModalContext();

    return (
        <motion.div
            initial={{scale: 0.8, opacity: 0.7}}
            animate={{scale: 1, opacity: 1}}
            className="w-full h-[100vh] flex flex-col justify-center items-center flex-wrap gap-4 relative"
        >
            {modalState.isCreateProfileModalOpen && <CreateProfileModal></CreateProfileModal>}
            <h1 className="text-[4rem] text-zinc-400">Who's watching?</h1>
            <div className="w-full flex justify-center items-center flex-wrap gap-4 sm:mb-32">
                {account?.profiles.map(profile => (
                    <Profile key={profile.name} profile={profile}></Profile>
                ))}
                <div className="flex flex-col gap-2 justify-center items-center">
                    <div
                        onClick={() => openModal("isCreateProfileModalOpen")}
                        className="w-[10rem] h-[10rem] bg-zinc-900 justify-center items-center flex rounded-md cursor-pointer hover:scale-105 transition hover:bg-gray-100"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="gray" className="w-16 h-16">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-xl font-semibold text-zinc-400">Add profile</p>
                </div>
            </div>
        </motion.div>
    );
}

export default ProfileScreen;
