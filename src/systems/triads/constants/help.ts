/**
 * Plain-language explanation of triads, shown in the page help modal
 */

import type { HelpContent } from '@/shared/types/help';

export const TRIADS_HELP: HelpContent = {
  title: 'Triads',
  teaser: 'New to triads?',
  paragraphs: [
    'A triad is the smallest complete chord: a root, a third and a fifth. Played on three neighbouring strings, it is a compact shape you can grab anywhere, and every bigger chord shape (including the CAGED shapes) is built out of them.',
    'Each triad can be stacked three ways. In root position the root is the lowest note; in 1st inversion the third is at the bottom; in 2nd inversion the fifth is. On one string set the three inversions follow each other up the neck, then repeat an octave higher.',
  ],
  tips: [
    'Start with one string set and walk the inversions up the neck with the arrow keys.',
    'Add a second string set to see how the shapes connect across strings.',
    'Switch between major and minor and watch only the third move by one fret.',
  ],
  reading: [
    {
      label: 'Guitar Chords 101: Triad Inversions Up the Fretboard',
      url: 'https://online.berklee.edu/takenote/guitar-chords-101-triad-inversions-up-the-fretboard/',
      source: 'Berklee Online',
    },
    {
      label: 'Triads on Every String Set',
      url: 'https://www.ultimate-guitar.com/lessons/chords/triads_on_every_string_set.html',
      source: 'Ultimate Guitar',
    },
  ],
  videos: [
    {
      label: 'Triads and Inversions on Guitar',
      url: 'https://www.youtube.com/watch?v=Na-dAAqIOW8',
      source: 'Guitar Tricks',
    },
  ],
};
