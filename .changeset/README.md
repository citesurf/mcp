# Changesets

This project uses [Changesets](https://github.com/changesets/changesets) to manage versioning and changelogs.

## Adding a changeset

```bash
npx changeset
```

Follow the prompts to describe your change and select a version bump type (patch, minor, or major).

## Publishing

Merging changesets to `main` triggers the release workflow, which either creates a "Version Packages" PR or publishes to npm automatically.
