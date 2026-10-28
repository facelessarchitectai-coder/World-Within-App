import { useState } from 'react';
import { getUserApiKey, setUserApiKey } from '../services/gemini';

export default function ApiKeyPanel() {
  const [value, setValue] = useState(getUserApiKey());
  const [saved, setSaved] = useState(!!getUserApiKey());

  const save = () => {
    setUserApiKey(value);
    setSaved(!!value.trim());
  };

  return (
    <div className="px-8 pt-6 pb-2 border-t border-white/5">
      <p className="font-mono text-[9px] tracking-[2px] text-ww-cyan opacity-60 uppercase mb-2">Your Gemini Key</p>
      <input
        type="password"
        value={value}
        onChange={e => { setValue(e.target.value); setSaved(false); }}
        placeholder="Paste your key"
        className="w-full bg-white/5 border border-white/10 px-3 py-2 text-[11px] text-white font-mono outline-none focus:border-ww-cyan"
      />
      <button
        onClick={save}
        className="mt-2 w-full border border-ww-cyan/40 py-2 text-[9px] font-mono tracking-[2px] uppercase text-ww-cyan hover:bg-ww-cyan/10"
      >
        {saved ? 'Key Saved' : 'Save Key'}
      </button>
      <p className="mt-2 text-[9px] text-white/40 leading-relaxed">
        Free from{' '}
        <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer" className="underline">aistudio.google.com/apikey</a>.
        Saved only in this browser.
      </p>
    </div>
  );
}
