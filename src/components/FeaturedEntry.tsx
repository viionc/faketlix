import {useEffect, useState} from "react";
import {useModalContext} from "../context/ModalContext";
import {IMAGE_ORIGINAL_PATH} from "../types/constants";
import {useFirebaseContext} from "../context/FirebaseContext";
import {fetchLogo, fetchTrailer} from "../utils/fetchData";
import {EntryProps, EntryTypes} from "../types/types";
import MoreInfoButton from "./buttons/MoreInfoButton";
import Logo from "./Logo";
import PlayButton from "./buttons/PlayButton";
import {useDataContext} from "../context/DataContext";
import Spinner from "./Spinner";

function FeaturedEntry({type}: {type: EntryTypes}) {
    const [logo, setLogo] = useState<string>("");
    const [trailer, setTrailer] = useState<string | null>();
    const [entry, setEntry] = useState<EntryProps | null>(null);

    const {openModal} = useModalContext();
    const {dataState} = useDataContext();
    const {currentProfile} = useFirebaseContext();

    useEffect(() => {
        type === "movie" ? setEntry(dataState.featuredMovie) : setEntry(dataState.featuredTVSeries);
        if (!entry) return;
        fetchLogo(type, entry.id).then(response => {
            if (response) {
                setLogo(response);
            }
        });
        fetchTrailer(type, entry.id).then(response => {
            if (response) {
                setTrailer(response);
            }
        });
    }, [dataState.featuredMovie, dataState.featuredTVSeries, type, entry]);
    if (!entry) return <Spinner></Spinner>;

    return (
        <section className="w-full min-h-[100vh] relative">
            {trailer ? (
                <div className="overflow-hidden min-h-[100vh] w-full aspect-video ">
                    <iframe
                        width={window.innerWidth - 20}
                        className="min-h-[100vh] w-[200%] ms-[-50%]"
                        src={`https://www.youtube.com/embed/${trailer}?autoplay=${currentProfile?.autoplay ? 1 : 0}&mute=1&rel=0`}
                        allow="autoplay"
                        title="Embedded youtube"
                    />
                </div>
            ) : (
                <img
                    src={`${IMAGE_ORIGINAL_PATH}${entry.backdrop_path}`}
                    className="w-full  h-[100vh] absolute top-0 left-0 object-cover brightness-75 "
                ></img>
            )}
            <div className="h-[15rem] absolute top-2/3 lg:top-1/3 left-0 ps-2 lg:ps-20 gap-4 flex flex-col">
                <Logo title={entry.title} path={logo}></Logo>
                <div className="flex gap-2 font-semibold z-[2]">
                    <PlayButton></PlayButton>
                    <MoreInfoButton callback={openModal} entry={entry}></MoreInfoButton>
                </div>
            </div>
        </section>
    );
}

export default FeaturedEntry;
