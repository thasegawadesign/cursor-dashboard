"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

function getAudioContextClass(): typeof AudioContext {
  if (typeof window === "undefined") {
    throw new Error("AudioContext is only available in the browser");
  }
  const w = window as unknown as {
    AudioContext?: typeof AudioContext;
    webkitAudioContext?: typeof AudioContext;
  };
  return w.AudioContext ?? w.webkitAudioContext!;
}

/** Soft pad: root + fifth + octave (low volume). */
const FREQ_HZ = [196, 293.66, 392] as const;

export function AmbientMusicToggle() {
  const isClient = useIsClient();
  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const fadeEndTimerRef = useRef<number | null>(null);
  const [playing, setPlaying] = useState(false);

  const hardStop = useCallback(() => {
    if (fadeEndTimerRef.current) {
      clearTimeout(fadeEndTimerRef.current);
      fadeEndTimerRef.current = null;
    }
    const ctx = ctxRef.current;
    const oscs = oscillatorsRef.current;
    ctxRef.current = null;
    gainRef.current = null;
    oscillatorsRef.current = [];
    for (const o of oscs) {
      try {
        o.stop();
        o.disconnect();
      } catch {
        /* already stopped */
      }
    }
    if (ctx && ctx.state !== "closed") {
      void ctx.close();
    }
  }, []);

  const fadeOutAndStop = useCallback(() => {
    const ctx = ctxRef.current;
    const gain = gainRef.current;
    const oscs = oscillatorsRef.current.slice();
    if (!ctx || !gain) {
      hardStop();
      return;
    }
    const now = ctx.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.2);
    fadeEndTimerRef.current = window.setTimeout(() => {
      fadeEndTimerRef.current = null;
      ctxRef.current = null;
      gainRef.current = null;
      oscillatorsRef.current = [];
      for (const o of oscs) {
        try {
          o.stop();
          o.disconnect();
        } catch {
          /* already stopped */
        }
      }
      if (ctx.state !== "closed") {
        void ctx.close();
      }
    }, 220);
  }, [hardStop]);

  const start = useCallback(() => {
    hardStop();
    const AudioCtx = getAudioContextClass();
    const ctx = new AudioCtx();
    const master = ctx.createGain();
    master.gain.value = 0;
    const merger = ctx.createGain();
    merger.gain.value = 0.02;

    const oscs: OscillatorNode[] = [];
    for (let i = 0; i < FREQ_HZ.length; i++) {
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.value = FREQ_HZ[i]!;
      o.detune.value = i === 1 ? 3 : i === 2 ? -2 : 0;
      o.connect(merger);
      o.start();
      oscs.push(o);
    }

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 1200;
    filter.Q.value = 0.7;
    merger.connect(filter);
    filter.connect(master);
    master.connect(ctx.destination);
    void ctx.resume();

    const now = ctx.currentTime;
    master.gain.setValueAtTime(0, now);
    master.gain.linearRampToValueAtTime(1, now + 0.35);

    ctxRef.current = ctx;
    gainRef.current = master;
    oscillatorsRef.current = oscs;
    setPlaying(true);
  }, [hardStop]);

  const stop = useCallback(() => {
    fadeOutAndStop();
    setPlaying(false);
  }, [fadeOutAndStop]);

  useEffect(() => {
    return () => {
      hardStop();
    };
  }, [hardStop]);

  const toggle = useCallback(() => {
    if (playing) {
      stop();
    } else {
      void getAudioContextClass();
      start();
    }
  }, [playing, start, stop]);

  if (!isClient) {
    return (
      <div
        className="h-9 w-22 shrink-0 rounded-lg border border-zinc-200/80 bg-zinc-100/80 dark:border-white/10 dark:bg-white/3"
        aria-hidden
      />
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="flex h-9 shrink-0 cursor-pointer items-center gap-2 rounded-lg border border-zinc-200/80 bg-white/90 px-3 font-mono text-[11px] text-zinc-600 shadow-sm transition hover:bg-zinc-50 dark:border-white/10 dark:bg-white/3 dark:text-zinc-300 dark:shadow-none dark:hover:bg-white/6"
      aria-label={playing ? "BGM をオフにする" : "BGM をオンにする"}
      aria-pressed={playing}
    >
      {playing ? (
        <MusicOnIcon className="size-3.5 text-cyan-600 dark:text-cyan-400" />
      ) : (
        <MusicOffIcon className="size-3.5 text-zinc-500 dark:text-zinc-500" />
      )}
      <span className="tabular-nums">{playing ? "BGM" : "Mute"}</span>
    </button>
  );
}

function MusicOnIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <path d="M9 18V5l12-2v13" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}

function MusicOffIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <path d="M9 18V5l12-2v13" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
      <path d="M3 3l18 18" strokeLinecap="round" />
    </svg>
  );
}
