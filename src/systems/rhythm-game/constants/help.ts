/**
 * Plain-language explanation of rhythm practice, shown in the page help modal
 */

import type { HelpContent } from '@/shared/types/help';

export const RHYTHM_HELP: HelpContent = {
  title: 'Rhythm practice',
  teaser: 'New to reading rhythm?',
  paragraphs: [
    'A bar of 4/4 has four beats. What changes from one rhythm to the next is how each beat is chopped up: one note on the beat, two eighths counted "1 and", four sixteenths counted "1 e and a", or three triplets counted "1 trip let". That chopping up is called subdivision, and it is most of what reading rhythm is.',
    'Each panel here holds one beat. Set a tempo, hit Start, and play along while the highlight moves from panel to panel. Count out loud, keep your strumming hand swinging even on the beats you do not play, and turn on the metronome so you can hear when you drift.',
  ],
  tips: [
    'Start slower than feels necessary. Clean and slow beats fast and sloppy.',
    'Click any panel to swap in a different pattern for that beat.',
    'Turn on Random Change to keep yourself reading instead of memorising.',
  ],
  reading: [
    {
      label: 'Rhythm Maestro course',
      url: 'https://www.justinguitar.com/modules/rhythm-maestro',
      source: 'JustinGuitar',
    },
    {
      label: 'Rhythm and meter lessons',
      url: 'https://www.musictheory.net/lessons',
      source: 'musictheory.net',
    },
  ],
  videos: [
    {
      label: 'Counting Eighth Notes (Rhythm Lesson and Exercises)',
      url: 'https://www.youtube.com/watch?v=YiQfBDBsZZg',
      source: 'This is Classical Guitar',
    },
    {
      label: 'Subdividing Sixteenth Notes, eighth notes, and ties',
      url: 'https://www.youtube.com/watch?v=lYDH_ppfB3E',
      source: 'The Lone Arranger',
    },
  ],
};
