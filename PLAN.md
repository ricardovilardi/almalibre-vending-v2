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
| 1 | Welcome | MP4 1080x1920 (separate) | current "cheering cups" video, no overlay; tap → 2. Content-driven video later (storyboard) | – |
| 2 | Personaliza | welcome_vanille_en/fr.jpg, welcome_mangues_en/fr.jpg (both identical, single design) | logo + info text | product image/video slot (middle), bottom button (colour + text configurable) |
| 3 | Toppings | book_en.jpg, book_fr.png | #FFFCF5, purple text: "Personaliza tu açaí" (one line) + "Elige tus toppings" | Sólidos/Líquidos label images, topping cards, total, Volver/Siguiente |
| 3a | Section titles | book_topping_en 548x60, _fr 594x60 = "Sólidos"; book_sauce_en 211x45, _fr 608x60 = "Líquidos" | #4A1F6E, transparent, fixed height | – |
| 3b | Selected mark | bg_diy_selected_mark.png 256x256 | #FAB417 circle (172 px), #4A1F6E check | used on toppings and bowl quantity |
| 4 | Bowl quantity | order_en/fr.jpg | #FFFCF5, "¿Cuántos bowls quieres?" + "Elige 1, 2 o 3" | 1/2/3 bowl images (assets/bowls-1/2/3.png, 1000x1000 transparent; app data for the provider), selected mark, buttons |
| 5 | Summary | payment_en/fr.jpg | #FFFCF5, text only: "Resumen de tu pedido" + "Revisa que todo esté bien" | "Seleccionado: N bowls" + order text, buttons |
| 6 | Payment | – | **on hold, no clear path from the provider yet** | – |
| 7 | Preparing | outing_en.jpg, outing_fr.png + outing_process_1–4.png 485x74 | unchanged (plum) | progress steps (loading state) |
| 8 | Sold out | sold_out_en.png, sold_out_fr.png | full-bleed image, no text (placeholder: Amazon photo). Back button maybe later | – |
| – | Common mark (hidden) | label_common_mark.png 308x344 | fully transparent | – |

## App colours to send to the provider
- Background of light screens: #FFFCF5
- Text (app and screen titles, incl. Sólidos/Líquidos labels): #4A1F6E (12:1 on #FFFCF5), switched from #FAB417 for legibility
- Topping card fill: #F5F1E8 · card text #4A1F6E · price smaller, regular weight · "Imagen ilustrativa" #8E8167
- Topping images: no background
- Primary button (Siguiente/Pagar): fill #FAB417, text #FFFFFF (⚠ 1.81:1 contrast)
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
Add `?zones` to any design/*.html URL to see where the provider's app draws on top.
