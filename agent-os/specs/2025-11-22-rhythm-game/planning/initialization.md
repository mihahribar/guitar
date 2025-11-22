# Initial Spec Idea

## User's Initial Description

# Rhythm Game Feature

## Raw Idea
Create a Rhythm Game that has a simple 2x2 grid, each panel is a 1/4 of a 4/4 rhythm. Each panel has combinations of notes (1 quarter, 2 eighths, 4 sixteenths, 3 triplets, and any combinations of all those that make sense). Before the game starts the user can select a BPM tempo using the built-in metronome feature. User can either pick combination for each panel, randomize it, and even a mode where on each cycle one panel randomly changes. There is no need to record the user, but there should be an option to "play" the tempo (but the default is to just cycle through panels). Based on the metronome speed, the panels should light up so the user knows which notes are supposed to be played.

## Initial Constraints
- Separate page (not integrated into existing pages)
- No localStorage persistence
- No user recording/input detection
- Uses existing metronome feature for BPM selection

## Context
This is for the CAGED Visualizer project - a React + TypeScript guitar learning application. The rhythm game will help users practice reading and internalizing different rhythm patterns.

## Metadata
- Date Created: 2025-11-22
- Spec Name: rhythm-game
- Spec Path: agent-os/specs/2025-11-22-rhythm-game
