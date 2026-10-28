# Rhythm game

- **Web Audio autoplay**: the AudioContext must be resumed after a user interaction (browser policy), or playback stays silent.
- Audio is scheduled against `audioContext.currentTime` (`hooks/useSubdivisionAudio.ts`) for precise playback; the visual beat cycler (`hooks/useRhythmCycler.ts`) uses `setInterval`.
- Test changes across different BPM values and pattern combinations.
- **Pattern ids are part of shared links** (`panels=`, `pool=` in `utils/urlState.ts`): renaming one breaks links already sent; keep the old id working.
