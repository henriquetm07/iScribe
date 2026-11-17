import { useState } from 'react';
import {
  RtnBilling,
  RtnDiagnosis,
  RtnEditing,
  RtnImage,
  RtnItem,
  RtnItemContent,
  RtnOrder,
  RtnText,
  type RtnDevice,
  type RtnTopic,
} from './RTNItems';

export const xraySample = './samples/xray-sample.jpg';

export type RtnSampleState = 'empty' | 'filled' | 'edit' | 'reordering';

const PRO_DOC_TEXT =
  'Blood pressure measurement performed using automated cuff. Patient remained seated for 5 minutes prior to measurement.';

/**
 * A working RTN Item with the Figma sample content for each topic. Entries can be removed, the Pro Doc text edited,
 * the diagnosis toggled and the billing codes reordered.
 */
export const RtnSample = ({ device = 'web', topic, state = 'filled', onAdd }: { device?: RtnDevice; topic: RtnTopic; state?: RtnSampleState; onAdd?: () => void }) => {
  const [removed, setRemoved] = useState<string[]>([]);
  const [editing, setEditing] = useState(state === 'edit');
  const [text, setText] = useState(PRO_DOC_TEXT);
  const [draft, setDraft] = useState(PRO_DOC_TEXT);
  const [caption, setCaption] = useState('');
  const [active, setActive] = useState(true);
  const [codes, setCodes] = useState(state === 'reordering' ? ['J45.9', 'J06.9'] : ['J06.9', 'J45.9']);

  const shown = (id: string) => state !== 'empty' && !removed.includes(id);
  const remove = (id: string) => () => setRemoved((r) => [...r, id]);

  const entries = (() => {
    switch (topic) {
      case 'macros':
        return [
          shown('m1') && (
            <RtnItemContent key="m1" device={device} onRemove={remove('m1')}>
              <RtnText device={device}>Review of systems: negative except as noted</RtnText>
            </RtnItemContent>
          ),
        ];
      case 'pro-doc':
        return [
          shown('p1') && (
            <RtnItemContent key="p1" device={device} elevated={!editing} onRemove={remove('p1')}>
              {editing ? (
                <RtnEditing
                  device={device}
                  value={draft}
                  onChange={setDraft}
                  onDiscard={() => { setDraft(text); setEditing(false); }}
                  onSave={(v) => { setText(v); setEditing(false); }}
                />
              ) : (
                <div role="button" tabIndex={0} className="is-rtn-editable" onClick={() => setEditing(true)} onKeyDown={(e) => e.key === 'Enter' && setEditing(true)}>
                  <RtnText device={device} size="large">{text}</RtnText>
                </div>
              )}
            </RtnItemContent>
          ),
          shown('p2') && (
            <RtnItemContent key="p2" device={device} onRemove={remove('p2')}>
              <RtnImage src={xraySample} alt="Chest X-ray" caption={caption} onCaptionChange={setCaption} />
            </RtnItemContent>
          ),
        ];
      case 'diagnoses':
        return [
          shown('d1') && (
            <RtnItemContent key="d1" device={device} onRemove={remove('d1')}>
              <RtnDiagnosis device={device} name="Hypertension, essential" code="I10" active={active} onActiveChange={setActive} />
            </RtnItemContent>
          ),
        ];
      case 'orders':
        return [
          shown('o1') && (
            <RtnItemContent key="o1" device={device} onRemove={remove('o1')}>
              <RtnOrder device={device} name="CBC with differential" />
            </RtnItemContent>
          ),
          shown('o2') && (
            <RtnItemContent key="o2" device={device} onRemove={remove('o2')}>
              <RtnOrder device={device} name="MRI Brain with contrast" alertCode="99870" />
            </RtnItemContent>
          ),
        ];
      case 'billing':
        return [
          shown('b1') && (
            <RtnItemContent key="b1" device={device} onRemove={remove('b1')} tightClose={state === 'reordering'}>
              <RtnBilling
                device={device}
                emCode="99213"
                codes={codes}
                onCodesChange={setCodes}
                reorderingIndex={state === 'reordering' ? 1 : undefined}
              />
            </RtnItemContent>
          ),
        ];
    }
  })().filter(Boolean);

  return (
    <RtnItem device={device} topic={topic} onAdd={onAdd}>
      {entries}
    </RtnItem>
  );
};
