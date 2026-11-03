#!/usr/bin/env bash
# Downloads the image + icon assets exported from the Figma file
# "Buy Nothing" (AFTER — 03 Desktop Screens, node 447:3871, and
# AFTER — 02 Mobile Screens, node 444:3285) into public/assets.
# The Figma MCP asset URLs are temporary (~7 days from 2026-11-03). If they have
# expired, re-export the assets from Figma using the same file names.
set -euo pipefail
cd "$(dirname "$0")/../public/assets"
B="https://www.figma.com/api/mcp/asset"
while read -r name id; do
  [ -z "$name" ] && continue
  echo "→ $name"
  curl -fsSL -o "$name" "$B/$id"
done <<'LIST'
icon-leaf.svg 4800f33a-a495-4688-8388-bf8950f77459.svg
icon-search.svg 971200e5-5ede-41c5-93fe-fcbd560139a6.svg
icon-plus.svg 76ef00f2-116d-4582-bc0a-baae1f3fe29d.svg
icon-check-on-ink.svg 34f062be-b95b-41c4-abfb-91f8007d7272.svg
icon-check-ink.svg 1babe1fb-a2ae-4f4b-b8e6-f6eafc4451c7.svg
icon-sort.svg 1006c0d7-ff41-49e6-a7db-714cd0e75c49.svg
icon-chevron-down.svg 1a47c4e9-771e-4292-bafe-0f5b3aec027c.svg
icon-chevron-right.svg b965bd62-383c-40cd-8f50-c9c1660e112c.svg
icon-pin-16.svg 69c5b946-675e-4f0a-8459-435537ae7cd0.svg
icon-pin-20.svg 78aa8ad0-0b00-45a4-a98b-2873d9dd588d.svg
icon-clock.svg f3f86e35-bd66-4ca4-8dba-2db2242417a0.svg
icon-heart-on-ink.svg 4901da9a-42db-43b4-8a35-1f6258be8b16.svg
icon-heart-muted.svg 1023f48b-caf1-49b1-90a1-d7b70cd642a9.svg
icon-message.svg 61a41e13-fe03-4bd3-8b59-932b99c56f50.svg
icon-pen.svg 0e466f78-36c8-4801-ac30-7545ec0fb817.svg
icon-shuffle.svg f03c78d9-37ad-47b0-89c0-f48753c860f9.svg
icon-camera.svg ba5fa63a-e482-47ae-ad61-59664b1cec47.svg
icon-send.svg 0b40c2ae-42db-49b4-935a-4617cc4f44de.svg
unread-dot.svg 1b00c14a-efe5-4beb-ba64-6cf9e2b0f067.svg
toggle-on.svg e957c550-d5d5-48c9-b5e9-ed4128f181c7.svg
avatar-default.png 84e9e471-60c2-49d4-923a-0b835666b9d1.png
avatar-maya.png 52576051-d16d-4f66-ba50-2ca95bc3b4bd.png
avatar-sam.png 92fb857d-526f-418e-bb9a-c6b168d22627.png
avatar-ruth.png dff0cea1-93b7-41c1-aea1-c6ab673a39b7.png
avatar-dana.png 112bdf4d-fc1b-4c37-98ef-53e063f2aec2.png
avatar-priya.png 5e91eee4-ef46-42e1-ac25-e6bb62ef9e45.png
avatar-jordan.png e80f0222-86fb-4459-80dc-2ceb448bace4.png
avatar-marcus.png b5eef118-3094-498f-8df7-5a6ecb6f50fa.png
item-sofa.png 7eb5b4a8-b269-4433-adde-079228ed7634.png
item-sofa-hero.png 6f8ef7aa-d408-4703-bae3-ca80e322360a.png
item-chair.png 8cd2e86b-4dd7-453c-8a68-d9f05bdaa423.png
item-chair-thumb.png ebe67d45-618f-4f3f-88bf-cef5b266ef51.png
item-books.png 5d86ab51-79d9-4bea-877a-74389526b7d5.png
item-paperbacks.png 0e0660be-dd8e-4ef4-a51f-6ad6bb72defb.png
item-yarn.png b378a197-984a-4752-ada1-084ea544e069.png
item-camera.png 0be25885-fede-480b-8664-a9db1f7d9758.png
icon-bell.svg d12394cd-d95c-4394-969c-ec0b0a73e542.svg
icon-filter.svg d0cac1be-e244-429b-8574-bb03f163e43a.svg
icon-x.svg 35bfa3d7-5a53-4004-ae4f-33f963dfa87f.svg
icon-chevron-left.svg 284a17c0-75c1-489b-abf6-decec25fa4da.svg
icon-more.svg 89669ecc-88d8-4b36-87a6-da2f96870df4.svg
icon-plus-ink.svg 2602e2c9-f062-4b29-8274-f4e2d45cb9a1.svg
icon-message-on-ink.svg 6c2bc1dd-25ec-454e-a224-99032ca438e2.svg
icon-shuffle-on-ink.svg 32dd2199-29f7-404a-875c-f292202b556f.svg
icon-post.svg 9d512728-e44a-462d-a60f-7159a592d926.svg
tab-home.svg 7a7724a8-19c9-4d37-abb1-c69c3f6b5c27.svg
tab-home-active.svg 65486448-da88-4fd2-ada7-2837524fb421.svg
tab-gift.svg 02457ae1-a4e7-46f0-a4ec-e8f864be3604.svg
tab-gift-active.svg 8b3ad99f-f9dc-4b4f-b6f4-654dd5c0cff8.svg
tab-plus.svg 8fc88141-adb2-49a7-a9b5-26f1b2297c6e.svg
tab-message.svg d9b90b82-7307-412f-9536-9371939b97ac.svg
tab-message-active.svg ac6610ea-eca4-4b99-973b-6c7e8bf3d9e2.svg
tab-user.svg b0ad7bc6-c1bb-4ee4-b89e-b9ee168c5069.svg
LIST
echo "Done. $(ls | wc -l) files in public/assets"
