import { useState } from 'react';
import { AnimatedIcon } from '../icons/AnimatedIcon';
import { Icon } from '../icons/Icon';
import { animatedIconNames, animatedIcons, lottieInfo, type AnimatedIconName } from '../icons/animatedIcons';
import type { IconName } from '../icons/icons';
import './AnimatedIconGallery.css';

const sizes = [24, 32, 48, 64] as const;

/** One animated icon: a large preview you can replay, its timing and markers, and copyable code. */
const Tile = ({ name, size, loop, onDark }: { name: AnimatedIconName; size: number; loop: boolean; onDark: boolean }) => {
  const icon = animatedIcons[name];
  const info = lottieInfo(icon.data);
  const [run, setRun] = useState(0);
  const [lastMarker, setLastMarker] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const code = `<AnimatedIcon name="${name}" size={${size}} />`;

  const replay = () => {
    setLastMarker(null);
    setRun((r) => r + 1);
  };
  const copy = () => {
    navigator.clipboard?.writeText(code).catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <article className="is-anim-tile">
      <button
        type="button"
        className={`is-anim-tile__stage${onDark ? ' is-anim-tile__stage--dark' : ''}`}
        onClick={replay}
        title="Replay"
      >
        <AnimatedIcon
          key={`${run}-${size}-${loop}`}
          name={name}
          size={size}
          loop={loop}
          onMarker={setLastMarker}
          fallback={icon.startsFrom ? <Icon name={icon.startsFrom as IconName} size={size} /> : undefined}
        />
        <span className="is-anim-tile__replay">
          <Icon name="reload" size={12} /> Replay
        </span>
      </button>

      <div className="is-anim-tile__meta">
        <h3 className="is-anim-tile__name">{name}</h3>
        <p className="is-anim-tile__desc">{icon.description}</p>
        <dl className="is-anim-tile__facts">
          <dt>Length</dt>
          <dd>
            {info.seconds.toFixed(2)}s · {info.frames} frames at {info.fps}fps
          </dd>
          <dt>Grid</dt>
          <dd>
            {info.width} × {info.height}
          </dd>
          {icon.startsFrom && (
            <>
              <dt>Starts from</dt>
              <dd>
                <Icon name={icon.startsFrom as IconName} size={14} /> {icon.startsFrom}
              </dd>
            </>
          )}
          {icon.markers && (
            <>
              <dt>Markers</dt>
              <dd className="is-anim-tile__markers">
                {Object.entries(icon.markers).map(([marker, frame]) => (
                  <span key={marker} className={lastMarker === marker ? 'is-active' : undefined}>
                    {marker} <small>frame {frame}</small>
                  </span>
                ))}
              </dd>
            </>
          )}
        </dl>
        <button type="button" className="is-anim-tile__code" onClick={copy} title="Copy code">
          {copied ? 'Copied!' : code}
        </button>
      </div>
    </article>
  );
};

/** Every animated icon, with size, loop and background controls. */
export const AnimatedIconGallery = () => {
  const [size, setSize] = useState<(typeof sizes)[number]>(48);
  const [loop, setLoop] = useState(false);
  const [onDark, setOnDark] = useState(false);

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
        <div className="is-anim-gallery__group">
          <button type="button" aria-pressed={loop} onClick={() => setLoop((l) => !l)}>
            Loop
          </button>
          <button type="button" aria-pressed={onDark} onClick={() => setOnDark((d) => !d)}>
            On accent
          </button>
        </div>
      </div>
      {animatedIconNames.map((name) => (
        <Tile key={name} name={name} size={size} loop={loop} onDark={onDark} />
      ))}
    </div>
  );
};
