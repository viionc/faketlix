import {MovieProps} from "../../types/types";
import {useFirebaseContext} from "../../context/FirebaseContext";
import {useEffect, useState} from "react";

function AddToFavoritesButton({movie, size}: {movie: MovieProps; size: "small" | "large"}) {
    const {addToFavorites, currentProfile, removeFromFavorites} = useFirebaseContext();
    const [added, setAdded] = useState(false);

    useEffect(() => {
        if (!currentProfile) return;
        if (!currentProfile.favoritedMovies) {
            setAdded(false);
        }
        if (currentProfile?.favoritedMovies.find(id => id === movie.id)) {
            setAdded(true);
        } else {
            setAdded(false);
        }
    }, [currentProfile, movie]);

    return added ? (
        <span
            onClick={() => removeFromFavorites(movie)}
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
                className={`${size === "small" ? "w-5 h-5" : "w-8 h-8"}`}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
            </svg>
        </span>
    ) : (
        <span
            onClick={() => addToFavorites(movie)}
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
                className={`${size === "small" ? "w-5 h-5" : "w-8 h-8"}`}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
            </svg>
        </span>
    );
}

export default AddToFavoritesButton;
