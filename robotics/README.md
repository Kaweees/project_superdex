# SuperDex Robotics Docs Site

A [Docusaurus](https://docusaurus.io/) documentation site for **SuperDex
Robotics** (the `superdex.robotics` package).

SuperDex Robotics is a robotics SDK that provides robot definitions and
composition, controllers, sensors, actuators, and the framework that aggregates
them into complete simulation configs.

## Quick start

For most documentation changes, preview only this site. This is the fast path
and supports hot reloading:

```bash
yarn install  # Only when dependencies are not already installed
yarn start
# → http://localhost:3000/
```

The single-site preview defaults to `Latest`; when documentation snapshots are
present, use the version selector to preview them. Run `yarn build` when you
need to validate that this site compiles successfully for production.

Use the whole-site helper only when validation requires the Project SuperDex
homepage and all configured nested sites together, such as testing public base
paths, release routing, or cross-site links. It stages and builds every site and
can take several minutes. Run it from the fbsource root:

```bash
buck2 run fbsource//arvr/projects/superdex/ci:preview_website
```

## Structure

- `docs/` — the Docs tab: `overview` + five guides (Bot Definition, Modifying
  Bots, Context/Lifetime, Controllers, Bot Assets).
- `docs/examples/` — the Examples section, derived from the Python examples
  in `superdex_robotics/examples/`.
- `docs/api_reference/{cpp,python}.mdx` — the API Reference tab: embeds generated
  Doxygen (C++) and Sphinx (Python) API docs in an iframe. The embed machinery is
  `src/components/api_reference.js` + `api_frame.js` + `static/api-embed.css` +
  `static/fonts/`.
- `src/pages/index.mdx` — the landing page.
- `src/css/custom.css` — theme (white/black, DM Sans + Instrument Serif).
- `docusaurus.config.js`, `sidebars.js` — site config and navigation.
