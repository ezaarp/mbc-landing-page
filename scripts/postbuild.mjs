// Post-build: publish the route-less SPA shell as 404.html if emitted by prerender.
import { copyFile, access } from "node:fs/promises";
import path from "node:path";

const clientDir = path.join(process.cwd(), "build", "client");
const src = path.join(clientDir, "__spa-fallback.html");
const dest = path.join(clientDir, "404.html");

try {
  await access(src);
  await copyFile(src, dest);
  console.log("postbuild: 404.html <- __spa-fallback.html");
} catch {
  console.log("postbuild: skipping static 404 copy (SSR mode active or fallback not emitted)");
}
