/**
 * Plain-language explanation of seventh chords, shown in the page help modal
 */

import type { HelpContent } from '@/shared/types/help';

export const SEVENTHS_HELP: HelpContent = {
  title: 'Seventh chords',
  teaser: 'New to seventh chords?',
  paragraphs: [
    'A seventh chord is a triad with one more note on top: the seventh. Played one note per string, it becomes a compact four-string shape you can move anywhere, and these shapes carry most jazz and blues rhythm playing.',
    'Stacking the four notes as closely as possible makes an awkward stretch on guitar, so one note moves down an octave. Drop the second-highest note and you get a drop 2 shape on four neighbouring strings (ADGB, DGBE); drop the third-highest and you get a drop 3 shape that skips the A string (E·DGB). Each shape has four inversions, one for each chord tone in the bass, and they follow each other up the neck.',
  ],
  tips: [
    'Start with ADGB in root position and walk it up the neck with the arrow keys.',
    'Step through the qualities from maj7 to °7: each step lowers one note by one fret.',
    'The three root positions are the E, A and D shapes from CAGED, with the doubled root moved down to the seventh.',
    'Diminished 7th chords are symmetrical: every inversion is the same shape, three frets apart.',
  ],
  reading: [
    {
      label: 'Drop 2 Chords For Guitar',
      url: 'https://www.jazz-guitar-licks.com/blog/drop-2-chord-voicings-guitar-diagrams-jazz-lesson.html',
      source: 'Jazz Guitar Licks',
    },
    {
      label: 'Drop 3 Chords Chart',
      url: 'https://hubguitar.com/fretboard/drop3-chords',
      source: 'HubGuitar',
    },
  ],
  videos: [
    {
      label: "Let's learn Major 7th chords: Drop 2 Voicings",
      url: 'https://www.youtube.com/watch?v=JtBrOLxrsxI',
      source: 'Tomo Fujita',
    },
  ],
};
