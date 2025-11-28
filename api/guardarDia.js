export default async function handler(req, res) {
  try {
    // Asegurar método POST
    if (req.method !== "POST") {
      return res.status(405).json({ ok: false, error: "Método no permitido" });
    }

    // Validar body
    const { fecha, activado } = req.body || {};

    if (!fecha) {
      return res.status(400).json({
        ok: false,
        error: "Falta la propiedad 'fecha'"
      });
    }

    // Variables de entorno (colócalas en Vercel → Settings → Environment Variables)
    const NOTION_KEY = process.env.NOTION_KEY;
    const DATABASE_ID = process.env.DATABASE_ID;

    if (!NOTION_KEY || !DATABASE_ID) {
      return res.status(500).json({
        ok: false,
        error: "Faltan variables de entorno NOTION_KEY o DATABASE_ID"
      });
    }

    // Llamada a Notion API
    const response = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${NOTION_KEY}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        parent: { database_id: DATABASE_ID },
        properties: {
          Fecha: {
            date: { start: fecha }
          },
          Activado: {
            checkbox: activado === true
          }
        }
      })
    });

    const data = await response.json();

    return res.status(200).json({ ok: true, data });

  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message
    });
  }
}
