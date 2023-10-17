import clsx from "clsx";
import {FormEvent, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useDataContext} from "../../context/DataContext";

function SearchBar() {
    const [show, setShow] = useState<boolean>(false);
    const [search, setSearch] = useState("");
    const {getByName} = useDataContext();
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const response = await getByName(search);
        if (response) {
            navigate("/search");
        }
    };

    return (
        <>
            <div className="flex gap-2 items-center z-1">
                <form
                    className={clsx(
                        `h-[3rem] ps-2 transition-all flex items-center gap-2 rounded-sm bg-black border border-white z-[1]`,
                        show ? "w-[260px]" : "w-[0px] opacity-0"
                    )}
                    onSubmit={handleSubmit}
                >
                    <i
                        className={`fa-solid fa-magnifying-glass fa-lg scale-125`}
                        style={{
                            display: show ? "inline-block" : "none",
                        }}
                    ></i>
                    <input
                        className={clsx(
                            `h-[2rem] bg-black text-white transition-all outline-none`,
                            show ? "w-[220px] opacity-100" : "w-[0px] opacity-0"
                        )}
                        onBlur={() => setShow(false)}
                        placeholder="Type name of a movie..."
                        value={search}
                        onClick={e => e.stopPropagation()}
                        onChange={e => setSearch(e.target.value)}
                    ></input>
                </form>
                <i
                    className={clsx(`fa-solid fa-magnifying-glass fa-lg hover:scale-125 cursor-pointer`, show ? "hidden" : "inline-block")}
                    onClick={() => {
                        setShow(prev => !prev);
                        setSearch("");
                    }}
                    style={{
                        visibility: show ? "hidden" : "visible",
                    }}
                ></i>
            </div>
        </>
    );
}

export default SearchBar;
