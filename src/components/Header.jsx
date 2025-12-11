import { useContext, useEffect, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Header = ({ onMenuClick, onSearch }) => {
  const { user, logout } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const isVideoPage = location.pathname.startsWith("/video/");
  const isChannelPage = location.pathname.startsWith("/channel/");

  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery);
  };

  useEffect(() => {
    if (onSearch) {
      onSearch(searchQuery);
    }
  }, [searchQuery]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="flex items-center px-3 justify-between  h-18 md:h-14 bg-[#212121] sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <button
          className="text-white  text-2xl md:text-xl p-2 cursor-pointer rounded-full transition-colors"
          onClick={onMenuClick}
        >
          ☰
        </button>
        <Link
          to="/"
          className="flex items-center gap-1 text-white no-underline"
        >
          <span className="text-red-600 text-2xl">▶</span>
          <span className="text-xl whitespace-nowrap font-bold ">YouTube</span>
        </Link>
      </div>

      <form
        className={`flex items-center justify-center relative  w-full  ${
          isVideoPage || isChannelPage ? "hidden md:flex" : "flex"
        }`}
        onSubmit={handleSearch}
      >
        <div className="relative w-[80%] md:w-[50%]">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 bg-[#0f0f0f] border border-[#3f3f3f] text-white text-base rounded-full outline-none focus:border-blue-600"
          />

          <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" />
        </div>
      </form>

      <div className="flex items-center gap-3 relative" ref={dropdownRef}>
        {user ? (
          <div className="relative w-24">
            <div className="flex items-end justify-end">
              <div
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="h-9  cursor-pointer w-9 bg-gray-600 rounded-full flex items-center justify-center"
              >
                <h1 className="text-base text-white font-bold ">
                  {user?.username?.charAt(0).toUpperCase()}
                </h1>
              </div>
            </div>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-[#282828] shadow-2xl rounded-xl overflow-hidden border border-[#3f3f3f] z-50">
                <div className="p-4 border-b border-[#3f3f3f]">
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1 overflow-hidden">
                      <h3 className="text-white font-semibold text-sm truncate">
                        {user.username}
                      </h3>
                      <p className="text-gray-400 text-xs truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <Link
                    to={`/channel/${user._id}`}
                    onClick={() => setIsDropdownOpen(false)}
                    className="block w-full text-center py-2 px-3 bg-[#3f3f3f] hover:bg-[#4f4f4f] rounded-lg text-blue-400 text-sm font-medium no-underline transition-colors"
                  >
                    View Channel
                  </Link>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <Link
                    to={`/channel/${user._id}`}
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#3f3f3f] text-white no-underline transition-colors"
                  >
                    <span className="text-lg">📺</span>
                    <span className="text-sm">Your Channel</span>
                  </Link>

                  <Link
                    to="/"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#3f3f3f] text-white no-underline transition-colors"
                  >
                    <span className="text-lg">👍</span>
                    <span className="text-sm">Liked Videos</span>
                  </Link>

                  <div className="border-t border-[#3f3f3f] my-2"></div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#3f3f3f] text-white w-full text-left transition-colors"
                  >
                    <span className="text-lg">🚪</span>
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-2  w-32 justify-center p-2  md:px-4 md:py-2 border border-blue-500 rounded-full text-blue-500 no-underline font-medium hover:bg-blue-500 hover:text-white transition-colors whitespace-nowrap"
          >
            <span className="">Sign In</span>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
