# Almalibre v2 — screen-by-screen plan

Machine: NonStop vending (base theme "Onctuo"). We replace images; the provider's app draws
the dynamic UI (topping grid, prices, buttons, cup selector, dialogs) on top.

Visual direction: the client's video storyboard — deep plum, Amazon leaves, real açaí bowl photography,
Outfit, cream pill "TOCA AQUÍ PARA PEDIR" button with a hand icon.

Rules: design in Spanish once and copy it to the `_en` and `_fr` files. Keep the exact name, px size and format.
Keep the alpha channel wherever the original has one.

## Business rules (confirmed)
- Toppings: any number of different toppings, **max 1 of each** (toggle on/off, no quantity).
- 6 toppings on screen (source: Figma node 46-255). Toppings: granola, oreo, paçoca. Salsas: frutos rojos,
  chocolate blanco y nocciola, + 1 per-machine slot: pistacho OR crema de cacahuete/cacao/avellana (assumed).

## How to rebuild the assets
`./scripts/render.sh` renders design/*.html with headless Chrome → export/ (names, sizes and formats from scripts/manifest.txt).
Add `?zones` to any design/*.html URL to see where the provider's app draws on top.
- Bowl base €4.50 + €1.00 per topping (placeholder).
- "Imagen ilustrativa" under topping photos. "Paçoca (Cacahuete dulce)".
- Screensaver: keep current Almalibre video for now (re-export 1080x1920); content-driven video later.

## Screens
| # | Screen | Delivered files | Design | App draws on top (keep zone clear) |
|---|---|---|---|---|
| 0 | Screensaver | MP4 1080x1920 (separate) | current video for now | – |
| 1 | Welcome | welcome_vanille_en/fr.jpg, welcome_mangues_en/fr.jpg | logo top · empty middle · "Tu bowl de açaí en segundos" | promo carousel (middle), start button (bottom) |
| 2 | Customise (book) | book_en.jpg, book_fr.png (alpha) | "Personaliza tu açaí" + "1 de cada · elige los que quieras" | topping grid, section titles, price, back/next |
| 2a | Section titles | book_topping_en 548x60, _fr 594x60; book_sauce_en 211x45, _fr 608x60 | "Toppings" / "Siropes", white, transparent | – |
| 3 | Summary (order) | order_en/fr.jpg | "Tu bowl" header | cup selector, selected mark, buttons |
| 3a | Selected mark | bg_diy_selected_mark.png 256x256 | yellow check circle, transparent | – |
| 4 | Payment | payment_en/fr.jpg | "Acerca tu tarjeta" + arrow to the reader | order line, invalid-payment dialog |
| 5 | Preparing (outing) | outing_en.jpg, outing_fr.png | "Preparando tu bowl" + 3 stages | progress bar |
| 5a | Progress steps | outing_process_1–4.png 485x74 | rounded bar 25/50/75/100 % in brand purple/yellow | – |
| 6 | Sold out | sold_out_en.png, sold_out_fr.png (alpha) | "Agotado por hoy · vuelve pronto" + Instagram | – |
| 7 | Common mark (hidden) | label_common_mark.png 308x344 | small leaf mark, transparent | – |

## App colours to send to the provider
- Main (text/borders): #4A1F6E
- Button fill: #FAB417
- Button text: #24142E
- All other text: #FFFFFF
- Note for provider: the app currently has ONE text colour; we need button labels #24142E and everything else #FFFFFF.

## Requests to the provider (not possible with images)
- Start button copy "PLACE YOUR ORDER WITH THE CHEF HERE" → "TOCA AQUÍ PARA PEDIR".
- Limit each topping to 1 per order; summary in Spanish ("1 cup" → "1 bowl").
- Topping names/prices/photos are app data.
