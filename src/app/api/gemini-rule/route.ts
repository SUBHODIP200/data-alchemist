import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export async function POST(req: Request) {
  const { text } = await req.json();

  const prompt = `
You are a rule extractor. Convert the following sentence into a JSON rule object.

Supported rule types:
1. coRun: { "type": "coRun", "tasks": ["T1", "T2"] }
2. slotRestriction: { "type": "slotRestriction", "group": "Alpha", "minCommonSlots": 2 }
3. loadLimit: { "type": "loadLimit", "group": "Alpha", "maxSlotsPerPhase": 2 }
4. phaseWindow: { "type": "phaseWindow", "taskId": "T1", "allowedPhases": [1, 2] }
5. patternMatch: { "type": "patternMatch", "regex": ".*Support.*", "template": "AssignToGroup", "params": ["Sales"] }

Input: "${text}"

Return only the JSON object.
`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const raw = response.text();

    const jsonStr = raw.replace(/```json|```/g, '').trim();
    const rule = JSON.parse(jsonStr);
    return NextResponse.json({ rule });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to process prompt' }, { status: 500 });
  }
}
