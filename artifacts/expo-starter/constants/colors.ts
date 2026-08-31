/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const colors = {
  light: {
    // Legacy aliases (kept for backward compatibility)
    text: '#0a0a0a',
    tint: '#F05A47',

    // Core surfaces
    background: '#F7F4EF',
    foreground: '#18232B',

    // Cards / elevated surfaces
    card: '#FFFDFC',
    cardForeground: '#18232B',

    // Primary action color (buttons, links, active states)
    primary: '#F05A47',
    primaryForeground: '#ffffff',

    // Secondary / less-emphasis interactive surfaces
    secondary: '#E7EEE9',
    secondaryForeground: '#244238',

    // Muted / subdued elements (dividers, timestamps, placeholders)
    muted: '#ECE8E2',
    mutedForeground: '#66727A',

    // Accent highlights (badges, selected items, focus rings)
    accent: '#FCE4D7',
    accentForeground: '#8C3A2E',

    // Destructive actions (delete, error states)
    destructive: '#ef4444',
    destructiveForeground: '#ffffff',

    // Borders and input outlines
    border: '#DED9D0',
    input: '#D4CEC5',
    brandOutline: '#F05A47',
    progressDark: '#18232B',
    progressDarkAlt: '#2A3B43',
    onDark: '#FFFDFC',
    onDarkMuted: '#B9C7C8',
    onDarkTrack: 'rgba(255, 253, 252, 0.16)',
  },

  dark: {
    text: '#F7F4EF',
    tint: '#FF806E',
    background: '#172127',
    foreground: '#F7F4EF',
    card: '#223139',
    cardForeground: '#F7F4EF',
    primary: '#FF806E',
    primaryForeground: '#172127',
    secondary: '#2B403A',
    secondaryForeground: '#D8F0E2',
    muted: '#2A343A',
    mutedForeground: '#A8B4B7',
    accent: '#563B36',
    accentForeground: '#FFD8CE',
    destructive: '#FF746A',
    destructiveForeground: '#172127',
    border: '#39464C',
    input: '#445159',
    brandOutline: '#FF806E',
    progressDark: '#172127',
    progressDarkAlt: '#26363E',
    onDark: '#F7F4EF',
    onDarkMuted: '#A8B4B7',
    onDarkTrack: 'rgba(247, 244, 239, 0.16)',
  },

  // Border radius (in px). Sync from the sibling web artifact's --radius
  // CSS variable. This value applies to cards, buttons, inputs, and modals.
  radius: 8,
};

export default colors;
