# SLP glass animation

Self-hosted, transparent Three.js scene for the Atlas introduction. Plays one 5.2-second tiger-to-SLP camera sweep on load; mouse entry, touch tap, or Enter/Space replays after it finishes. Reduced motion shows the final SLP. The scene pauses offscreen and while the page is hidden. It does not read or change assessment or shortlist state.

The canvas clears with alpha zero; there is no background, fog, or opaque floor. A transparent shadow catcher retains the sculpture's soft shadow. Environment lighting supplies glass reflections; the shader does not sample or refract the webpage behind it.

## Included assets

- Three.js 0.170.0 and its FontLoader/RoomEnvironment add-ons: https://github.com/mrdoob/three.js/tree/r170 — MIT terms in `vendor/THREE-LICENSE.txt`.
- polygon-clipping 0.15.7: https://github.com/mfogel/polygon-clipping/tree/v0.15.7 — MIT terms in `vendor/POLYGON-CLIPPING-LICENSE.md`; bundled dependency notices remain in the source.
- Helvetiker Bold: Three.js r170 font asset. MAGENTA permission terms are embedded in `assets/helvetiker-bold.json` under `original_font_information.license_description`.
- Tiger reference: user-supplied LSU tiger artwork. University marks remain the property of their respective owners. Inclusion does not imply university endorsement.

No build step, external runtime requests, or paid API is required.
