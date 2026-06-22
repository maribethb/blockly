# AGENTS.md

## Project ownership

Blockly is maintained by the **Raspberry Pi Foundation**. This repository,
`RaspberryPiFoundation/blockly`, is the canonical upstream. It is **not** a fork of
`google/blockly`, and there is no separate Google-maintained version that this one tracks
or defers to.

Blockly was originally developed at Google, so a lot of legacy remains and it is easy to
conclude otherwise. Two things in particular are not evidence of ownership:

- Most existing files carry a `Copyright <year> Google LLC` header. **Leave them alone.**
  Only new files get the Raspberry Pi Foundation copyright.
- Several hundred links to `developers.google.com/blockly` are still embedded in TSDoc
  and comments. They are stale. Do not add new ones.

When adding a reference or link, use the current locations:

| For               | Use                                                       |
| ----------------- | --------------------------------------------------------- |
| Source repository | `https://github.com/RaspberryPiFoundation/blockly`        |
| Issues            | `https://github.com/RaspberryPiFoundation/blockly/issues` |
| Documentation     | `https://docs.blockly.com`                                |
| Project home      | `https://blockly.com`                                     |

The npm package name is unchanged: the core library is still published as `blockly`.

## Repository structure

This is an npm + Nx monorepo. Workspaces are `packages/*` and `packages/plugins/*`.

| Path                 | Package name   | What it is                                                                      |
| -------------------- | -------------- | ------------------------------------------------------------------------------- |
| `packages/blockly/`  | `blockly`      | The core library                                                                |
| `packages/plugins/*` | `@blockly/*`   | First-party plugins (fields, themes, workspace add-ons) and their build tooling |
| `packages/docs/`     | `blockly-docs` | The Docusaurus developer documentation site                                     |

Detailed guidance lives next to the code it describes. Read the relevant one before working in that area, rather than loading all of them:

- [`packages/blockly/AGENTS.md`](packages/blockly/AGENTS.md) — core library
- [`packages/plugins/AGENTS.md`](packages/plugins/AGENTS.md) — plugins
- [`packages/docs/AGENTS.md`](packages/docs/AGENTS.md) — documentation site

## Commands

Run these from the repo root. Root scripts fan out across workspaces via Nx.

```bash
npm ci                 # Install. Re-run after any pull that changes package-lock.json.

npm run build          # Build every package except the docs site
npm run build:all      # Build everything, including the docs site
npm run build:docs     # Docs site only

npm run test           # Full test suite across all packages. Slow.

npm run lint           # ESLint across all workspaces
npm run lint:fix
npm run format         # Prettier write, whole repo
npm run format:check

npm run clean          # Reset the Nx cache and clean every package
```

To work on a single package, either `cd` into it and use its own scripts, or target it
with Nx from the root. The Nx project name is the package's `name` field, which for
plugins is often not the same as the directory name — run `npx nx show projects` to list
them rather than guessing.

```bash
npx nx show projects
npx nx run blockly:test
npx nx run @blockly/field-slider:test
npx nx run-many -t build --projects=@blockly/field-slider
```

Two things to watch out for:

- `format` and `format:check` exist **only** at the root. Prettier is configured once
  for the whole repo, so there is no per-package equivalent.
- `build`, `test`, `clean`, `lint`, and `start` exist at both levels and mean different
  things. At the root they fan out through Nx; inside a package they run that package's
  own tooling.

## Shared configuration

Tooling is configured once at the root and covers every package. Do not add per-package
copies of these:

- `eslint.config.mjs` — a single flat config with per-package `files` sections
- `.prettierrc.js` — shared base plus `overrides` for core, plugins, and docs, which
  each use different settings
- `nx.json` — target defaults and caching
- `lerna.json` — versioning and publishing
- `commitlint.config.mjs` — conventional commit rules

## Commits and pull requests

Commits follow the conventional commit spec, enforced by commitlint. The type should be
one of `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `refactor`, `release`, `revert`,
or `test`.

Breaking changes must append `!` to the type (for example `feat!:`) **and** be called out
in the pull request description. See [`packages/blockly/AGENTS.md`](packages/blockly/AGENTS.md)
for what counts as a breaking change.

## Pull request descriptions

Keep them short. A reviewer should be able to read the description in well under a
minute. The template in `.github/PULL_REQUEST_TEMPLATE.md` asks for the right things —
fill it in briefly rather than expanding it.

Cover:

- **What changed** — a short summary of the change.
- **Why** — the problem it solves. Link the issue rather than restating it.
- Anything a reviewer genuinely needs: breaking changes, migration notes, or how to
  verify behavior that isn't obvious from the diff.

Do not write a narrative. Leave out the story of how you arrived at the solution, the
approaches you tried and rejected, a file-by-file walkthrough of the diff, and any
restatement of what the code already says. Where the reasoning behind a non-obvious
decision matters, a sentence or two is enough — and it often belongs in a code comment
instead, where it will still be there in a year.

## Versioning and publishing

All packages share a single version line, managed by Lerna from the root
(`.github/workflows/publish.yml`). A release bumps only the packages that actually
changed, but they all move to the same version number. Git tags use the `blockly-v`
prefix.

Never hand-edit a `version` field in a `package.json`.

## Code conventions

These apply to every package. The code style has changed over time; use these
conventions even where the surrounding code does not.

- **New files** get the Apache-2.0 header with a Raspberry Pi Foundation copyright:

  ```ts
  /**
   * @license
   * Copyright 2026 Raspberry Pi Foundation
   * SPDX-License-Identifier: Apache-2.0
   */
  ```

  Leave the copyright line alone on existing files.

- **Optional parameters** take plain names — `workspace`, not `opt_workspace`. The
  linter still permits the `opt_` prefix so that legacy code keeps passing, but do not
  add new uses of it.
- **Test-only exports** should be avoided. Where they are unavoidable, prefix them with
  `testOnly_`.
- **Private and internal methods** do not take a trailing `_` suffix.
- **TSDoc** is required on all public APIs, covering behavior, params, and returns.
  Implementation details belong in inline comments, not in TSDoc.
- **Inline comments** explain complex implementation details or gotchas. They are not a
  changelog: do not record how the code used to work unless it explains a
  backwards-compatibility workaround.

## Further reading

The contributor documentation is in this repository under
[`packages/docs/docs/guides/contribute/`](packages/docs/docs/guides/contribute/). Read
those files directly rather than following links out to the published site. Most useful:

- [Style guide](packages/docs/docs/guides/contribute/core/style_guide.mdx)
- [Commit messages](packages/docs/docs/guides/contribute/get-started/commits.mdx)
- [Writing a good PR](packages/docs/docs/guides/contribute/get-started/write_a_good_pr.mdx)
