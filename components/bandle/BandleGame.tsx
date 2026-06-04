"use client";

import { useRef, useState } from "react";
import styles from "./BandleGame.module.css";

const TRACKS = [
  { id: "drums", label: "Drums", src: "/bandle/drum.mp3" },
  { id: "bass", label: "Bass", src: "/bandle/bas.mp3" },
  { id: "vibraphone", label: "Marimba", src: "/bandle/marimba.mp3" },
  { id: "voice", label: "Voice", src: "/bandle/vox.mp3" },
];

export default function BandleGame() {
  const [playing, setPlaying] = useState<string | null>(null);
  const [started, setStarted] = useState<Set<string>>(new Set());
  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({});

  function toggle(id: string) {
    const audio = audioRefs.current[id];
    if (!audio) return;

    if (playing === id) {
      audio.pause();
      setPlaying(null);
    } else {
      if (playing) {
        audioRefs.current[playing]?.pause();
      }
      audio.play();
      setPlaying(id);
      setStarted((prev) => new Set([...prev, id]));
    }
  }

  function reset(id: string) {
    const audio = audioRefs.current[id];
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    if (playing === id) setPlaying(null);
  }

  function handleEnded(id: string) {
    if (playing === id) setPlaying(null);
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>Bandle</h1>
      </header>

      <main className={styles.main}>
        <p className={styles.subtitle}>Guess the track of the day</p>

        <div className={styles.tracks}>
          {TRACKS.map((track) => (
            <div key={track.id} className={styles.trackRow}>
              <button
                className={`${styles.trackBtn} ${playing === track.id ? styles.active : ""}`}
                onClick={() => toggle(track.id)}
              >
                <span className={styles.playIcon}>
                  {playing === track.id ? "⏸" : "▶"}
                </span>
                <span className={styles.trackLabel}>{track.label}</span>
                <audio
                  ref={(el) => {
                    audioRefs.current[track.id] = el;
                  }}
                  src={track.src}
                  onEnded={() => handleEnded(track.id)}
                />
              </button>
              {started.has(track.id) && (
                <button
                  className={styles.resetBtn}
                  onClick={() => reset(track.id)}
                  aria-label="Back to start"
                >
                  ⏮
                </button>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
