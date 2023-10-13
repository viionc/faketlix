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
        const response = await getByName(search);
        if (response) {
            navigate("/search");
        }
    };

    return (
        <div className="flex gap-2 items-center">
            <form className={clsx(`h-[2rem] transition-all`, show ? "w-[250px]" : "w-[0px]")} onSubmit={handleSubmit}>
                <input
                    className={clsx(
                        `h-[2rem] p-1 rounded-full bg-white text-black transition-all`,
                        show ? "w-[250px] opacity-100" : "w-[0px] opacity-0"
                    )}
                    placeholder="Type name of a movie..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                ></input>
            </form>
            <i className="fa-solid fa-magnifying-glass fa-lg hover:scale-125 cursor-pointer" onClick={() => setShow(prev => !prev)}></i>
        </div>
    );
}

export default SearchBar;
