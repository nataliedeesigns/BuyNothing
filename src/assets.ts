// Every static asset comes from the Figma file (see scripts/fetch-figma-assets.sh).
const a = (name: string) => `${import.meta.env.BASE_URL}assets/${name}`;

export const icons = {
  leaf: a("icon-leaf.svg"),
  search: a("icon-search.svg"),
  plus: a("icon-plus.svg"),
  checkOnInk: a("icon-check-on-ink.svg"),
  checkInk: a("icon-check-ink.svg"),
  sort: a("icon-sort.svg"),
  chevronDown: a("icon-chevron-down.svg"),
  chevronRight: a("icon-chevron-right.svg"),
  pin16: a("icon-pin-16.svg"),
  pin20: a("icon-pin-20.svg"),
  clock: a("icon-clock.svg"),
  heartOnInk: a("icon-heart-on-ink.svg"),
  heartMuted: a("icon-heart-muted.svg"),
  message: a("icon-message.svg"),
  pen: a("icon-pen.svg"),
  shuffle: a("icon-shuffle.svg"),
  camera: a("icon-camera.svg"),
  send: a("icon-send.svg"),
  unreadDot: a("unread-dot.svg"),
  toggleOn: a("toggle-on.svg"),
  // Mobile
  bell: a("icon-bell.svg"),
  filter: a("icon-filter.svg"),
  x: a("icon-x.svg"),
  chevronLeft: a("icon-chevron-left.svg"),
  more: a("icon-more.svg"),
  plusInk: a("icon-plus-ink.svg"),
  messageOnInk: a("icon-message-on-ink.svg"),
  shuffleOnInk: a("icon-shuffle-on-ink.svg"),
  post: a("icon-post.svg"),
};

/** Bottom-nav tab icons (active variants where the design provides one). */
export const tabIcons = {
  home: a("tab-home.svg"),
  homeActive: a("tab-home-active.svg"),
  gift: a("tab-gift.svg"),
  giftActive: a("tab-gift-active.svg"),
  plus: a("tab-plus.svg"),
  message: a("tab-message.svg"),
  messageActive: a("tab-message-active.svg"),
  user: a("tab-user.svg"),
};

export const avatars = {
  me: a("avatar-default.png"),
  maya: a("avatar-maya.png"),
  sam: a("avatar-sam.png"),
  lena: a("avatar-default.png"),
  theo: a("avatar-default.png"),
  ruth: a("avatar-ruth.png"),
  dana: a("avatar-dana.png"),
  priya: a("avatar-priya.png"),
  jordan: a("avatar-jordan.png"),
  marcus: a("avatar-marcus.png"),
};

export const images = {
  sofa: a("item-sofa.png"),
  sofaHero: a("item-sofa-hero.png"),
  chair: a("item-chair.png"),
  chairThumb: a("item-chair-thumb.png"),
  books: a("item-books.png"),
  paperbacks: a("item-paperbacks.png"),
  yarn: a("item-yarn.png"),
  camera: a("item-camera.png"),
};
