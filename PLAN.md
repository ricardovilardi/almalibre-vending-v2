# Almalibre v2 — screen-by-screen plan

Machine: NonStop vending (base theme "Onctuo"). We replace images; the provider's app draws
the dynamic UI (topping grid, prices, buttons, bowl selector, order text) on top.

Rules: design in Spanish once and copy it to the `_en` and `_fr` files. Keep the exact name, px size and format.
Note: the provider's "alpha" full screens are fully opaque, apart from a 1 px edge.

## Business rules
- Toppings: any number of different toppings, **max 1 of each** (toggle on/off).
- 6 toppings on screen (Figma node 46-255). Sólidos: granola, oreo, paçoca. Líquidos: frutos rojos,
  chocolate blanco y nocciola, + 1 per-machine slot: pistacho OR crema de cacahuete/cacao/avellana (assumed).
- 1, 2 or 3 bowls per order. Bowl base €4.50 + €1.00 per topping (placeholders).
- "Imagen ilustrativa" under topping photos. "Paçoca (Cacahuete dulce)".

## Flow
| # | Screen | Delivered files | Our image | App draws on top |
|---|---|---|---|---|
| 1 | Welcome | MP4 1080x1920 H.264, 27 s (separate) = assets/video/attract.mp4 | claymation açaí-berry intro (client file result-2a739822…mp4 = assets/video/intro-source.mp4) with storyboard captions burned in on the purple floor (y≈1415–1660): 0.4–5.6 s "Açaí · desde el corazón de la Amazonia"; 6–11.4 s "Un fruto extraordinario · Directo de la Amazonia a tu bowl"; 11.8–16.4 s "Tú eliges tus toppings · Crea tu bowl como más te guste"; 16.8–21 s "Puro sabor, a tu manera"; 21.4–26.9 s "Tu bowl de açaí en segundos" (no logo, so the button never covers it); white brand symbol (design/img/symbol-white.svg, 144 px) in the top-left corner for the whole video. Tap → 2 | prototype: cream pill "TOCA LA PANTALLA PARA CONTINUAR" + hand icon at y≈1705 over the video (to confirm with the provider whether the app can overlay it; otherwise burn it into the MP4) |
| 2 | Personaliza | welcome_vanille_en/fr.jpg, welcome_mangues_en/fr.jpg (both identical, single design) | #FFFCF5, purple logo, light-beige (#F5F1E8) product slot, purple text below: "Tu bowl de açaí en segundos" + "Natural, fresco y a tu manera" | product slot: cup only, no text (assets/bowls-1.png, transparent); bottom button (colour + text configurable) |
| 3 | Toppings | book_en.jpg, book_fr.png | #FFFCF5, purple text: "Personaliza tu açaí" (one line) + "Elige tus toppings" | Sólidos/Líquidos label images, topping cards, total, Volver/Siguiente |
| 3a | Section titles | book_topping_en 548x60, _fr 594x60 = "Sólidos"; book_sauce_en 211x45, _fr 608x60 = "Líquidos" | #4A1F6E, transparent, fixed height | – |
| 3b | Selected mark | bg_diy_selected_mark.png 256x256 | #FAB417 circle (172 px), #4A1F6E check | used on toppings and bowl quantity |
| 4 | Bowl quantity | order_en/fr.jpg | #FFFCF5, "¿Cuántos bowls quieres?" + "Elige 1, 2 o 3" | 1/2/3 bowl images (assets/bowls-1/2/3.png, 1000x1000 transparent; app data for the provider), selected mark, buttons |
| 5 | Summary | payment_en/fr.jpg | #FFFCF5, text only: "Resumen de tu pedido" + "Revisa que todo esté bien" | "Seleccionado: N bowls" + order text, buttons |
| 6 | Payment | – | **on hold, no clear path from the provider yet** | – |
| 7 | Preparing | outing_en.jpg, outing_fr.png + outing_process_1–4.png 485x74 | #FFFCF5, purple #4A1F6E text, light-beige #F5F1E8 panels; progress bar: purple outline, light-purple #8B2FC9 fill; texts centred | progress steps (loading state); cup = assets/bowls-1.png |
| 8 | Sold out | sold_out_en.png, sold_out_fr.png | full-bleed image, no text (placeholder: Amazon photo). Back button maybe later | – |
| – | Common mark (hidden) | label_common_mark.png 308x344 | fully transparent | – |

## App colours to send to the provider
- Background of light screens: #FFFCF5
- Text (app and screen titles, incl. Sólidos/Líquidos labels): #4A1F6E (12:1 on #FFFCF5), switched from #FAB417 for legibility
- Topping card fill: #F5F1E8 · card text #4A1F6E · price smaller, regular weight · "Imagen ilustrativa" #8E8167
- Topping images: no background
- Primary button (Personaliza start, Siguiente, Pagar): fill #FAB417, text #24142E dark purple (9.6:1)
- Secondary button (Volver): fill #FFFFFF, text + border #4A1F6E

## Requests to the provider (not possible with images)
- Personaliza button text and colour.
- Separate colours for app text, primary button and secondary button.
- Topping card style above (fill, caption colour, smaller regular price, no image background).
- Limit each topping to 1 per order; Spanish copy ("Selected" → "Seleccionado", "cup" → "bowl").
- Payment flow details.
- Sold-out back button (if any).

## How to rebuild the assets
`./scripts/render.sh` renders design/*.html with headless Chrome → export/ (names, sizes and formats from scripts/manifest.txt).
Video captions: edit design/video/capN.html, render each to build/video/capN.png (headless Chrome, 1080x1920, transparent),
then `swiftc -O scripts/captions.swift -o build/captions && build/captions assets/video/intro-source.mp4 assets/video/attract.mp4` (timings in the script).
Add `?zones` to any design/*.html URL to see where the provider's app draws on top.
