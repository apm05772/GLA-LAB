# G.L.A. Research Lab — Geography of Line Arrangements

**G.L.A. Research Lab** is a browser-based workspace for **computational research in pure mathematics** and a home for selected mathematical notes and findings. It combines interactive SageMath experimentation with a static website where research updates can be shared once they are ready for publication. Its current mathematical emphasis is **projective line arrangements, incidence geometry, and logarithmic Chern invariants**.

The research notebook and the notes section serve different purposes: SageMath cells support exploration and computation, while the website presents manually curated updates. Numerical or symbolic experiments do not, by themselves, constitute a proof.

The main purpose of this lab is to serve as an addition to my (W.I.P) wiki. Mainly for fun, but also because I find it interesting to see what people are able to create with this. It is important to note that that this does **NOT** guarantee mathematical results, but rather it servers as a place to explore ideas one might have. 

## Architecture

- **Frontend:** plain HTML/CSS/JavaScript; suitable for GitHub Pages.
- **Computation:** public [SageMathCell](https://sagecell.sagemath.org/) servers.
- **Core engine:** the exact research engine is stored losslessly as `engine_original.sage.gz` and decompressed in the browser before execution.
- **Engine integrity:** the reconstructed source must have SHA-256 `4595f2bd6bc5eac7ade45a9d7fd0efbfebd261a8e38f59e2e59937fb6e535e08`.
- **Research cells:** linked SageMathCell cells sharing one Sage session.
- **Persistence:** cell source is saved in the browser's local storage; the live Sage kernel is temporary.

The gzip asset is only a storage/deployment format. The Sage source sent for execution is the original 77,785-byte engine after lossless decompression and SHA-256 verification.

It is important to note that the engine is different from my other repository `realization-engine`. Main difference is that this one focuses more extensively on combinatorial geometry and general 'family searching' tools (since it's what I used it for). Definitely more computational and not as 'abstract' as the other one.

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

## Purpose and publication

The lab is designed to make specialized computational tools accessible through a browser and to communicate selected mathematical work. Although SageMath supports many areas of mathematics, the currently bundled engine and interface are specialized for line-arrangement research; broader use may require additional code.

The **Latest Notes** area is updated through the website source (so they are essentially my notes, not the community's. Though it'd be cool to have those once the main wiki is up and running), not automatically from notebook computations. Research findings should be reviewed and distinguished from conjectures or preliminary computational evidence before being presented publicly.

## AI usage

This is **AI-ASSISTED**! Primarily focused on the web-design and engine structure. I am **NOT** claiming to have done this all by myself. While it is **AI-ASSISTED**, I have personally worked extensively with the engine and have verified it to the best of my ability. If there are any errors present there, please create an issue.
