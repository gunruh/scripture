# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Add versions of project at various stages to aid with teaching.

## [1.1.2] - 2024-06-19

### Added

- Loading icon that spins while waiting for search results.
- New accurate design mockups, including a layout file displaying CSS values.

### Changed

- `index.js` renamed to `app.js` to avoid confusion with `index.html`.
  - Using complete sentences and more detail in comments for clarity, and to help with language conversion.
- `index.html`
  - `<title>` now matches the `<h1>` text.
  - Added `autocomplete="off"` to `<form>` because autocomplete values were covering up the loading icon and causing magnifying-glass icon to disappear.
- `styles.css`
  - Created "spin" animation in order to spin the loading-icon.
  - Using complete sentences in comments for clarity, and to help with language conversion.
- `README.md` added link to spinner svg download.

## [1.1.1] - 2024-06-13

### Updated

- `index.html` updated placeholder to "Search the New Testament..."
- `index.js` added code to align verses across cards based on max verse height in row.
- `styles.css`
  - Setting shadow blur back to 8px.
  - Adding comments to existing settings where needed.
  - Increasing font size of card headers slightly.
  - Using margin instead of padding for spacing between result-items.

### Fixed

- `styles.css` using `scrollbar-gutter` to prevent movement when scrollbar appears.

## [1.1.0] - 2024-06-12

### Added

- Multilingual Bible Search UI
- `index.js`
  - Added K'iche' Bible Id constant.
  - Added 3-card layout for multiple language results.

### Changed

- `README.md`
  - Removed instructions for changing language. Will keep each version focused on a main language moving forward.
- `index.html`
  - Using simplified 'searchBible' function parameters.
  - Changed placeholder text to "Enter key words..."
- `index.js`
  - Now only searching New Testament (MAT - REV) because K'iche' Bible currently only includes New Testament.
- `styles.css`
  - Adjusted shadow blur from 8px to 4px to make it slightly more subtle.
  - Added comments where missing.

### Fixed

- `index.html` added some missing forward slashes to end tags.

## [1.0.0] - 2024-06-10

### Added

- UI Update for single-language Bible search.
- `styles.css` for styling the title, search bar, and results.
- `magnifying-glass-solid.svg` for the magnifying-glass search icon.
- `README.md` additional resources.

### Changed

- `index.html`
  - Moved existing styling into `styles.css` for simplified HTML code.
  - Changed title to "Bible Search".
- `index.js`
  - Set URL query parameter limit to 5 query results.
  - Adjusted HTML output `<div>` to include `class` attribute for styling.

## [0.0.1] - 2024-05-29

### Added

- Initial working project code including:
  - `design/` directory with screenshots of mock-ups
  - `CHANGELOG.md` to document changes
  - `index.html` for HTML code
  - `index.js` for JavaScript code
  - `README.md` for Requirements, Usage, and Resources
