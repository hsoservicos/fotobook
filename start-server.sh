#!/usr/bin/env bash
# Start a local HTTP server to serve the FotoBook mockup.
# Usage: ./start-server.sh [port]
# Default port: 8080

set -euo pipefail

PORT="${1:-8080}"
DIR="$(cd "$(dirname "$0")" && pwd)"

if ! [[ "${PORT}" =~ ^[0-9]+$ ]] || [ "${PORT}" -lt 1 ] || [ "${PORT}" -gt 65535 ]; then
  echo "Error: PORT must be a numeric value between 1 and 65535." >&2
  exit 1
fi

# Show local IPs for easy sharing
echo "╔══════════════════════════════════════════════╗"
echo "║         FotoBook Mockup Server              ║"
echo "╚══════════════════════════════════════════════╝"
echo ""
echo "  Local:   http://localhost:${PORT}/mockup.html"
echo ""
echo "  Network:"
if command -v ip >/dev/null 2>&1; then
  ip -4 addr show | grep inet | grep -v 127.0.0.1 | awk '{printf "           http://%s:%s/mockup.html\n", $2, "'${PORT}'"}' | cut -d'/' -f1 | sed 's|inet ||' | while read -r ip; do
    echo "           http://${ip}:${PORT}/mockup.html"
  done
elif command -v ifconfig >/dev/null 2>&1; then
  ifconfig | grep 'inet ' | grep -v 127.0.0.1 | awk '{printf "           http://%s:%s/mockup.html\n", $2, "'${PORT}'"}' | while read -r ip; do
    echo "           http://${ip}:${PORT}/mockup.html"
  done
else
  echo "           (no network interface command found)"
fi
echo ""
echo "  Press Ctrl+C to stop."
echo ""

python3 -m http.server "${PORT}" --directory "${DIR}"
