"use client";

import { useCallback, useEffect, useState } from "react";
import useSound from "use-sound";

type SoundType = "click" | "success" | "error" | "hover" | "type";

const SOUND_PATHS: Record<SoundType, string> = {
  click: "/sounds/click.mp3",
  success: "/sounds/success.mp3",
  error: "/sounds/error.mp3",
  hover: "/sounds/hover.mp3",
  type: "/sounds/type.mp3",
};

const SOUND_VOLUMES: Record<SoundType, number> = {
  click: 0.3,
  success: 0.4,
  error: 0.4,
  hover: 0.15,
  type: 0.2,
};

export function useClickSound(soundType: SoundType = "click") {
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("retro-sounds-muted");
    if (stored === "true") {
      setIsMuted(true);
    }
  }, []);

  const [play] = useSound(SOUND_PATHS[soundType], {
    volume: isMuted ? 0 : SOUND_VOLUMES[soundType],
    interrupt: true,
  });

  const playSound = useCallback(() => {
    if (!isMuted) {
      play();
    }
  }, [play, isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const newValue = !prev;
      localStorage.setItem("retro-sounds-muted", String(newValue));
      return newValue;
    });
  }, []);

  return {
    play: playSound,
    isMuted,
    toggleMute,
  };
}

export function useRetroSounds() {
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("retro-sounds-muted");
    if (stored === "true") {
      setIsMuted(true);
    }
  }, []);

  const [playClick] = useSound(SOUND_PATHS.click, {
    volume: isMuted ? 0 : SOUND_VOLUMES.click,
    interrupt: true,
  });

  const [playSuccess] = useSound(SOUND_PATHS.success, {
    volume: isMuted ? 0 : SOUND_VOLUMES.success,
    interrupt: true,
  });

  const [playError] = useSound(SOUND_PATHS.error, {
    volume: isMuted ? 0 : SOUND_VOLUMES.error,
    interrupt: true,
  });

  const [playHover] = useSound(SOUND_PATHS.hover, {
    volume: isMuted ? 0 : SOUND_VOLUMES.hover,
    interrupt: true,
  });

  const [playType] = useSound(SOUND_PATHS.type, {
    volume: isMuted ? 0 : SOUND_VOLUMES.type,
    interrupt: true,
  });

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const newValue = !prev;
      localStorage.setItem("retro-sounds-muted", String(newValue));
      return newValue;
    });
  }, []);

  return {
    playClick: isMuted ? () => {} : playClick,
    playSuccess: isMuted ? () => {} : playSuccess,
    playError: isMuted ? () => {} : playError,
    playHover: isMuted ? () => {} : playHover,
    playType: isMuted ? () => {} : playType,
    isMuted,
    toggleMute,
  };
}
