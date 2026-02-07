# Specification

## Summary
**Goal:** Add a TV/CRT frame overlay around the existing emulator canvas on the Play screen without breaking current overlays or sizing behavior.

**Planned changes:**
- Wrap the Play screen emulator `<canvas>` in a responsive container that supports an image-based TV/CRT frame overlay.
- Render a static TV/CRT frame PNG overlay positioned above the canvas while preserving canvas sizing/aspect behavior.
- Ensure the ROM upload overlay and error overlay still render above the canvas content and remain readable/clickable (frame overlay should not intercept pointer events).

**User-visible outcome:** On the Play screen, the emulator appears inside a TV/CRT frame, while ROM upload and error overlays continue to work normally on top of the display.
