/**
 * Types for the per-system help content shown in the "What is this?" modal
 */

/** A single outbound resource (article, lesson page or video) */
export interface HelpResource {
  /** Link text */
  label: string;
  /** Destination URL */
  url: string;
  /** Who made it, rendered as a quiet suffix after the label */
  source: string;
}

/** Everything a learning system needs to explain itself to a newcomer */
export interface HelpContent {
  /** Modal heading, e.g. "The CAGED system" */
  title: string;
  /** Quiet lead-in on the footer link, e.g. "New to CAGED?" */
  teaser: string;
  /** One or two short paragraphs, plain language, no jargon */
  paragraphs: readonly string[];
  /** Optional bullet list of things to try in this tab */
  tips?: readonly string[];
  /** Articles and lesson pages */
  reading: readonly HelpResource[];
  /** Video lessons */
  videos: readonly HelpResource[];
}
