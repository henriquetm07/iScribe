import { Controls, Description, Primary, Stories, Subtitle, Title, useOf } from '@storybook/addon-docs/blocks';
import '../src/components/Button/Button.css';

/*
 * The docs page of every component: Storybook's own (title, text, the first story, controls, the other stories)
 * with "Project in Figma" under the text — a link to the component's page in the Figma file, drawn as a Button
 * Secondary Small with the Figma logo.
 */

const FIGMA_FILE = 'https://www.figma.com/design/tdZfpEpkPrEt8Eakka9Lzt/Design-System--SuperConscious-';

/** The Figma page of each component, by its title in the sidebar (the longest match wins, so a sub-component can have its own) */
const FIGMA_PAGES: Record<string, string> = {
  'Components/Appointment Status': '1067:23721',
  'Components/Bottom Tab': '697:6493',
  'Components/Button': '679:6184',
  'Components/Connectivity Dialog': '3482:15515',
  'Components/Drawer': '731:5793',
  'Components/Drawer/Drawer Header': '915:13996',
  'Components/Dropdown': '731:6298',
  'Components/EHR Icon': '1082:9313',
  'Components/Icon Button': '674:5252',
  'Components/Mic Settings': '3502:6907',
  'Components/Popup Message': '704:6550',
  'Components/Record': '706:6705',
  'Components/RTN Header (Web)': '3320:26730',
  'Components/RTN Notes': '738:862',
  'Components/RTN Notes/RTN Main Frame (Previous Note)': '812:8868',
  'Components/RTN Notes/RTN Main Frame (Generated Note)': '3628:16775',
  'Components/RTN Notes/RTN Item (Generated Note)': '3628:16775',
  'Components/Schedule List': '1133:6822',
  'Components/Schedule Side Bar': '1133:4037',
  'Components/Selection List': '743:6526',
  'Components/Tabs': '1061:21180',
  'Components/Toast': '778:7051',
  'Components/Toggle': '674:5045',
  'Components/Tooltip - Web': '3404:17227',
  'Components/Web Nav Bar': '1031:7813',
  'Components/Web Note Bottom Bar': '3624:4200',
};

export const figmaUrlFor = (title = '') => {
  const key = Object.keys(FIGMA_PAGES)
    .filter((k) => title === k || title.startsWith(`${k}/`))
    .sort((a, b) => b.length - a.length)[0];
  return key ? `${FIGMA_FILE}?node-id=${FIGMA_PAGES[key].replace(':', '-')}` : undefined;
};

/** The Figma logo (sized to the button's icon in preview-head.html) */
const FigmaLogo = () => (
  <svg width="20" height="20" viewBox="0 0 38 57" aria-hidden="true" focusable="false">
    <path fill="#1abcfe" d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" />
    <path fill="#0acf83" d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" />
    <path fill="#ff7262" d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" />
    <path fill="#f24e1e" d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" />
    <path fill="#a259ff" d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" />
  </svg>
);

const FigmaLink = () => {
  const meta = useOf('meta');
  const url = figmaUrlFor(meta.preparedMeta.title);
  if (!url) return null;
  return (
    <a className="is-button is-button--secondary is-button--small is-docs-figma" href={url} target="_blank" rel="noreferrer">
      <span className="is-button__icon" aria-hidden="true">
        <FigmaLogo />
      </span>
      <span className="is-button__label">Project in Figma</span>
    </a>
  );
};

/** The controls of the first story, unless the component sets docs.controls to false (its canvas has its own) */
const MainControls = () => {
  const meta = useOf('meta');
  if (meta.preparedMeta.parameters?.docs?.controls === false) return null;
  return <Controls />;
};

export const DocsPage = () => (
  <>
    <Title />
    <Subtitle />
    <Description />
    <FigmaLink />
    <Primary />
    <MainControls />
    <Stories />
  </>
);
