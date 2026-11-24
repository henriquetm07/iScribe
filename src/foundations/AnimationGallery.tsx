import { useState } from 'react';
import { Animation } from '../animations/Animation';
import { animationNames, animations, type AnimationData, type AnimationName } from '../animations/animations';
import { lottieInfo } from '../icons/animatedIcons';
import { Icon } from '../icons/Icon';
import { Button } from '../components/Button/Button';
import './AnimatedIconGallery.css';
import './AnimationGallery.css';

const sizes = [120, 180, 240, 360] as const;

/** Save a Lottie JSON as a file */
const download = (data: object, file: string) => {
  const url = URL.createObjectURL(new Blob([JSON.stringify(data)], { type: 'application/json' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = file;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};

/**
 * One animation: a preview you can replay, its timing and versions, and copyable code. Same layout as Animated Icons.
 * The preview follows the site's Light / Dark toggle, like the animation does in the product.
 */
const Tile = ({ name, size }: { name: AnimationName; size: number }) => {
  const animation: AnimationData = animations[name];
  const info = lottieInfo(animation.light);
  const [run, setRun] = useState(0);
  const [copied, setCopied] = useState(false);
  const code = `<Animation name="${name}" />`;
  const copy = () => {
    navigator.clipboard?.writeText(code).catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };
  const height = Math.round((size * info.height) / info.width);

  return (
    <article className="is-anim-tile is-anim-tile--wide">
      {/* The stage is the page background, so each version is seen where it will be used */}
      <button
        type="button"
        className="is-anim-tile__stage is-animation-stage"
        onClick={() => setRun((r) => r + 1)}
        title="Replay"
      >
        <Animation key={`${run}-${size}`} name={name} width={size} height={height} />
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
        {/* The Lottie JSON files, to download (light and dark when there are both) */}
        <div className="is-anim-tile__downloads">
          <Button variant="secondary" size="small" iconLeft={<Icon name="download" />} onClick={() => download(animation.light, `${name}${animation.dark ? '-light' : ''}.json`)}>
            {animation.dark ? 'Light JSON' : 'Download JSON'}
          </Button>
          {animation.dark && (
            <Button variant="secondary" size="small" iconLeft={<Icon name="download" />} onClick={() => download(animation.dark!, `${name}-dark.json`)}>
              Dark JSON
            </Button>
          )}
        </div>
      </div>
    </article>
  );
};

/** Every animation, with size controls. Light / dark follows the site's toggle. */
export const AnimationGallery = () => {
  const [size, setSize] = useState<(typeof sizes)[number]>(180);

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
      </div>
      {animationNames.map((name) => (
        <Tile key={name} name={name} size={size} />
      ))}
    </div>
  );
};
