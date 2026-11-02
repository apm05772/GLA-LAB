# Geography of Line Arrangements Lab

A static browser notebook for SageMath experiments with projective line arrangements and logarithmic Chern slopes.

## Architecture

- **Frontend:** plain HTML/CSS/JavaScript; suitable for GitHub Pages.
- **Computation:** public [SageMathCell](https://sagecell.sagemath.org/) servers.
- **Core engine:** the exact research engine is stored losslessly as `engine_original.sage.gz` and decompressed in the browser before execution.
- **Engine integrity:** the reconstructed source must have SHA-256 `4595f2bd6bc5eac7ade45a9d7fd0efbfebd261a8e38f59e2e59937fb6e535e08`.
- **Research cells:** linked SageMathCell cells sharing one Sage session.
- **Persistence:** cell source is saved in the browser's local storage; the live Sage kernel is temporary.

The gzip asset is only a storage/deployment format. The Sage source sent for execution is the original 77,785-byte engine after lossless decompression and SHA-256 verification.

## Run locally

No Docker and no Sage installation are required.

```bash
./serve.sh
```

or:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

An internet connection is required when running Sage cells because execution happens on SageMathCell servers.

## Research workflow

1. Open the page.
2. Confirm **Engine integrity** says `Verified unchanged`.
3. Click **Initialize research engine** and wait for `ENGINE READY — core functions loaded successfully`.
4. Add/run Sage cells below it.
5. Definitions persist between linked cells during the live session.
6. Use **Export cells** to save experimental code as a `.sage` file.
7. Reload/reset to obtain a clean Sage session; your cell text remains stored in the browser.

This is meant to help with any research you might have by providing the engine that has helped me so far in this field. Given that it works using SageMath, it can obviously work with a lot more, but it's meant to be specialized due to the large amount of uniquely defined functions. 
