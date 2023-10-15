import {useEffect, useState} from "react";
import {EntryProps} from "../../../types/types";
import {useModalContext} from "../../../context/ModalContext";
import {IMAGE_ORIGINAL_PATH} from "../../../types/constants";
import {useFirebaseContext} from "../../../context/FirebaseContext";
import {fetchLogo, fetchTrailer} from "../../../utils/fetchData";
import MoreInfoButton from "../../buttons/MoreInfoButton";
import PlayButton from "../../buttons/PlayButton";

function FeaturedTVSeries({entry}: {entry: EntryProps}) {
    const [movieLogo, setMovieLogo] = useState<string | null>();
    const [movieTrailer, setMovieTrailer] = useState<string | null>();

    const {openModal} = useModalContext();
    const {currentProfile} = useFirebaseContext();

    useEffect(() => {
        fetchLogo(entry.type, entry.id).then(response => {
            if (response) {
                setMovieLogo(response);
            }
        });

        fetchTrailer(entry.type, entry.id).then(response => {
            if (response) {
                setMovieTrailer(response);
            }
        });
    }, [entry.id, entry.type]);

    return (
        <section className="h-full w-full relative">
            {movieTrailer ? (
                <div className="overflow-hidden w-full aspect-video ">
                    <iframe
                        width={window.innerWidth - 20}
                        className="h-[100vh] w-[200%] ms-[-50%]"
                        src={`https://www.youtube.com/embed/${movieTrailer}?autoplay=${currentProfile?.autoplay ? 1 : 0}&mute=1&rel=0`}
                        allow="autoplay"
                        title="Embedded youtube"
                    />
                </div>
            ) : (
                <img
                    src={`${IMAGE_ORIGINAL_PATH}${entry.backdrop_path}`}
                    className="w-full h-full absolute top-0 left-0 object-cover brightness-75 "
                ></img>
            )}
            <div className="h-[15rem] absolute top-2/3 lg:top-1/3 left-0 ps-2 lg:ps-20 gap-4 flex flex-col">
                <img
                    src={`${IMAGE_ORIGINAL_PATH}${movieLogo}`}
                    className="w-[10rem] h-[6rem] lg:w-[12rem] lg:h-[10rem] object-contain z-[2] hidden md:block"
                    alt={entry.title + " logo"}
                ></img>
                <div className="flex gap-2 font-semibold z-10">
                    <PlayButton></PlayButton>
                    <MoreInfoButton callback={openModal} entry={entry}></MoreInfoButton>
                </div>
            </div>
        </section>
    );
}

export default FeaturedTVSeries;
