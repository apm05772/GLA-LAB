# Chern Slope Research Lab

A static browser notebook for SageMath experiments with projective line arrangements and logarithmic Chern slopes.

## Architecture

- **Frontend:** plain HTML/CSS/JavaScript; suitable for GitHub Pages.
- **Computation:** public [SageMathCell](https://sagecell.sagemath.org/) servers.
- **Core engine:** `engine_original.sage`, preserved byte-for-byte from the research engine.
- **Research cells:** linked SageMathCell cells sharing one Sage session.
- **Persistence:** cell source is saved in the browser's local storage; the live Sage kernel is temporary.

Engine SHA-256:

```text
4595f2bd6bc5eac7ade45a9d7fd0efbfebd261a8e38f59e2e59937fb6e535e08
```

## Run locally

No Docker and no Sage installation are required.

```bash
./serve.sh
```

or:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

An internet connection is required when running Sage cells because execution happens on SageMathCell servers.

## Research workflow

1. Open the page.
2. Click **Initialize research engine** and wait for `ENGINE READY — core functions loaded successfully`.
3. Add/run Sage cells below it.
4. Definitions persist between linked cells during the live session.
5. Use **Export cells** to save experimental code as a `.sage` file.
6. Reload/reset to obtain a clean Sage session; your cell text remains stored in the browser.

## GitHub Pages

See `GITHUB_PAGES.md` for exact publishing steps.

## Implementation note

Research cells are embedded using the documented SageMathCell container pattern rather than attaching the cell UI directly to a textarea. All cells use the same `linkKey`, so definitions are shared throughout the live session.
