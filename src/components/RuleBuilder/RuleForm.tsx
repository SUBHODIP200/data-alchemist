'use client';

import { useState } from 'react';
import { Rule } from '@/types/rules';

type Props = {
  onAdd: (rule: Rule) => void;
};

export default function RuleForm({ onAdd }: Props) {
  const [type, setType] = useState('coRun');

  const [taskIds, setTaskIds] = useState('');
  const [group, setGroup] = useState('');
  const [minSlots, setMinSlots] = useState(1);
  const [maxSlots, setMaxSlots] = useState(1);
  const [taskId, setTaskId] = useState('');
  const [phases, setPhases] = useState('');
  const [regex, setRegex] = useState('');
  const [template, setTemplate] = useState('');
  const [params, setParams] = useState('');

  const handleAdd = () => {
    let rule: Rule | null = null;

    if (type === 'coRun') {
      rule = { type: 'coRun', tasks: taskIds.split(',').map((s) => s.trim()) };
    } else if (type === 'slotRestriction') {
      rule = { type: 'slotRestriction', group, minCommonSlots: minSlots };
    } else if (type === 'loadLimit') {
      rule = { type: 'loadLimit', group, maxSlotsPerPhase: maxSlots };
    } else if (type === 'phaseWindow') {
      rule = { type: 'phaseWindow', taskId, allowedPhases: phases.split(',').map(Number) };
    } else if (type === 'patternMatch') {
      rule = { type: 'patternMatch', regex, template, params: params.split(',').map((s) => s.trim()) };
    }

    if (rule) {
      onAdd(rule);
      setTaskIds('');
      setGroup('');
      setMinSlots(1);
      setMaxSlots(1);
      setTaskId('');
      setPhases('');
      setRegex('');
      setTemplate('');
      setParams('');
    }
  };

  return (
    <div className="space-y-2 p-4 border rounded bg-gray-50">
      <select value={type} onChange={(e) => setType(e.target.value)} className="p-2 border rounded">
        <option value="coRun">Co-run</option>
        <option value="slotRestriction">Slot Restriction</option>
        <option value="loadLimit">Load Limit</option>
        <option value="phaseWindow">Phase Window</option>
        <option value="patternMatch">Pattern Match</option>
      </select>

      {type === 'coRun' && (
        <input value={taskIds} onChange={(e) => setTaskIds(e.target.value)} placeholder="Task IDs (comma-separated)" className="w-full p-2 border" />
      )}
      {type === 'slotRestriction' && (
        <>
          <input value={group} onChange={(e) => setGroup(e.target.value)} placeholder="Group name" className="w-full p-2 border" />
          <input type="number" value={minSlots} onChange={(e) => setMinSlots(+e.target.value)} className="w-full p-2 border" placeholder="Min common slots" />
        </>
      )}
      {type === 'loadLimit' && (
        <>
          <input value={group} onChange={(e) => setGroup(e.target.value)} placeholder="Worker group" className="w-full p-2 border" />
          <input type="number" value={maxSlots} onChange={(e) => setMaxSlots(+e.target.value)} className="w-full p-2 border" placeholder="Max slots per phase" />
        </>
      )}
      {type === 'phaseWindow' && (
        <>
          <input value={taskId} onChange={(e) => setTaskId(e.target.value)} placeholder="Task ID" className="w-full p-2 border" />
          <input value={phases} onChange={(e) => setPhases(e.target.value)} placeholder="Phases (comma-separated)" className="w-full p-2 border" />
        </>
      )}
      {type === 'patternMatch' && (
        <>
          <input value={regex} onChange={(e) => setRegex(e.target.value)} placeholder="Regex" className="w-full p-2 border" />
          <input value={template} onChange={(e) => setTemplate(e.target.value)} placeholder="Template" className="w-full p-2 border" />
          <input value={params} onChange={(e) => setParams(e.target.value)} placeholder="Params (comma-separated)" className="w-full p-2 border" />
        </>
      )}

      <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-2 rounded">
        ➕ Add Rule
      </button>
    </div>
  );
}
