export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ ok: false, error: "Método no permitido" });
    }

    // Evitar error por JSON vacío
    let body;
    try {
      body = req.body;
    } catch (err) {
      return res.status(400).json({ ok: false, error: "JSON inválido" });
    }

    const { fecha, activado } = body;

    if (!fecha) {
      return res.status(400).json({ ok: false, error: "Falta fecha" });
    }

    const NOTION_KEY = process.env.NOTION_KEY;
    const DATABASE_ID = process.env.DATABASE_ID;

    // Petición a Notion usando fetch nativo
    const response = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${NOTION_KEY}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        parent: { database_id: DATABASE_ID },
        properties: {
          Fecha: { date: { start: fecha } },
          Activado: { checkbox: activado === true }
        }
      })
    });

    const data = await response.json();

    return res.status(200).json({ ok: true, data });

  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message });
  }
}
