import {EntryProps, MovieInformation} from "../../types/types";
import {useFirebaseContext} from "../../context/FirebaseContext";
import {useEffect, useState} from "react";

function AddToPlanToWatchButton({entry, size}: {entry: EntryProps | MovieInformation; size: "small" | "large"}) {
    const {addToPlanToWatch, currentProfile, removeFromPlanToWatch} = useFirebaseContext();
    const [added, setAdded] = useState(false);

    useEffect(() => {
        if (!currentProfile) return;
        if (!currentProfile.planToWatch) {
            setAdded(false);
        }
        if (currentProfile?.planToWatch.movieIds.find(id => id === entry.id) || currentProfile?.planToWatch.tvIds.find(id => id === entry.id)) {
            setAdded(true);
        } else {
            setAdded(false);
        }
    }, [currentProfile, entry]);

    return added ? (
        <span
            onClick={() => removeFromPlanToWatch(entry.type, entry.id)}
            className={`${
                size === "small" ? "h-[1.75rem] w-[1.75rem] border" : "h-[3rem] w-[3rem] border-2"
            } bg-[#303030] border-[#5e5e5e] rounded-full flex justify-center items-center hover:border-white cursor-pointer active:scale-105`}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={`${size === "small" ? "w-6 h-6" : "w-8 h-8"}`}
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
            </svg>
        </span>
    ) : (
        <span
            onClick={() => addToPlanToWatch(entry.type, entry.id)}
            className={`${
                size === "small" ? "h-[1.75rem] w-[1.75rem] border" : "h-[3rem] w-[3rem] border-2"
            } bg-[#303030] border border-[#5e5e5e] rounded-full flex justify-center items-center hover:border-white cursor-pointer active:scale-105`}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={`${size === "small" ? "w-6 h-6" : "w-8 h-8"}`}
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
        </span>
    );
}

export default AddToPlanToWatchButton;
