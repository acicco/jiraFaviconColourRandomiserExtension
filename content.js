/**
 * Constants for the favicon and SVG generation.
 */
const FAVICON_SELECTOR = "link[rel*='icon']";
const SVG_BASE_WIDTH = 256;
const SVG_BASE_HEIGHT = 256;
const SVG_VIEWBOX_X = -60;
const SVG_VIEWBOX_Y = -70;
const SVG_VIEWBOX_WIDTH = 376;
const SVG_VIEWBOX_HEIGHT = 376;
const SVG_RECT_RADIUS = 50;

// The SVG path data for the Jira logo
const JIRA_SVG_PATHS = `
    <path d="M244.658 0H121.707a55.502 55.502 0 0 0 55.502 55.502h22.649V77.37c.02 30.625 24.841 55.447 55.466 55.467V10.666C255.324 4.777 250.55 0 244.658 0z"/>
    <path d="M183.822 61.262H60.872c.019 30.625 24.84 55.447 55.466 55.467h22.649v21.938c.039 30.625 24.877 55.43 55.502 55.43V71.93c0-5.891-4.776-10.667-10.667-10.667z"/>
    <path d="M122.951 122.489H0c0 30.653 24.85 55.502 55.502 55.502h22.72v21.867c.02 30.597 24.798 55.408 55.396 55.466V133.156c0-5.891-4.776-10.667-10.667-10.667z"/>
`;

/**
 * Generates a consistent HSL color based on a string input (e.g., document URL).
 * Ensures color variety and contrast for the SVG logo.
 * @param {string} inputString - The string to hash for color generation.
 * @returns {{backgroundColor: string, svgColor: string}}
 */
const generateColorFromInput = (inputString) => {
  let hash = 0;
  for (let i = 0; i < inputString.length; i++) {
    hash = inputString.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = hash % 360;
  const saturation = 75 + (hash % 20); // 75-95%
  const lightness = 50 + (hash % 10);  // 50-60%

  const backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

  const svgColor = (lightness > 55) ? 'black' : 'white';

  return { backgroundColor, svgColor };
};

/**
 * Creates the complete SVG string for the Jira favicon.
 * @param {string} backgroundColor - The background color for the SVG.
 * @param {string} svgColor - The color for the Jira logo paths.
 * @returns {string} The complete SVG string.
 */
const createJiraFaviconSvg = (backgroundColor, svgColor) => {
  return `
    <svg width="${SVG_BASE_WIDTH}" height="${SVG_BASE_HEIGHT}" viewBox="${SVG_VIEWBOX_X} ${SVG_VIEWBOX_Y} ${SVG_VIEWBOX_WIDTH} ${SVG_VIEWBOX_HEIGHT}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
        <rect x="${SVG_VIEWBOX_X}" y="${SVG_VIEWBOX_Y}" width="${SVG_VIEWBOX_WIDTH}" height="${SVG_VIEWBOX_HEIGHT}" rx="${SVG_RECT_RADIUS}" fill="${backgroundColor}"/>
        <g fill="${svgColor}">
            ${JIRA_SVG_PATHS}
        </g>
    </svg>
  `;
};

/**
 * Gets the existing favicon link element or creates a new one if it doesn't exist.
 * @returns {HTMLLinkElement} The favicon link element.
 */
const getOrCreateFaviconElement = () => {
  let favicon = document.querySelector(FAVICON_SELECTOR);
  if (!favicon) {
    favicon = document.createElement('link');
    favicon.rel = 'icon';
    document.head.appendChild(favicon);
  }
  return favicon;
};

/**
 * Main function to update the favicon color and SVG.
 */
const updateFavicon = () => {
  const favicon = getOrCreateFaviconElement();
  // Use document.URL for color generation
  const { backgroundColor, svgColor } = generateColorFromInput(document.URL);
  const newSvg = createJiraFaviconSvg(backgroundColor, svgColor);
  const newIconUrl = `data:image/svg+xml;base64,${btoa(newSvg)}`;

  if (favicon.href !== newIconUrl) {
    favicon.href = newIconUrl;
  }
};

// --- Execution Flow ---

// Run the favicon update immediately when the script loads
updateFavicon();

// Set up a MutationObserver to re-run the update if the document URL changes.
// This is crucial for single-page applications like Jira where the URL can change dynamically.
const observer = new MutationObserver((mutations) => {
  // Check if the URL changed (by observing the title, which often reflects URL changes in SPAs)
  // Or, more directly, if the favicon itself is replaced by the page after initial load.
  const urlChanged = mutations.some(m => m.target.nodeName === 'TITLE' || (m.target.nodeName === 'LINK' && m.target.rel.includes('icon')));
  if (urlChanged) {
    updateFavicon();
  }
});

// Observe the head for changes to the title or favicon link
observer.observe(document.head, { childList: true, subtree: true, attributes: true, attributeFilter: ['href'] });