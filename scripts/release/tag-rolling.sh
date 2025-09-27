#!/usr/bin/env bash
set -euo pipefail
MAJOR="${1:-}"; MINOR="${2:-}"
[ -z "$MAJOR" ] && exit 0
git config user.name "github-actions[bot]"
git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
git tag -d "v${MAJOR}" || true
git tag -d "v${MAJOR}.${MINOR}" || true
git push origin ":v${MAJOR}" || true
git push origin ":v${MAJOR}.${MINOR}" || true
git tag -a "v${MAJOR}" -m "v${MAJOR}"
[ -n "${MINOR:-}" ] && git tag -a "v${MAJOR}.${MINOR}" -m "v${MAJOR}.${MINOR}" || true
git push origin "v${MAJOR}"
[ -n "${MINOR:-}" ] && git push origin "v${MAJOR}.${MINOR}" || true
