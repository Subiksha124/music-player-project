import React from "react";
import { AiOutlineHome,AiOutlineSearch,AiOutlineHeart } from "react-icons/ai";
const SideMenu=()=>{
    return(
    <aside className="sidemenu-root">
    <div className="sidemenu-header">
        <img src="" alt="Project Logo" className="sidemenu-logo"></img>
        <h2 className="sidemenu-logo-title">Synthesia</h2>
    </div>
    <nav>
        <ul>
            <li>
                <button className="sidemenu-nav-btn active">
                <AiOutlineHome size={18} />
                <span>Home</span>
                </button>
                </li>
            <li>
                <button className="sidemenu-nav-btn active">
                <AiOutlineSearch size={18} />
                <span>Search</span>
                </button>
                </li>

            <li>
                <button className="sidemenu-nav-btn active">
                <AiOutlineHeart size={18} />
                <span>My Favourites</span>
                </button>

             </li>
        </ul>
    </nav>
    </aside>
    );   
};
export default SideMenu;