import { useState } from 'react';
import { Animation, type AnimationTheme } from '../animations/Animation';
import { animationNames, animations, type AnimationData, type AnimationName } from '../animations/animations';
import { lottieInfo } from '../icons/animatedIcons';
import { Icon } from '../icons/Icon';
import './AnimatedIconGallery.css';
import './AnimationGallery.css';

const sizes = [120, 180, 240, 360] as const;
const themes: { value: AnimationTheme; label: string }[] = [
  { value: 'auto', label: 'Follow mode' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

/** One animation: a preview you can replay, its timing and versions, and copyable code. Same layout as Animated Icons. */
const Tile = ({ name, size, theme }: { name: AnimationName; size: number; theme: AnimationTheme }) => {
  const animation: AnimationData = animations[name];
  const info = lottieInfo(animation.light);
  const [run, setRun] = useState(0);
  const [copied, setCopied] = useState(false);
  const code = `<Animation name="${name}"${theme === 'auto' ? '' : ` theme="${theme}"`} />`;
  const copy = () => {
    navigator.clipboard?.writeText(code).catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };
  const height = Math.round((size * info.height) / info.width);

  return (
    <article className="is-anim-tile is-anim-tile--wide">
      {/* The stage takes the chosen mode's background, so each version is seen where it will be used */}
      <button
        type="button"
        className="is-anim-tile__stage is-animation-stage"
        data-theme={theme === 'auto' ? undefined : theme}
        onClick={() => setRun((r) => r + 1)}
        title="Replay"
      >
        <Animation key={`${run}-${size}-${theme}`} name={name} theme={theme} width={size} height={height} />
        <span className="is-anim-tile__replay">
          <Icon name="reload" size={12} /> Replay
        </span>
      </button>

      <div className="is-anim-tile__meta">
        <h3 className="is-anim-tile__name">{name}</h3>
        <p className="is-anim-tile__desc">{animation.description}</p>
        <dl className="is-anim-tile__facts">
          <dt>Length</dt>
          <dd>
            {info.seconds.toFixed(2)}s · {info.frames} frames at {info.fps}fps, loops
          </dd>
          <dt>Size</dt>
          <dd>
            {info.width} × {info.height}
          </dd>
          <dt>Versions</dt>
          <dd>{animation.dark ? 'Light and dark' : 'One, for both modes'}</dd>
        </dl>
        <button type="button" className="is-anim-tile__code" onClick={copy} title="Copy code">
          {copied ? 'Copied!' : code}
        </button>
      </div>
    </article>
  );
};

/** Every animation, with size and light / dark controls. */
export const AnimationGallery = () => {
  const [size, setSize] = useState<(typeof sizes)[number]>(180);
  const [theme, setTheme] = useState<AnimationTheme>('auto');

  return (
    <div className="is-anim-gallery sb-unstyled">
      <div className="is-anim-gallery__bar">
        <div className="is-anim-gallery__group" role="group" aria-label="Preview size">
          {sizes.map((s) => (
            <button key={s} type="button" aria-pressed={size === s} onClick={() => setSize(s)}>
              {s}px
            </button>
          ))}
        </div>
        <div className="is-anim-gallery__group" role="group" aria-label="Version">
          {themes.map((t) => (
            <button key={t.value} type="button" aria-pressed={theme === t.value} onClick={() => setTheme(t.value)}>
              {t.label}
            </button>
          ))}
        </div>
      </div>
      {animationNames.map((name) => (
        <Tile key={name} name={name} size={size} theme={theme} />
      ))}
    </div>
  );
};
