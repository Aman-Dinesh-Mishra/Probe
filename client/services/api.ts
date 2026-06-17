const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function analyzeCode(code: string) {
  const response = await fetch(`${API_URL}/api/debug/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      codeSnippet: code,
      errorPayload: {
        message: "Manual Debug Request",
      },
    }),
  });

  return response.json();
}
