# Onizy asset performance rules

Follow [AGENTS.md](AGENTS.md) for repository boundaries, shared-component approval and verification requirements. These rules apply when creating, importing or replacing UI assets.

## Icons and illustrations

- Reuse existing inline SVG icon components for functional icons. Do not add an icon font. When the owner explicitly requests image generation for a missing design-specific icon, use a transparent raster asset sized for its actual display dimensions, with the same density and byte checks as other UI images.
- Export raster images for their largest intended display size in dp, rather than using a full-resolution generated image as a thumbnail. Component width/height and `resizeMode` do not reduce the transferred file size.
- Provide an unsuffixed 1x PNG and matching `@2x`/`@3x` PNGs. Reference only the base file with a static `require`; React Native selects the density. All variants must have exactly scaled dimensions and the same framing and aspect ratio.
- Resize from the original image, never from an already reduced variant. Keep editing masters outside runtime assets and do not add scratch images, comparisons or reports to the project.
- Use lossless PNG compression, strip unnecessary metadata and preserve transparency, colors and framing. Check the result at its actual display size. Do not quantize colors, crop or change artwork simply to meet a byte limit.
- Native launcher icons are a separate build asset: one 1024 x 1024 PNG. Do not use a launcher-sized source for an in-app icon.
- Keep brand declarations in `src/design-system/assets` and feature declarations in `src/features/<feature>/assets`. Update intrinsic dimensions when replacing a brand asset. Density variants share the base asset's declaration.

## Enforced budgets

`npm.cmd run check:assets` validates the current PNG pipeline. It also runs inside `npm.cmd run check`.

| Asset                                              | Maximum file size            |
| -------------------------------------------------- | ---------------------------- |
| Runtime image with a 1x longest edge up to 128 px  | 100 KiB per density variant  |
| Runtime image with a 1x longest edge of 129-320 px | 512 KiB per density variant  |
| Runtime image with a 1x longest edge of 321-512 px | 1024 KiB per density variant |
| Native launcher icon at 1024 x 1024 px             | 1024 KiB                     |

These are ceilings, not target sizes. Small deck artwork should use its 56 dp display size; it must not be exported at 128 dp merely because the budget allows it. Runtime base images larger than 512 px fail validation. A new format or a larger use case needs equivalent validation and a documented size justification in this file; do not disable the checks.

## Loading and verification

- Optimize image dimensions and bytes before adding caches, preloading or dependencies. Preloading must target the next likely screen and must not block startup or download every illustration at launch.
- Keep explicit display dimensions to avoid layout shifts. Do not bypass platform caching or add intentional image fades to frequently used icons.
- After changing assets, run `check`, `doctor` and `bundle:check`. Confirm density selection, transparency and artwork at phone sizes.
- Measure cold and warm loading on Android/iOS. Compare development and release builds when investigating latency; Expo Go may fetch uncached development assets from the computer.
- Report asset-byte reductions separately from measured loading-time improvements. A web preview or a successful bundle export does not establish phone performance.
