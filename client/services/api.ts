export async function analyzeCode(code: string) {
  const response = await fetch("http://localhost:5000/api/debug", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code }),
  });

  return response.json();
}
