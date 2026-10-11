# SLP optical glass

The approved tiger-to-SLP animation supplies the visual identity: thin purple and gold panes with clear space around them. The surrounding clinical tool extends that identity while keeping filters, data, evidence, and comparison legible.

## Palette and materials

- Brand purple: `#461D7C`. Brand gold: `#FDD023`.
- Dark surfaces use deep plum, pale purple-white text, and gold selected controls with dark-purple labels.
- Light surfaces use cool pale purple, dark-purple text, and the same gold selected controls. Gold is not used for body text on light backgrounds.
- A generated tiger-stripe alpha mask supplies a static background texture at 7.5% opacity in dark mode and 4.5% in light mode. It is decorative, ignores pointer events, and disappears in print. The texture never overlays the content.
- Translucency is reserved for the header, filter shell, and floating chrome. Plotting areas, form fields, spec rows, and evidence bodies use steady reading surfaces. Major panes have thin edges and restrained highlights, with 12–14px corner radii.
- The six clinical families retain distinct hues. Their light-mode mark colors are adjusted for at least 3:1 contrast on the plotted field; text uses separate darker tokens. Evidence states retain color plus glyph and label.

## Type and interaction

- Anton, self-hosted under OFL, is used only for major hero and workspace headings.
- Public Sans remains the interface, data, and body face. IBM Plex Mono remains measurement and source metadata.
- Main controls are at least 44px high. Mobile filter chips retain the aligned grid and centered headings. The chart retains fixed assessment names and a separately scrolling plot.
- Active controls use gold with dark-purple text. Saved-card borders remain visible on hover. Focus, selection, caret, and scrollbar colors follow the palette.
- The transparent motion component, its 5.2-second autoplay, hover/tap/keyboard replay, and reduced-motion behavior are unchanged. It is the page's only authored animated visual feature.

## Product constraints

Keep the assessment content, source caveats, six chart layers, filter behavior, theme preference, shortlist key `slp-shortlist-v2`, comparison state, and exports intact. No university endorsement is implied. Support both light and dark themes, narrow screens, reduced motion, and reduced transparency.
