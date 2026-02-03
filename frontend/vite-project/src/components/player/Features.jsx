import React from "react";
import { IoVolumeHighOutline, IoVolumeMuteOutline } from "react-icons/io5";
import { TbArrowsShuffle } from "react-icons/tb";
import { RiLoopRightLine } from "react-icons/ri";

import "../../css/footer/Feature.css";

const Features = ({ playerState, playerFeatures }) => {
  const { isMuted, loopEnabled, shuffleEnabled, playbackSpeed, volume } =
    playerState;

  const {
    onToggleMute,
    onToggleLoop,
    onToggleShuffle,
    onChangeSpeed,
    onVolumeChange,
  } = playerFeatures;

  const handleSpeedChange = (e) => {
    onChangeSpeed(Number(e.target.value));
  };

  const handleVolumeChange = (e) => {
    const value = Number(e.target.value) / 100; // normalize 0–1
    onVolumeChange(value);
  };

  return (
    <div className="features-root">
      <div className="features-row">
        {/* Mute */}
        <button
          type="button"
          className="features-btn"
          aria-label={isMuted ? "unmute" : "mute"}
          onClick={onToggleMute}
        >
          {isMuted ? (
            <IoVolumeMuteOutline color="#a855f7" size={26} />
          ) : (
            <IoVolumeHighOutline color="#a855f7" size={26} />
          )}
        </button>

        {/* Shuffle */}
        <button
          type="button"
          className={
            shuffleEnabled
              ? "features-btn features-btn-active"
              : "features-btn"
          }
          aria-label={shuffleEnabled ? "disable shuffle" : "enable shuffle"}
          onClick={onToggleShuffle}
        >
          <TbArrowsShuffle
            color={shuffleEnabled ? "#a855f7" : "#9ca3af"}
            size={26}
          />
        </button>

        {/* Loop */}
        <button
          type="button"
          className={
            loopEnabled ? "features-btn features-btn-active" : "features-btn"
          }
          aria-label="loop"
          onClick={onToggleLoop}
        >
          <RiLoopRightLine
            color={loopEnabled ? "#a855f7" : "#9ca3af"}
            size={26}
          />
        </button>

        {/* Playback Speed */}
        <label className="features-speed-label">
          <select
            className="features-speed-select"
            value={playbackSpeed}
            onChange={handleSpeedChange}
            aria-label="playback speed"
          >
            <option value={0.75}>0.75x</option>
            <option value={1}>1x</option>
            <option value={1.25}>1.25x</option>
            <option value={1.5}>1.5x</option>
            <option value={2}>2x</option>
          </select>
        </label>
      </div>

      {/* Volume */}
      <div className="features-volume-wrapper">
        <input
          type="range"
          min={0}
          max={100}
          value={Math.round((volume || 0) * 100)}
          onChange={handleVolumeChange}
          className="features-volume-range"
          style={{
            background: `linear-gradient(to right, #a855f7 ${
              (volume || 0) * 100
            }%, #333 ${(volume || 0) * 100}%)`,
          }}
        />
      </div>
    </div>
  );
};

export default Features;
