function Footer() {
    return (
        <div className="w-full flex justify-center">
            <div className="w-1/2 px-20 pt-32 pb-16 flex flex-col gap-10">
                <div className="flex gap-8">
                    <i className="fa-brands fa-facebook-f fa-xl cursor-pointer" style={{color: "#ffffff"}}></i>
                    <i className="fa-brands fa-instagram fa-xl cursor-pointer" style={{color: "#ffffff"}}></i>
                    <i className="fa-brands fa-twitter fa-xl cursor-pointer" style={{color: "#ffffff"}}></i>
                    <i className="fa-brands fa-youtube fa-xl cursor-pointer" style={{color: "#ffffff"}}></i>
                </div>
                <div className="flex flex-wrap gap-4 grow">
                    <p className="text-xs text-zinc-400 hover:underline basis-32 cursor-pointer font-light">Audio Description</p>
                    <p className="text-xs text-zinc-400 hover:underline basis-32 cursor-pointer font-light">Help Center</p>
                    <p className="text-xs text-zinc-400 hover:underline basis-32 cursor-pointer font-light">Gift Cards</p>
                    <p className="text-xs text-zinc-400 hover:underline basis-32 cursor-pointer font-light">Media Center</p>
                    <p className="text-xs text-zinc-400 hover:underline basis-32 cursor-pointer font-light">Investor Relations</p>
                    <p className="text-xs text-zinc-400 hover:underline basis-32 cursor-pointer font-light">Jobs</p>
                    <p className="text-xs text-zinc-400 hover:underline basis-32 cursor-pointer font-light">Terms of Use</p>
                    <p className="text-xs text-zinc-400 hover:underline basis-32 cursor-pointer font-light">Privacy</p>
                    <p className="text-xs text-zinc-400 hover:underline basis-32 cursor-pointer font-light">Legal Notices</p>
                    <p className="text-xs text-zinc-400 hover:underline basis-32 cursor-pointer font-light">Cookie Prefernces</p>
                    <p className="text-xs text-zinc-400 hover:underline basis-32 cursor-pointer font-light">Corporate Information</p>
                    <p className="text-xs text-zinc-400 hover:underline basis-32 cursor-pointer font-light">Contact Us</p>
                    <p className="text-xs text-zinc-400 hover:underline basis-32 cursor-pointer font-light">Ad Choices</p>
                </div>
                <span className="py-2 px-5 border border-zinc-400 text-zinc-400 hover:text-white w-[7.5rem] text-xs cursor-pointer">
                    Service Code
                </span>
                <p className="text-xs text-zinc-600">©2023-2023 Faketflix</p>
            </div>
        </div>
    );
}

export default Footer;
