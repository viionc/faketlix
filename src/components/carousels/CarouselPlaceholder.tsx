function CarouselPlaceholder() {
    const numberPerPage = Math.floor((window.outerWidth - 64) / 304);

    return (
        <div className="py-2 pt-6 flex w-full gap-2 relative h-[10rem] justify-center">
            <div className="h-[10rem] rounded-s-md w-[2rem] flex justify-center items-center hover:bg-black hover:bg-opacity-30 cursor-pointer z-[15] bg-zinc-600 invisible"></div>
            {Array(numberPerPage)
                .fill("")
                .map((_, i) => {
                    return <span key={i} className="rounded-md w-[19rem] h-[10rem] bg-zinc-600"></span>;
                })}
            <div className="h-[10rem] rounded-s-md w-[2rem] flex justify-center items-center hover:bg-black hover:bg-opacity-30 cursor-pointer z-[15] bg-zinc-600"></div>
        </div>
    );
}

export default CarouselPlaceholder;
