# Jira Icon Colour Randomiser

An extension to make Jira tickets easier to distinguish at a glance by randomising the colour of the favicon based on the ticket URL.

## Features

-   **Dynamic Colouring:** The favicon's background colour is randomised based on the Jira ticket's URL, ensuring consistent colours for the same ticket across different tabs or sessions.
-   **Official Jira Logo:** Uses a custom-rendered SVG of the official Jira logo.
-   **Contrast-Aware:** The Jira logo automatically switches between white and black to maintain optimal contrast against the generated background colour.
-   **Instant Update:** The favicon changes immediately upon page load, providing an instant visual cue.

## Installation

To install and use this Chrome extension:

1.  **Download/Clone:** Obtain the project files to a local directory on your computer.
2.  **Open Chrome Extensions:** Navigate to `chrome://extensions` in your Chrome browser.
3.  **Enable Developer Mode:** Toggle on "Developer mode" in the top right corner.
4.  **Load Unpacked:** Click the "Load unpacked" button.
5.  **Select Directory:** Browse to and select the `jiraIconColourRandomiserExtension` directory.
6.  The extension should now appear in your list.

## Usage

Once installed, the extension works automatically:

1.  Navigate to any Jira page (`*.atlassian.net/*` or `*.jira.com/*`).
2.  The favicon in your browser tab will automatically update to a unique, consistent colour based on the Jira ticket's URL, with the Jira logo rendered for optimal contrast.

## How It Works (High-Level)

This extension operates as a Chrome content script. It:

1.  **Hashes URL:** Uses the Jira page's URL to generate a unique, consistent hash.
2.  **Generates HSL Color:** Converts the hash into an HSL (Hue, Saturation, Lightness) color, ensuring variety and vibrancy.
3.  **Ensures Contrast:** Dynamically determines whether the Jira logo should be white or black based on the generated background color's lightness for optimal readability.
4.  **Creates SVG Favicon:** Constructs an SVG image with the colored background and the contrast-adjusted Jira logo.
5.  **Applies Favicon:** Replaces the page's favicon with the newly generated SVG. This process runs at `document_start` to prevent flicker and is re-triggered by a `MutationObserver` if the page URL changes (common in single-page applications like Jira).

## Permissions Justification

The extension's `content.js` script is configured to run on `https://*.atlassian.net/*` and `https://*.jira.com/*` via the `matches` key in `manifest.json`. This grants it the necessary access to read the page URL and modify the favicon element, fulfilling its single purpose without requiring additional `host_permissions`.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
