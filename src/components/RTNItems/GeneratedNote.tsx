import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Icon } from '../../icons/Icon';
import { Button } from '../Button/Button';
import { IconButton } from '../IconButton/IconButton';
import { Tabs, type TabsOption } from '../Tabs/Tabs';
import './RTNItems.css';
import './GeneratedNote.css';

/*
 * RTN Notes · Generated Note — Figma "RTN Items (Generated Note)" (3628:16776). Web only (Chrome Extension).
 *   GeneratedNoteItem  — a section of the generated note: title, Copy Icon Button, divider, the text
 *   GeneratedNoteFrame — the panel with Transcript · Note tabs, Copy Transcript / Copy All, and the transcript
 *                        (with its search field) or the note sections
 */

/** Copies text to the clipboard and reports "copied" for a moment, so the button can show a check */
const useCopy = () => {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const copy = (text: string) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1500);
  };
  return { copied, copy };
};

export interface GeneratedNoteSection {
  id: string;
  title: string;
  /** The section's text. Line breaks are kept. */
  text: string;
}

export interface GeneratedNoteItemProps {
  title: string;
  /** The section's text; line breaks are kept */
  children: ReactNode;
  /** Text the Copy button copies (default: the title and the text, when the text is a string) */
  copyText?: string;
  /** Called after the text is copied */
  onCopy?: () => void;
  /** Show the Copy button (default). Off for patients integrated with an EHR: the note is sent, not copied. */
  copyable?: boolean;
  className?: string;
}

/**
 * Note (Generated Note Items): a white card, 20px corners, 10px × 12px padding. Header: the title (Figtree Medium
 * 16px) and the Copy Icon Button (secondary, 40px); a hairline; then the text (Figtree Regular 13px, 1.3 line height).
 * Copy shows a check for a moment.
 */
export const GeneratedNoteItem = ({ title, children, copyText, onCopy, copyable = true, className }: GeneratedNoteItemProps) => {
  const { copied, copy } = useCopy();
  const text = copyText ?? (typeof children === 'string' ? `${title}\n${children}` : title);
  return (
    <section className={['is-gen-item', className].filter(Boolean).join(' ')}>
      <header className="is-gen-item__header">
        <h3 className="is-gen-item__title">{title}</h3>
        {copyable && (
        <IconButton
          variant="secondary"
          size="regular"
          icon={<Icon name={copied ? 'check' : 'copy'} />}
          label={copied ? `${title} copied` : `Copy ${title}`}
          onClick={() => {
            copy(text);
            onCopy?.();
          }}
        />
        )}
      </header>
      <hr className="is-gen-item__divider" />
      <div className="is-gen-item__text">{children}</div>
    </section>
  );
};

export interface TranscriptLine {
  /** "00:00:02" */
  time: string;
  text: string;
}

export const generatedNoteTabs: TabsOption[] = [
  { value: 'transcript', label: 'Transcript' },
  { value: 'note', label: 'Note' },
];

export type GeneratedNoteTab = 'transcript' | 'note';

export interface GeneratedNoteFrameProps {
  /** Selected tab (controlled). Leave undefined to let the frame manage it. */
  tab?: GeneratedNoteTab;
  /** Initially selected tab when uncontrolled (default: Note) */
  defaultTab?: GeneratedNoteTab;
  onTabChange?: (tab: GeneratedNoteTab) => void;
  /** The generated note's sections */
  sections: GeneratedNoteSection[];
  /** The visit's transcript, one line per timestamp */
  transcript: TranscriptLine[];
  /** Initial text in the transcript search */
  defaultSearch?: string;
  /**
   * Show the copy buttons (Copy Transcript / Copy All and each section's Copy). Default on: for patients that aren't
   * integrated with an EHR, whose note is copied over. Off for integrated patients, whose note is sent to the EHR.
   */
  copyable?: boolean;
  className?: string;
}

/** Splits a line around the search matches, so they can be highlighted */
const highlight = (text: string, query: string) => {
  const q = query.trim();
  if (!q) return text;
  const parts = text.split(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
  return parts.map((p, i) => (i % 2 ? <mark key={i}>{p}</mark> : p));
};

/**
 * RTN Main Frame (Generated Note): the 30px rounded panel (as RTN Main Frame), with the Transcript · Note Tabs
 * (Web, 240px) and Copy Transcript / Copy All (secondary Button, 40px) on top; below, on the soft background, either
 * the transcript with its search field or the note sections 20px apart. Search highlights the matches and hides the
 * lines without any.
 */
export const GeneratedNoteFrame = ({
  tab: tabProp,
  defaultTab = 'note',
  onTabChange,
  sections,
  transcript,
  defaultSearch = '',
  copyable = true,
  className,
}: GeneratedNoteFrameProps) => {
  const [own, setOwn] = useState<GeneratedNoteTab>(defaultTab);
  const tab = tabProp ?? own;
  const [query, setQuery] = useState(defaultSearch);
  const { copied, copy } = useCopy();
  const lines = query.trim() ? transcript.filter((l) => `${l.time} ${l.text}`.toLowerCase().includes(query.trim().toLowerCase())) : transcript;
  const copyAll = () =>
    tab === 'transcript'
      ? copy(transcript.map((l) => `[${l.time}] ${l.text}`).join('\n\n'))
      : copy(sections.map((s) => `${s.title}\n${s.text}`).join('\n\n'));
  const label = tab === 'transcript' ? 'Copy Transcript' : 'Copy All';

  return (
    <div className={['is-rtn-frame', 'is-rtn-frame--web', 'is-gen-frame', className].filter(Boolean).join(' ')}>
      <div className="is-rtn-frame__tabs is-gen-frame__top">
        <Tabs
          device="web"
          width={240}
          options={generatedNoteTabs}
          value={tab}
          onChange={(v) => {
            if (tabProp === undefined) setOwn(v as GeneratedNoteTab);
            onTabChange?.(v as GeneratedNoteTab);
          }}
          aria-label="Generated note"
        />
        {copyable && (
          <Button variant="secondary" size="regular" iconLeft={<Icon name={copied ? 'check' : 'copy'} />} onClick={copyAll}>
            {copied ? 'Copied' : label}
          </Button>
        )}
      </div>
      <div className="is-rtn-frame__note">
        {tab === 'transcript' ? (
          <>
            <label className="is-gen-search">
              <Icon name="search" size={20} />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search in transcript..."
                aria-label="Search in transcript"
              />
              {query && (
                <button type="button" className="is-gen-search__clear" aria-label="Clear search" onClick={() => setQuery('')}>
                  <Icon name="close" size={12} />
                </button>
              )}
            </label>
            <div className="is-gen-transcript">
              {lines.map((l) => (
                <p key={l.time}>
                  [{l.time}] {highlight(l.text, query)}
                </p>
              ))}
              {lines.length === 0 && <p className="is-gen-transcript__empty">No matches in the transcript.</p>}
            </div>
          </>
        ) : (
          <div className="is-rtn-frame__list">
            {sections.map((s) => (
              <GeneratedNoteItem key={s.id} title={s.title} copyable={copyable}>
                {s.text}
              </GeneratedNoteItem>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
