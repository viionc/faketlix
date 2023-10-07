import {useFirebaseContext} from "../context/FirebaseContext";
import Profile from "./Profile";
import {motion} from "framer-motion";

function ProfileScreen() {
    const {account} = useFirebaseContext();
    return (
        <motion.div
            initial={{scale: 0.8, opacity: 0.7}}
            animate={{scale: 1, opacity: 1}}
            className="w-full h-[100vh] flex justify-center items-center flex-wrap gap-4"
        >
            {account?.profiles.map(profile => (
                <Profile key={profile.name} profile={profile}></Profile>
            ))}
            <div
                onClick={() => {
                    console.log("lol");
                }}
                className="w-[10rem] h-[10rem] border border-white bg-zinc-800 justify-center items-center flex rounded-md"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
        </motion.div>
    );
}

export default ProfileScreen;
