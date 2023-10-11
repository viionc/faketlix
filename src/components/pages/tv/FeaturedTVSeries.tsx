import {useEffect, useState} from "react";
import {EntryProps} from "../../../types/types";
import {useModalContext} from "../../../context/ModalContext";
import {IMAGE_ORIGINAL_PATH} from "../../../types/constants";
import {useFirebaseContext} from "../../../context/FirebaseContext";
import {fetchLogo, fetchTrailer} from "../../../utils/fetchData";

function FeaturedTVSeries({entry}: {entry: EntryProps}) {
    const [movieLogo, setMovieLogo] = useState<string | null>();
    const [movieTrailer, setMovieTrailer] = useState<string | null>();

    const {openModal} = useModalContext();
    const {currentProfile} = useFirebaseContext();

    useEffect(() => {
        fetchLogo("tv", entry.id).then(response => {
            if (response) {
                setMovieLogo(response);
            }
        });

        fetchTrailer(entry.type, entry.id).then(response => {
            if (response) {
                setMovieTrailer(response);
            }
        });
    }, [entry.id]);

    return (
        <section className="w-full h-[60rem] relative">
            {movieTrailer ? (
                <div className="overflow-hidden w-full aspect-video ">
                    <iframe
                        width={window.innerWidth - 20}
                        className="h-[90vh] w-[200%] ms-[-50%]"
                        src={`https://www.youtube.com/embed/${movieTrailer}?autoplay=${currentProfile?.autoplay ? 1 : 0}&mute=1&rel=0`}
                        allow="autoplay"
                        title="Embedded youtube"
                    />
                </div>
            ) : (
                <img
                    src={`${IMAGE_ORIGINAL_PATH}${entry.backdrop_path}`}
                    className="w-full h-[60rem] absolute top-0 left-0 object-cover brightness-75 "
                ></img>
            )}
            <div className="h-[15rem] absolute top-1/3 left-0 ps-20 gap-4 flex flex-col">
                {movieLogo ? (
                    <img
                        src={`${IMAGE_ORIGINAL_PATH}${movieLogo}`}
                        className="w-[12rem] h-[10rem] object-contain z-10"
                        alt={entry.title + " logo"}
                    ></img>
                ) : (
                    <div className="font-4xl z-10">{entry.title}</div>
                )}
                <div className="flex gap-2 font-semibold z-10">
                    <button className="py-3 px-10 bg-white text-black text-2xl rounded-md hover:bg-opacity-[75%]">
                        <i className="fa-solid fa-play" style={{color: "#000000"}}></i> Play
                    </button>
                    <button
                        onClick={() => openModal("isTVSeriesInformationModalOpen", {name: "movieClicked", value: entry})}
                        className="py-3 px-10 bg-[#6E6D6D] text-2xl rounded-md text-white bg-opacity-[70%] hover:bg-opacity-[60%] flex justify-center items-center gap-2"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-8 h-8"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                            />
                        </svg>
                        More Info
                    </button>
                </div>
            </div>
        </section>
    );
}

export default FeaturedTVSeries;
