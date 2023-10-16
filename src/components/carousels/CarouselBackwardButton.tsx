import clsx from "clsx";

function CarouselBackwardButton({currentPage, callback}: {currentPage: number; callback: (add: boolean) => void}) {
    return (
        <div
            className={clsx(
                "w-[8%] lg:w-[3%] absolute top-0 left-0 bottom-0 flex justify-center items-center cursor-pointer z-[1000] rounded-e-md bg-black bg-opacity-50 hover:bg-opacity-70",
                currentPage > 0 ? "visible" : "invisible"
            )}
            onClick={() => callback(false)}
        >
            <i className="fa-solid fa-chevron-left" style={{color: "#ffffff"}}></i>
        </div>
    );
}

export default CarouselBackwardButton;
