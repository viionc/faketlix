import {useModalContext} from "../../../context/ModalContext";
import {UserProfile} from "../../../types/types";

function ManageProfile({profile}: {profile: UserProfile}) {
    const {openModal} = useModalContext();
    return (
        <div className="flex flex-col gap-2 justify-center items-center relative">
            <div
                onClick={e => {
                    e.stopPropagation();
                    openModal("isManageProfilesModalOpen", {name: "profileCliked", value: profile});
                }}
                className={`w-[7rem] h-[7rem] lg:w-[10rem] lg:h-[10rem] border border-white justify-center items-center flex rounded-md flex-col hover:scale-105 active:scale-110 transition cursor-pointer ${profile.profileColor}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                    />
                </svg>
            </div>
            <p className="text-xl font-semibold text-zinc-400">{profile.name}</p>
        </div>
    );
}

export default ManageProfile;
