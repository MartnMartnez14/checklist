// Ejecutor en tiempo real para tests/harness.html.
// Espera a que el harness marque document.title = "DONE" y vuelca el DOM.
// Usa solo Node 24+ (fetch y WebSocket globales), sin dependencias npm.
import { spawn } from "node:child_process";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const url = process.argv[2];
const out = process.argv[3] || "/tmp/harness-dom.html";
if (!url) {
  console.error("Uso: node tests/cdp-run.mjs URL SALIDA");
  process.exit(2);
}

const port = 9335;
const profile = await mkdtemp(join(tmpdir(), "checklist-cdp-"));
const chrome = spawn("google-chrome", [
  "--headless=new", "--no-sandbox", "--disable-gpu",
  "--no-first-run", "--no-default-browser-check",
  "--window-size=1200,2800",
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profile}`,
  url
], { stdio: ["ignore", "ignore", "pipe"] });

let stderr = "";
chrome.stderr.on("data", d => { stderr += d.toString(); });

async function getJson(path) {
  const res = await fetch(`http://127.0.0.1:${port}${path}`);
  return res.json();
}

function stop(code) {
  try { chrome.kill("SIGTERM"); } catch (e) {}
  setTimeout(() => { try { chrome.kill("SIGKILL"); } catch (e) {} }, 800);
  rm(profile, { recursive: true, force: true }).catch(() => {});
  process.exit(code);
}

let target = null;
for (let i = 0; i < 120; i++) {
  try {
    const list = await getJson("/json/list");
    target = list.find(t => t.type === "page" && t.webSocketDebuggerUrl);
    if (target) break;
  } catch (e) {}
  await new Promise(r => setTimeout(r, 100));
}
if (!target) {
  console.error("No se pudo conectar a Chrome/CDP\n" + stderr.slice(-800));
  stop(2);
}

let ws;
try {
  ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });
} catch (e) {
  console.error("No se pudo abrir WebSocket CDP: " + e.message);
  stop(2);
}

let id = 0;
const pending = new Map();
ws.onmessage = ev => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) {
    const p = pending.get(msg.id);
    pending.delete(msg.id);
    if (msg.error) p.reject(new Error(JSON.stringify(msg.error)));
    else p.resolve(msg.result);
  }
};
function send(method, params = {}) {
  const msgId = ++id;
  ws.send(JSON.stringify({ id: msgId, method, params }));
  return new Promise((resolve, reject) => pending.set(msgId, { resolve, reject }));
}

await send("Runtime.enable");
const deadline = Date.now() + 120000;
let title = "";
while (Date.now() < deadline) {
  const res = await send("Runtime.evaluate", { expression: "document.title", returnByValue: true });
  title = res.result && res.result.value;
  if (title === "DONE") break;
  await new Promise(r => setTimeout(r, 200));
}
if (title !== "DONE") {
  console.error("Timeout esperando DONE; último título: " + title + "\n" + stderr.slice(-800));
  stop(3);
}

const dom = await send("Runtime.evaluate", {
  expression: "document.documentElement.outerHTML",
  returnByValue: true
});
await writeFile(out, dom.result.value);
console.log("DOM guardado en " + out + " (" + dom.result.value.length + " bytes)");
try { ws.close(); } catch (e) {}
stop(0);
