import React, { useState, useEffect } from "react";
import axios from "axios";
import {CiSearch} from "react-icons/ci";
import "../../css/search/SearchBar.css";
const SearchBar = ({ setSearchSongs }) => {
  // FIX 1: Initialize as empty string "" so .trim() works later
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // FIX 1 (Continued): Now .trim() works safely on the string
    if (!query.trim()) {
      setSearchSongs([]);
      return;
    }

    const fetchSongs = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/songs/playlistByTag/${encodeURIComponent(query)}`
        );
        setSearchSongs(res.data.results);
      } catch (error) {
        console.error("Jamendo search failed", error);
        setSearchSongs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSongs();
    
    const debounce = setTimeout(fetchSongs,400);
    //}, 500);

    
    return () => clearInterval(debounce);

  }, [query,setSearchSongs]); // FIX 3: Add 'query' here so it updates when you type

  return (
    <div className="searchbar-root">
      <div className="searchbar-input-wrapper">
        <input
          className="searchbar-input"
          type="text"
          placeholder="Search songs ..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        <CiSearch className="searchbar-icon" size={20} />
      </div>

      {!query && !loading && (
        <p className="searchbar-empty">Search songs to display</p>
      )}

      {loading && <p className="searchbar-loading">Searching ...</p>}
    </div>
  );
};

export default SearchBar;