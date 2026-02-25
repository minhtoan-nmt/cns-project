const BACKEND =
  process.env.VITE_API_BASE_URL?.trim?.() ||
  process.env.VITE_API_BASE_URL ||
  "https://cns-backend-8v53.onrender.com";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const backendUrl = BACKEND.replace(/\/$/, "") + "/auth/register";
    const fwd = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body || {}),
    });
    const text = await fwd.text();
    const contentType = fwd.headers.get("content-type") || "application/json";
    res.status(fwd.status).setHeader("Content-Type", contentType).send(text);
  } catch (e) {
    console.error("Register proxy error:", e);
    res.status(502).json({
      message: "Không kết nối được máy chủ. Vui lòng thử lại sau.",
      error: e.message,
    });
  }
}
