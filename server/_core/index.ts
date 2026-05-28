import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter, handleAudioProxy } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  registerStorageProxy(app);
  registerOAuthRoutes(app);
  
  /**
   * Audio Proxy Endpoint - Serves audio files from external CDNs without CORS restrictions
   * 
   * Problem Solved:
   * - Browsers block direct cross-origin audio playback (CORS policy)
   * - Users couldn't play audio from external CDNs
   * - Progress slider seeking didn't work
   * 
   * Solution:
   * - Server fetches audio from CDN (no CORS restrictions on server-to-server)
   * - Streams audio to browser with proper CORS headers
   * - Supports HTTP 206 Partial Content for seeking/scrubbing
   * 
   * How It Works:
   * 1. Browser requests /api/audio-proxy?url=<external-audio-url>
   * 2. Server fetches audio from external URL
   * 3. If browser sends Range header (e.g., "bytes=0-1023"), return only those bytes
   * 4. If no Range header, return entire file
   * 
   * This allows users to:
   * - Play audio without CORS errors
   * - Drag progress slider to seek to any position
   * - Stream large files efficiently (only download what's needed)
   */
  app.get("/api/audio-proxy", async (req, res) => {
    try {
      // Extract the external audio URL from query parameters
      const fileUrl = req.query.url as string;
      if (!fileUrl) {
        return res.status(400).json({ error: "Missing url parameter" });
      }
      
      // Fetch audio from external CDN and convert to buffer
      const response = await handleAudioProxy(fileUrl);
      const buffer = await response.arrayBuffer();
      const totalSize = buffer.byteLength;
      
      // Set response headers for audio streaming
      res.setHeader("Content-Type", "audio/mpeg");
      res.setHeader("Cache-Control", "public, max-age=3600"); // Cache for 1 hour
      res.setHeader("Access-Control-Allow-Origin", "*"); // Allow cross-origin requests
      res.setHeader("Accept-Ranges", "bytes"); // Tell browser we support range requests
      
      // Handle HTTP Range requests for seeking/scrubbing
      // When user drags progress slider, browser sends: "Range: bytes=0-1023"
      const rangeHeader = req.headers.range;
      if (rangeHeader) {
        // Parse range header to extract start and end byte positions
        // Example: "bytes=1000-2000" means bytes 1000 through 2000
        const parts = rangeHeader.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : totalSize - 1;
        
        // Validate range is within file bounds
        if (start >= totalSize || end >= totalSize || start > end) {
          // Return 416 Range Not Satisfiable if range is invalid
          res.status(416).set("Content-Range", `bytes */${totalSize}`).end();
          return;
        }
        
        // Return 206 Partial Content with only the requested byte range
        // This tells browser the range request was successful
        res.status(206);
        res.setHeader("Content-Range", `bytes ${start}-${end}/${totalSize}`);
        res.setHeader("Content-Length", end - start + 1);
        res.send(Buffer.from(buffer).slice(start, end + 1));
      } else {
        // If no range requested, send entire file
        res.setHeader("Content-Length", totalSize);
        res.send(Buffer.from(buffer));
      }
    } catch (error) {
      // Log error for debugging and return 500 error to client
      console.error("Audio proxy error:", error);
      res.status(500).json({ error: "Failed to proxy audio" });
    }
  });
  
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
