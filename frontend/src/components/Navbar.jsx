import { Link, useLocation, useNavigate } from "react-router-dom";
import { BsSearch } from 'react-icons/bs';
import { FaBars } from 'react-icons/fa';
import { useContext, useState } from "react";
import Menu from "./Menu";
import { UserContext } from "../context/UserContext";

const Navbar = () => {
  const [prompt, setPrompt] = useState("");
  const [menu, setMenu] = useState(false);
  const navigate = useNavigate();
  const path = useLocation().pathname;

  const showMenu = () => {
    setMenu(!menu);
  };

  const { user } = useContext(UserContext);

  return (
    <div className="rm fixed top-0 left-0 w-full bg-green-800 text-white flex items-center justify-between px-6 md:px-[200px] py-4 z-50">
      <h1 className="text-lg md:text-xl font-extrabold">
        <Link to="/">AgriForum</Link>
      </h1>
      {path === "/" && (
        <div className="flex items-center space-x-2 bg-white rounded-full px-3 py-1 shadow-lg">
          <p
            onClick={() => navigate(prompt ? "?search=" + prompt : navigate("/"))}
            className="text-green-600 cursor-pointer hover:text-green-800 transition-colors duration-300"
            aria-label="Search"
          >
            <BsSearch className="text-lg" />
          </p>
          <input
            onChange={(e) => setPrompt(e.target.value)}
            className="outline-none px-3 py-1 rounded-full border border-gray-300 text-black placeholder-gray-500"
            placeholder="Search a post"
            type="text"
            aria-label="Search input"
          />
        </div>
      )}
      <div className="hidden md:flex items-center justify-center space-x-2 md:space-x-4">
        {!user ? <h3><Link to="/login">Login</Link></h3> : <h3></h3>}
        {user ? (
          <div onClick={showMenu}>
            <p className="cursor-pointer relative hover:text-gray-300 transition-colors duration-300">
              <FaBars className="text-2xl" /> {/* Increased size */}
            </p>
            {menu && <Menu />}
          </div>
        ) : <h3><Link to="/register">Register</Link></h3>}
      </div>
      <div onClick={showMenu} className="md:hidden text-lg">
        <p className="cursor-pointer relative hover:text-gray-300 transition-colors duration-300">
          <FaBars className="text-2xl" /> {/* Increased size */}
        </p>
        {menu && <Menu />}
      </div>
    </div>
  );
};

export default Navbar;
