import type { HelpContent, HelpResource } from '../types/help';
import Modal from './Modal';

interface HelpModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Close callback */
  onClose: () => void;
  /** The explanation to render */
  content: HelpContent;
}

const linkClass =
  'text-blue-600 dark:text-blue-400 hover:underline focus:underline focus:outline-none';

function ResourceList({ resources }: { resources: readonly HelpResource[] }) {
  return (
    <ul className="space-y-1.5">
      {resources.map(({ label, url, source }) => (
        <li key={url} className="text-sm">
          <a href={url} target="_blank" rel="noopener noreferrer" className={linkClass}>
            {label}
          </a>{' '}
          <span className="text-gray-500 dark:text-gray-400 text-xs">{source}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Plain-language explanation of a learning system, shown over the page.
 */
export default function HelpModal({ isOpen, onClose, content }: HelpModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={content.title}>
      <div className="p-4 space-y-4">
        <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          {content.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        {content.tips && (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
              Try it
            </h3>
            <ul className="space-y-1.5 text-sm text-gray-700 dark:text-gray-300 list-disc pl-5">
              {content.tips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
            Read more
          </h3>
          <ResourceList resources={content.reading} />
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
            Watch
          </h3>
          <ResourceList resources={content.videos} />
        </div>
      </div>
    </Modal>
  );
}
