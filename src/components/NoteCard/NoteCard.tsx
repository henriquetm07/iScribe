import './NoteCard.css';

export interface NoteCardProps {
  /** Note title */
  title: string;
  /** Short excerpt of the note body */
  excerpt: string;
  /** Last edited date */
  updatedAt: Date;
  /** Optional tags shown under the excerpt */
  tags?: string[];
  /** Highlights the card as the open note */
  selected?: boolean;
  onSelect?: () => void;
}

const formatDate = (date: Date) =>
  date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });

export const NoteCard = ({ title, excerpt, updatedAt, tags = [], selected = false, onSelect }: NoteCardProps) => (
  <article
    className={`is-note-card${selected ? ' is-note-card--selected' : ''}`}
    onClick={onSelect}
    tabIndex={0}
    onKeyDown={(e) => (e.key === 'Enter' ? onSelect?.() : undefined)}
  >
    <header className="is-note-card__header">
      <h3 className="is-note-card__title">{title}</h3>
      <time className="is-note-card__date" dateTime={updatedAt.toISOString()}>
        {formatDate(updatedAt)}
      </time>
    </header>
    <p className="is-note-card__excerpt">{excerpt}</p>
    {tags.length > 0 && (
      <ul className="is-note-card__tags">
        {tags.map((tag) => (
          <li key={tag} className="is-note-card__tag">#{tag}</li>
        ))}
      </ul>
    )}
  </article>
);
