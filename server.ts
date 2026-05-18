import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import { calculateAstrology } from "./src/lib/astrology/engine.ts";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API routes
  app.post("/api/calculate", async (req, res) => {
    try {
      const { name, dob, tob, lat, lon, gender } = req.body;
      const data = await calculateAstrology({ name, dob, tob, lat: parseFloat(lat), lon: parseFloat(lon), gender });
      res.json(data);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
