import {MovieProps} from "../types/types";
import {useFirebaseContext} from "../context/FirebaseContext";
import {useEffect, useState} from "react";

function AddToPlanToWatchButton({movie, size}: {movie: MovieProps; size: "small" | "large"}) {
    const {addToPlanToWatch, currentProfile, removeFromPlanToWatch} = useFirebaseContext();
    const [added, setAdded] = useState(false);

    useEffect(() => {
        if (!currentProfile) return;
        if (!currentProfile.planToWatch) {
            setAdded(false);
        }
        if (currentProfile?.planToWatch.find(id => id === movie.id)) {
            setAdded(true);
        } else {
            setAdded(false);
        }
    }, [currentProfile, movie]);

    return added ? (
        <span
            onClick={() => removeFromPlanToWatch(movie)}
            className={`${
                size === "small" ? "h-[1.75rem] w-[1.75rem] border" : "h-[3rem] w-[3rem] border-2"
            } bg-[#303030] border-[#5e5e5e] rounded-full flex justify-center items-center hover:border-white cursor-pointer`}
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
            onClick={() => addToPlanToWatch(movie)}
            className={`${
                size === "small" ? "h-[1.75rem] w-[1.75rem] border" : "h-[3rem] w-[3rem] border-2"
            } bg-[#303030] border border-[#5e5e5e] rounded-full flex justify-center items-center hover:border-white cursor-pointer`}
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
