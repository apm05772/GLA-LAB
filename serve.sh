#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
echo "Serving Chern Slope Research Lab at http://localhost:8000"
echo "Press Ctrl+C to stop."
python3 -m http.server 8000
