#!/usr/bin/env bash
# Harness de regresión para index.html (PWA de un solo archivo).
# Arranca un http.server local, corre Chrome headless y reporta RESULT lines.
# No modifica index.html. No usa pkill.
set -u

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PORT=8129
DOM_OUT="/tmp/harness-dom.html"
ERR_LOG="/tmp/harness-err.log"
SERVER_LOG="/tmp/harness-server.log"

python3 -m http.server "$PORT" --bind 127.0.0.1 --directory "$ROOT" >"$SERVER_LOG" 2>&1 &
SERVER_PID=$!

cleanup() {
  kill "$SERVER_PID" 2>/dev/null
  wait "$SERVER_PID" 2>/dev/null
}
trap cleanup EXIT INT TERM

# Esperar a que el server responda (sin pkill).
for _ in $(seq 1 50); do
  if curl -fsS -o /dev/null "http://127.0.0.1:$PORT/index.html"; then break; fi
  sleep 0.1
done

google-chrome --headless=new --disable-gpu --no-sandbox \
  --window-size=1200,2800 \
  --virtual-time-budget=15000 \
  --dump-dom "http://127.0.0.1:$PORT/tests/harness.html" \
  >"$DOM_OUT" 2>"$ERR_LOG"
CHROME_RC=$?

cleanup
trap - EXIT INT TERM

echo "--- RESULT lines ---"
grep -o "RESULT [^<]*" "$DOM_OUT" || true

echo "--- resumen ---"
PASS=$(grep -c "RESULT .* PASS" "$DOM_OUT" || true)
FAIL=$(grep -c "RESULT .* FAIL" "$DOM_OUT" || true)
NOVER=$(grep -c "RESULT .* NOVERIFY" "$DOM_OUT" || true)
echo "PASS=$PASS FAIL=$FAIL NOVERIFY=$NOVER chrome_rc=$CHROME_RC"

if [ "$CHROME_RC" -ne 0 ]; then
  echo "Chrome terminó con código $CHROME_RC (ver $ERR_LOG)" >&2
  exit 2
fi

if ! grep -q "RESULT " "$DOM_OUT"; then
  echo "No se encontraron resultados; el harness pudo no ejecutarse (ver $DOM_OUT / $ERR_LOG)" >&2
  exit 3
fi

if grep -q "RESULT .* FAIL" "$DOM_OUT"; then
  exit 1
fi
exit 0
