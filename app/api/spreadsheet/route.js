export async function GET(request) {
  const sheetId = "1vzUiWBZ9oYAmZyoioNFkBb6ZwHv1JqN7w-wQZlWrcks";
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
  const range = "'Main Event'";

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;

  const response = await fetch(url);

  const data = await response.json();

  console.log(data);
  return Response.json({ matches: data.values });
}
