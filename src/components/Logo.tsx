import {IMAGE_ORIGINAL_PATH} from "../types/constants";

function Logo({path, title}: {path: string; title: string}) {
    return (
        <img
            src={`${IMAGE_ORIGINAL_PATH}${path}`}
            className="w-[10rem] h-[6rem] lg:w-[12rem] lg:h-[10rem] object-contain z-[2] hidden md:block"
            alt={title + " logo"}
        ></img>
    );
}

export default Logo;
