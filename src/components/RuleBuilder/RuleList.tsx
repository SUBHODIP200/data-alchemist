'use client';

import { Rule } from '@/types/rules';

export default function RuleList({ rules }: { rules: Rule[] }) {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">📄 Current Rules:</h3>
      {rules.length === 0 && <p className="text-gray-500">No rules added yet.</p>}
      <ul className="list-disc ml-6 text-sm">
        {rules.map((rule, i) => (
          <li key={i}>
            <pre className="whitespace-pre-wrap text-gray-800">{JSON.stringify(rule, null, 2)}</pre>
          </li>
        ))}
      </ul>
    </div>
  );
}
