# SuperDex Lab Docs Site

A [Docusaurus](https://docusaurus.io/) site for **SuperDex Lab**
(`superdex_lab`).

SuperDex Lab is the simulation harness that abstracts the Markov decision
process and dynamics-constrained-optimization underpinning RL, MPC, and
system-ID.

## Quick start

For most documentation changes, preview only this site. This is the fast path
and supports hot reloading:

```bash
yarn install  # Only when dependencies are not already installed
yarn start
# → http://localhost:3000/
```

The single-site preview defaults to `Latest`; when documentation snapshots are
present, use the version selector to preview them.

Run the whole-site helper only when validation requires the Project SuperDex
homepage and all configured nested sites together, such as testing public base
paths, release routing, cross-site links, or the exported Lab site without
`docs/internal/`. It can take several minutes. Run it from the fbsource root:

```bash
buck2 run fbsource//arvr/projects/superdex/ci:preview_website
```

The helper stages public copies outside fbsource, omits `docs/internal/`, builds
every site, and serves the assembled website. Public Docusaurus builds fail
unless this helper or the deployment workflow supplies the central release
configuration.

## Structure

- `docs/overview.mdx` — the Docs landing page: an overview of the SuperDex Lab
  simulation harness and its components.
- `docs/superdex_gym/` — the SuperDex Gym docs: intro, setup, environment
  reference, examples, benchmarking, custom environments, batching, RLlib
  training, rendering, and training-history visualization.
- `src/pages/index.mdx` — the landing page (an overview of all SuperDex Lab
  features).
- `src/css/custom.css` — theme (white/black, DM Sans + Instrument Serif).
- `docusaurus.config.js`, `sidebars.js` — site config and navigation.
