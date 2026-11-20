# Release Notes Language Policy

Every release must use one bilingual release-notes file:

- Path: docs/release-notes-v<manifest.version>.md
- Required top-level sections: ## 中文 and ## English
- Both sections must contain substantive release information, not headings alone.
- Keep package names, versions, commit pins, compatibility results, and release-channel status consistent between the two sections.
- The shared CI runs docs/check-release-notes.cjs and rejects a release notes file that is missing either language section.

The GitHub Release body must be generated from this same bilingual file. Do not publish a release with an English-only or Chinese-only body.
