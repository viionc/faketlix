import {EntryProps, ModalActionNames, ModalActionPayload} from "../../types/types";

function MoreInfoButton({callback, entry}: {callback: (modal: ModalActionNames, payload: ModalActionPayload) => void; entry: EntryProps}) {
    const modal = entry.type === "movie" ? "isMovieInformationModalOpen" : "isTVSeriesInformationModalOpen";
    return (
        <button
            onClick={() => callback(modal, {name: "movieClicked", value: entry})}
            className="py-2 px-6 text-xl lg:py-3 lg:px-10 lg:text-2xl  bg-[#6E6D6D] rounded-md text-white bg-opacity-[70%] hover:bg-opacity-[60%] flex justify-center items-center gap-2"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 lg:w-8 lg:h-8"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                />
            </svg>
            More Info
        </button>
    );
}

export default MoreInfoButton;
