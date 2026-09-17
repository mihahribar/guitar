/**
 * Plain-language explanation of the 3NPS system, shown in the page help modal
 */

import type { HelpContent } from '@/shared/types/help';

export const THREE_NPS_HELP: HelpContent = {
  title: 'Three notes per string',
  teaser: 'New to 3NPS?',
  paragraphs: [
    'Three notes per string is a way of laying out a scale so that every string gets exactly three notes. No string has two, none has four. That evenness is the whole point: your picking hand falls into a steady pattern, and you never have to shift position in the middle of a string.',
    'Start the major scale on a different degree each time and you get seven patterns, one per mode: Ionian, Dorian, Phrygian, Lydian, Mixolydian, Aeolian, Locrian. They are all the same seven notes, just entered at a different door. Chain them together and they carry you from the nut to the top of the neck.',
  ],
  tips: [
    'Start with a two-string pair to learn the shapes in small pieces, then switch to all six strings.',
    'Use the arrow keys to walk the selected patterns up and down the neck.',
    'Turn on Whole Neck to see every place a pattern repeats.',
  ],
  reading: [
    {
      label: '3 Notes Per String Major Scale Patterns',
      url: 'https://appliedguitartheory.com/lessons/3-notes-per-string-major-scale-patterns/',
      source: 'Applied Guitar Theory',
    },
    {
      label: 'Should You Learn Three Notes Per String Scales?',
      url: 'https://www.soundguitarlessons.com/blog/three-notes-per-string-scales-3nps-scales',
      source: 'Sound Guitar Lessons',
    },
  ],
  videos: [
    {
      label: 'The Best Way To Memorize 3-Note-Per-String Scales and Modes?',
      url: 'https://www.youtube.com/watch?v=wSNIgEfx2k4',
      source: 'The Art of Guitar',
    },
    {
      label: 'Unlock the fretboard with three notes per string',
      url: 'https://www.youtube.com/watch?v=CkymnwBDN9o',
      source: 'Fret Science',
    },
    {
      label: 'Major Scale 3 Note Per String, Pattern 1',
      url: 'https://www.youtube.com/watch?v=q_UYtj-1nvQ',
      source: 'JustinGuitar',
    },
  ],
};
