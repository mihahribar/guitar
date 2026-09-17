/**
 * Plain-language explanation of the CAGED system, shown in the page help modal
 */

import type { HelpContent } from '@/shared/types/help';

export const CAGED_HELP: HelpContent = {
  title: 'The CAGED system',
  teaser: 'New to CAGED?',
  paragraphs: [
    'You already know the open chord shapes C, A, G, E and D. CAGED is the observation that those same five shapes, slid up the neck and barred, give you every chord. A C chord played with the A shape is still a C chord, just higher up and in a different voicing.',
    'Play them in order and the shapes always come round in the same cycle: C, A, G, E, D, then back to C. They interlock, each one starting where the last one ends, so the five of them cover the whole fretboard. Learn the cycle for one chord and you have learned it for all of them.',
  ],
  tips: [
    'Pick a root, then step through the shapes with the arrow keys and watch the same chord climb the neck.',
    'Select two shapes at once to see how they overlap and share notes.',
    'Turn on the pentatonic overlay to see the scale box that sits around each shape.',
  ],
  reading: [
    {
      label: 'CAGED System course',
      url: 'https://www.justinguitar.com/modules/caged-system',
      source: 'JustinGuitar',
    },
    {
      label: 'CAGED System for Guitar',
      url: 'https://appliedguitartheory.com/lessons/caged-guitar-theory-system/',
      source: 'Applied Guitar Theory',
    },
    {
      label: "The Guitarist's Guide to the CAGED System",
      url: 'https://www.premierguitar.com/lessons/caged-system-guitar',
      source: 'Premier Guitar',
    },
  ],
  videos: [
    {
      label: 'The CAGED system for guitar explained',
      url: 'https://www.youtube.com/watch?v=-nphFK6HFjY',
      source: 'Pickup Music',
    },
    {
      label: 'The CAGED System Explained so it ACTUALLY makes sense!',
      url: 'https://www.youtube.com/watch?v=V3HZK8FPEyA',
      source: 'Guitar Mastery Method',
    },
  ],
};
