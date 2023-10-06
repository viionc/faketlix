function CarouselPlaceholder() {
    const numberPerPage = Math.floor((window.outerWidth - 64) / 304);

    return (
        <div className="flex w-full gap-2 relative h-[10rem] justify-center">
            {Array(numberPerPage)
                .fill("")
                .map((_, i) => {
                    return <span key={i} className="rounded-md w-[19rem] h-[10rem] bg-zinc-600"></span>;
                })}
        </div>
    );
}

export default CarouselPlaceholder;
