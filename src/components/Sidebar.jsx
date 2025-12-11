import { useContext } from "react";
import { FaFireAlt } from "react-icons/fa";
import { GrChannel, GrLike } from "react-icons/gr";
import { IoHome } from "react-icons/io5";
import { MdLibraryBooks } from "react-icons/md";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Sidebar = ({ isOpen }) => {
  const { user } = useContext(AuthContext);

  return (
    <aside
      className={`w-60 bg-[#212121] p-2 fixed top-14 left-0 h-full overflow-y-auto scrollbar-thin transition-transform duration-300 z-40 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <nav>
        <Link to="/">
          <div className="flex gap-2 items-center hover:bg-[#3f3f3f] rounded-lg transition-colors p-3 cursor-pointer">
            <IoHome className="text-white text-xl" />
            <h1 className="text-white text-base">Home</h1>
          </div>
        </Link>

        <Link to="/">
          <div className="flex gap-2 items-center hover:bg-[#3f3f3f] rounded-lg transition-colors p-3 cursor-pointer">
            <FaFireAlt className="text-white text-xl" />
            <h1 className="text-white text-base">Trending</h1>
          </div>
        </Link>

        <Link to="/">
          <div className="flex gap-2 items-center hover:bg-[#3f3f3f] rounded-lg transition-colors p-3 cursor-pointer">
            <MdLibraryBooks className="text-white text-xl" />
            <h1 className="text-white text-base">Library</h1>
          </div>
        </Link>

        {user && (
          <>
            <div className="h-px bg-dark-border my-3"></div>

            <Link to={`/channel/${user._id}`}>
              <div className="flex gap-2 items-center hover:bg-[#3f3f3f] rounded-lg transition-colors p-3 cursor-pointer">
                <GrChannel className="text-white text-xl" />
                <h1 className="text-white text-base"> My Channel</h1>
              </div>
            </Link>
            <Link to={`/`}>
              <div className="flex gap-2 items-center hover:bg-[#3f3f3f] rounded-lg transition-colors p-3 cursor-pointer">
                <GrLike className="text-white text-xl" />
                <h1 className="text-white text-base">Liked Videos</h1>
              </div>
            </Link>
          </>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
