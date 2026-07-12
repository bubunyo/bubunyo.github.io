// Link checker for the built site in dist/.
//
// linkinator's built-in static server crashes on Node >= 26 (it reads
// server.address().port synchronously before the socket is bound, which now
// returns null). We sidestep that bug entirely: linkinator only spins up its
// own server for filesystem paths — given an http:// URL it just crawls it.
// So we serve dist/ ourselves (awaiting the `listening` callback, which is
// where the port is actually available) and point linkinator at the URL.

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { LinkChecker } from "linkinator";

const rootDir = fileURLToPath(new URL("../dist/", import.meta.url));

const MIME = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".json": "application/json",
  ".xml": "application/xml",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ttf": "font/ttf",
  ".txt": "text/plain",
};

async function resolveFile(pathname) {
  let p = decodeURIComponent(pathname);
  if (p.endsWith("/")) p += "index.html";
  const file = join(rootDir, normalize(p));
  try {
    const s = await stat(file);
    if (s.isDirectory()) {
      const idx = join(file, "index.html");
      await stat(idx);
      return idx;
    }
    return file;
  } catch {
    return null;
  }
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  const file = await resolveFile(url.pathname);
  if (!file) {
    res.statusCode = 404;
    res.end("Not found");
    return;
  }
  try {
    const body = await readFile(file);
    res.setHeader("Content-Type", MIME[extname(file).toLowerCase()] ?? "application/octet-stream");
    res.end(body);
  } catch {
    res.statusCode = 404;
    res.end("Not found");
  }
});

const port = await new Promise((resolve, reject) => {
  server.on("error", reject);
  server.listen(0, "127.0.0.1", () => resolve(server.address().port));
});

try {
  const checker = new LinkChecker();
  const result = await checker.check({
    path: `http://localhost:${port}/`,
    recurse: true,
    linksToSkip: ["^https?://(?!localhost)"],
  });

  const broken = result.links.filter((l) => l.state === "BROKEN");
  if (broken.length > 0) {
    console.error(`\n✖ ${broken.length} broken link(s) of ${result.links.length} checked:`);
    for (const b of broken) {
      console.error(`  [${b.status ?? "ERR"}] ${b.url}${b.parent ? `\n        ↳ linked from ${b.parent}` : ""}`);
    }
    process.exitCode = 1;
  } else {
    console.log(`✓ No broken links (${result.links.length} checked).`);
  }
} finally {
  server.close();
}
