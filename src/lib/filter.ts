const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY as string;

export async function getFilterFunction(query: string, entityType: string, sampleRow: any): Promise<(row: any) => boolean> {
  const prompt = `
Given a ${entityType} row like this:
${JSON.stringify(sampleRow)}

Interpret this plain English filter query:
"${query}"

Write a JavaScript function body that returns true if the row matches the condition.
Use only row.FIELD_NAME access style. No extra comments. No function wrapper.
Example output:
return row.Duration > 1 && row.PreferredPhases.includes("2");

Now return the condition:
`;

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });

  const raw = await res.json();
  const jsCode = raw.candidates?.[0]?.content?.parts?.[0]?.text || '';

  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function('row', jsCode);
    return fn as (row: any) => boolean;
  } catch (e) {
    console.error('Invalid filter function:', jsCode);
    return () => true;
  }
}
