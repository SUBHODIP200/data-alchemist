const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY as string;

export async function mapHeadersWithGemini(headers: string[], entityType: 'clients' | 'workers' | 'tasks') {
  const prompt = `
You're a smart CSV header corrector. The user uploaded a ${entityType}.csv file with incorrect or misspelled column names.

Your task is to map each of these headers to the correct schema fields.

Here are the correct headers for each entity:

clients:
- ClientID
- ClientName
- PriorityLevel
- RequestedTaskIDs
- GroupTag
- AttributesJSON

workers:
- WorkerID
- WorkerName
- Skills
- AvailableSlots
- MaxLoadPerPhase
- WorkerGroup
- QualificationLevel

tasks:
- TaskID
- TaskName
- Category
- Duration
- RequiredSkills
- PreferredPhases
- MaxConcurrent

Now, for this input header list: ${JSON.stringify(headers)}

Return a JSON mapping like:
{
  "client id": "ClientID",
  "priority": "PriorityLevel",
  ...
}
Only include the headers provided by the user in the output.
`;

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });

  const data = await res.json();
  const output = data.candidates?.[0]?.content?.parts?.[0]?.text;

  try {
    return JSON.parse(output || '{}');
  } catch (err) {
    console.error('Error parsing Gemini response', err);
    return {};
  }
}
