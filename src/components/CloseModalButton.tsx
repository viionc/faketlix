import {useModalContext} from "../context/ModalContext";
import {ModalActionNames} from "../types/types";

function CloseModalButton({modal}: {modal: ModalActionNames}) {
    const {closeModal} = useModalContext();
    return (
        <button
            type="button"
            className="z-30 bg-[#303030] absolute top-2 right-2 cursor-pointer rounded-full border border-white p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:border-gray-800 hover:bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={() => closeModal(modal)}
        >
            <span className="sr-only">Close menu</span>
            <svg
                className="h-6 w-6 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    );
}

export default CloseModalButton;
