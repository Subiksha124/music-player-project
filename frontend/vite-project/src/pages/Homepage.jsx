import React, { useState } from "react";

import Footer from "../components/layout/Footer";
import SideMenu from "../components/layout/SideMenu";
import MainArea from "../components/layout/MainArea";

import "../css/pages/HomePage.css";

const Homepage = () => {
  const [view, setView] = useState("home");
  const [songs, setSongs] = useState([]);
  const [searchSongs, setSearchSongs] = useState([]);
  const [openEditProfile, setOpenEditProfile] = useState(false);
  const auth = useSelector((state) => state.auth);

const songsToDisplay =
  view === "search" ? searchSongs : songs;
  const {
  audioRef,
  currentIndex,
  currentSong,
  isPlaying,
  currentTime,
  duration,
  isMuted,
  loopEnabled,
  shuffleEnabled,
  playbackSpeed,
  volume,
  playsongAtIndex,
  handleTogglePlay,
  handleNext,
  handlePrev,
  handleTimeUpdate,
  handleLoadedMetadata,
  handleEnded,
  handleToggleMute,
  handleToggleLoop,
  handleToggleShuffle,
  handleChangeSpeed,
  handleSeek,
  handleChangeVolume,
} = useAudioPlayer(songsToDisplay);

const playerState = {
  currentSong,
  isPlaying,
  currentTime,
  duration,
  isMuted,
  loopEnabled,
  shuffleEnabled,
  playbackSpeed,
  volume,
};
const playerControls = {
  playSongAtIndex,
  handleTogglePlay,
  handleNext,
  handlePrev,
  handleSeek,
};

const playerFeatures = {
  onToggleMute: handleToggleMute,
  onToggleLoop: handleToggleLoop,
  onToggleShuffle: handleToggleShuffle,
  onChangeSpeed: handleChangeSpeed,
  onChangeVolume: handleChangeVolume,
};
  useEffect(() => {
  const fetchInitialSongs = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/songs`
      );
      setSongs(res.data.results || []);
    } catch (error) {
      console.error("Error while fetching the songs", error);
      setSongs([]);
    }
  };

  fetchInitialSongs();
}, []);
const loadPlaylist = async (tag) => {
  if (!tag) {
    console.warn("No tag is provided");
    return;
  }

  try {
    const res = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/songs/playlistsByTag/${tag}`
    );
    setSongs(res.data.results || []);
  } catch (error) {
    console.error("Failed to load playlist", error);
    setSongs([]);
  }
};
const handleSelectSong=(index)=>{
  playSongAtIndex(index);
}
const handlePlayFavourite = (song) => {
  const favourites = auth.user?.favourites || [];
  if (!favourites.length) return;

  const index = auth.user.favourties.findIndex((fav) => fav.
  id === song.id);
  setSongs(auth.user.favourties);
  setView("home");

  setTimeout(() => {
    if (index !== -1) {
      playSongAtIndex(index);
    }
  }, 0);
};
  
  /*const songs = [
    {
      id: 1,
      name: "Believer",
      artist_name: "Imagine Dragons",
      cover: "https://i.scdn.co/image/ab67616d0000b273a466c9d6c7a3c7bbdc0e87f3",
      releasedate: "2017-02-01",
      duration: "04.30",
    },
    {
      id: 2,
      name: "Faded",
      artist_name: "Alan Walker",
      cover: "https://i.scdn.co/image/ab67616d0000b2733c6c8b9a43d1d93e4aaf0e65",
      releasedate: "2015-12-03",
      duration: "05.30",
    },
    {
      id: 3,
      name: "Shape of You",
      artist_name: "Ed Sheeran",
      cover: "https://i.scdn.co/image/ab67616d0000b273ba0e0bdfd8f5b1dc3c6d1c8e",
      releasedate: "2017-03-17",
      duration: "04.32",
    },
  ];*/
  return (
    <div className="homepage-root">
<audio
  ref={audioRef}
  onTimeUpdate={handleTimeUpdate}
  onLoadedMetadata={handleLoadedMetadata}
  onEnded={handleEnded}
>
  {currentSong && <source src={currentSong.audio}
  type="audio/mpeg" />}
</audio>
<div className="homepage-main-wrapper">
  {/* Sidebar */}
  <div className="homepage-sidebar">
    <SideMenu setView={setView} view={view}
    onOpenEditProfile={()=>setOpenEditProfile(true)} />
  </div>
  {/* Main Content */}
  <div className="homepage-content">
    <MainArea
      view={view}
      currentIndex={currentIndex}
      onSelectSong={handleSelectSong}
      onSelectFavourite={handlePlayFavourite}
      onSelectTag={loadPlaylist}
      songsToDisplay={songsToDisplay}
      setSeearchSongs={setSearchSongs}
      />
      </div>
      </div>
      {/* Footer Player */}
      <Footer
  playerState={playerState}
  playerControls={playerControls}
  playerFeatures={playerFeatures}
/>

{openEditProfile && (
  <Modal onClose={() => setOpenEditProfile(false)}>
    <EditProfile onClose={() => setOpenEditProfile(false)} />
  </Modal>
)}

  </div>);
};

export default Homepage;
