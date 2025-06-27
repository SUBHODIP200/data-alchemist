'use client';

import { useState } from 'react';
import RuleForm from './RuleForm';
import RuleList from './RuleList';
import { Rule } from '@/types/rules';
import { saveAs } from 'file-saver';
import NaturalLanguageRule from './NaturalLanguageRule';


export default function RuleBuilder() {
  const [rules, setRules] = useState<Rule[]>([]);

  const addRule = (rule: Rule) => setRules([...rules, rule]);

  const exportRules = () => {
    const blob = new Blob([JSON.stringify({ rules }, null, 2)], { type: 'application/json' });
    saveAs(blob, 'rules.json');
  };

  return (
    <section className="mt-10 space-y-4">
      <h2 className="text-2xl font-bold">📐 Rule Builder</h2>
      <RuleForm onAdd={addRule} />
      <NaturalLanguageRule onAdd={addRule} />
      <RuleList rules={rules} />
      <button onClick={exportRules} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
        Export Rules JSON
      </button>
    </section>
  );
}
