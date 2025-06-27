'use client';

import { useState } from 'react';
import { Rule } from '@/types/rules';

type Props = {
  onAdd: (rule: Rule) => void;
};

export default function NaturalLanguageRule({ onAdd }: Props) {
  const [text, setText] = useState('');
  const [suggestedRule, setSuggestedRule] = useState<Rule | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getRuleFromText = async () => {
    setLoading(true);
    setError('');
    setSuggestedRule(null);

    try {
      const res = await fetch('/api/gemini-rule', {
        method: 'POST',
        body: JSON.stringify({ text }),
      });

      const json = await res.json();
      if (json.rule) {
        setSuggestedRule(json.rule);
      } else {
        setError('No rule returned. Try rephrasing.');
      }
    } catch (err) {
      setError('Gemini API failed to respond.');
    }

    setLoading(false);
  };

  const confirm = () => {
    if (suggestedRule) {
      onAdd(suggestedRule);
      setSuggestedRule(null);
      setText('');
    }
  };

  return (
    <div className="space-y-2 border border-gray-300 p-4 rounded bg-gray-50">
      <h3 className="text-lg font-semibold">🧠 Natural Language → Rule</h3>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="e.g. Make T1 and T3 co-run together"
        className="w-full p-2 border rounded"
        rows={2}
      />

      <button
        onClick={getRuleFromText}
        disabled={loading || !text.trim()}
        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
      >
        {loading ? 'Thinking...' : 'Convert with Gemini'}
      </button>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      {suggestedRule && (
        <div className="bg-white p-2 rounded border border-green-400">
          <div className="text-green-800 font-semibold mb-1">✅ Suggested Rule:</div>
          <pre className="text-sm">{JSON.stringify(suggestedRule, null, 2)}</pre>
          <button
            onClick={confirm}
            className="mt-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
          >
            Add This Rule
          </button>
        </div>
      )}
    </div>
  );
}
