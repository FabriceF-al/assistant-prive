// ============================================================
//  PROXY NOTION — Vercel Serverless Function
//  Fichier : api/notion.js
//  Ce fichier tourne sur Vercel et fait le lien entre
//  ton interface HTML et l'API Notion.
// ============================================================

// ⚠ Colle ta clé API Notion ici :
const NOTION_KEY = process.env.NOTION_KEY || "secret_XXXXXXXXXXXXXXXXXX";

export default async function handler(req, res) {
  // CORS — autorise ton interface à appeler ce proxy
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  const { method, body, query } = req;
  const notionUrl = "https://api.notion.com/v1/" + (query.path || "");

  try {
    const resp = await fetch(notionUrl, {
      method: method === "GET" ? "GET" : method,
      headers: {
        "Authorization": "Bearer " + NOTION_KEY,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28"
      },
      body: method !== "GET" ? JSON.stringify(body) : undefined
    });

    const data = await resp.json();
    return res.status(resp.status).json(data);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
