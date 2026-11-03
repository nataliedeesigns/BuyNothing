import { avatars, images } from "./assets";

export const categories = ["Furniture", "Kids & Baby", "Kitchen", "Clothing", "Books", "Garden", "Toys"] as const;
export type Category = (typeof categories)[number] | "Electronics";
export type Method = "Random pick" | "Tell your story";

export interface Neighbor {
  id: string;
  name: string;
  firstName: string;
  avatar: string;
  itemsGiven: number;
  since: number;
  /** Object pronoun used in copy, e.g. “Tell her why…”. */
  pronoun: string;
}

export interface Item {
  id: string;
  title: string;
  category: Category;
  method: Method;
  image: string;
  heroImage: string;
  /** Small square crop used in the chat item context. */
  thumbImage?: string;
  distanceMi: number;
  /** Hours since posted — used for sorting. */
  postedHoursAgo: number;
  postedLabel: string;
  crossStreets: string;
  endsLabel: string;
  giverId: string;
  interestedCount: number;
  ended: boolean;
  isNew?: boolean;
  description: string;
}

export const neighbors: Record<string, Neighbor> = {
  maya: { id: "maya", name: "Maya R.", firstName: "Maya", avatar: avatars.maya, itemsGiven: 12, since: 2021, pronoun: "her" },
  sam: { id: "sam", name: "Sam T.", firstName: "Sam", avatar: avatars.sam, itemsGiven: 7, since: 2022, pronoun: "them" },
  lena: { id: "lena", name: "Lena P.", firstName: "Lena", avatar: avatars.lena, itemsGiven: 4, since: 2023, pronoun: "them" },
  theo: { id: "theo", name: "Theo M.", firstName: "Theo", avatar: avatars.theo, itemsGiven: 9, since: 2020, pronoun: "them" },
  ruth: { id: "ruth", name: "Ruth A.", firstName: "Ruth", avatar: avatars.ruth, itemsGiven: 15, since: 2019, pronoun: "them" },
  dana: { id: "dana", name: "Dana K.", firstName: "Dana", avatar: avatars.dana, itemsGiven: 6, since: 2022, pronoun: "them" },
};

export const items: Item[] = [
  {
    id: "green-velvet-sofa",
    title: "Green velvet sofa",
    category: "Furniture",
    method: "Tell your story",
    image: images.sofa,
    heroImage: images.sofaHero,
    distanceMi: 0.4,
    postedHoursAgo: 2,
    postedLabel: "Posted 2h ago",
    crossStreets: "Elm & 3rd",
    endsLabel: "Ends Sat, 5 PM",
    giverId: "maya",
    interestedCount: 8,
    ended: false,
    isNew: true,
    description:
      "3-seater, about 6 years old. A few pet scratches on the back left side; otherwise comfy and clean. You’ll need two people and a van to move it.",
  },
  {
    id: "rolling-desk-chair",
    title: "Rolling desk chair",
    category: "Furniture",
    method: "Random pick",
    image: images.chair,
    heroImage: images.chair,
    thumbImage: images.chairThumb,
    distanceMi: 0.8,
    postedHoursAgo: 5,
    postedLabel: "Posted 5h ago",
    crossStreets: "Oak & 5th",
    endsLabel: "Drawing Sat, 5 PM",
    giverId: "sam",
    interestedCount: 4,
    ended: false,
    description: "Adjustable height, mesh back, all five wheels roll smoothly. Small tear on the seat cushion.",
  },
  {
    id: "board-book-bundle",
    title: "Board book bundle",
    category: "Kids & Baby",
    method: "Random pick",
    image: images.books,
    heroImage: images.books,
    distanceMi: 0.2,
    postedHoursAgo: 24,
    postedLabel: "Posted 1d ago",
    crossStreets: "Birch & 2nd",
    endsLabel: "Drawing Sun, 12 PM",
    giverId: "lena",
    interestedCount: 3,
    ended: false,
    description: "About 15 board books for ages 0–3. Well loved but all pages intact.",
  },
  {
    id: "knitting-yarn-bundle",
    title: "Knitting yarn bundle",
    category: "Clothing",
    method: "Random pick",
    image: images.yarn,
    heroImage: images.yarn,
    distanceMi: 0.6,
    postedHoursAgo: 26,
    postedLabel: "Posted 1d ago",
    crossStreets: "Cedar & 7th",
    endsLabel: "Drawing Sun, 6 PM",
    giverId: "ruth",
    interestedCount: 2,
    ended: false,
    description: "Eight skeins of wool-blend yarn in mustard, sage, blush and oat. Great for a scarf or two.",
  },
  {
    id: "box-of-paperbacks",
    title: "Box of paperbacks",
    category: "Books",
    method: "Tell your story",
    image: images.paperbacks,
    heroImage: images.paperbacks,
    distanceMi: 0.9,
    postedHoursAgo: 48,
    postedLabel: "Posted 2d ago",
    crossStreets: "Maple & 1st",
    endsLabel: "Ends Mon, 9 AM",
    giverId: "theo",
    interestedCount: 5,
    ended: false,
    description: "Around 30 paperbacks — mostly mysteries and a few sci-fi classics.",
  },
  {
    id: "vintage-film-camera",
    title: "Vintage film camera",
    category: "Electronics",
    method: "Random pick",
    image: images.camera,
    heroImage: images.camera,
    distanceMi: 1.1,
    postedHoursAgo: 150,
    postedLabel: "Posted Oct 28",
    crossStreets: "Pine & 4th",
    endsLabel: "Ended",
    giverId: "dana",
    interestedCount: 11,
    ended: true,
    description: "35mm SLR with a 50mm lens. Shutter works; light meter is unreliable.",
  },
];

export const getItem = (id: string) => items.find((i) => i.id === id);

/* ---------- Messages ---------- */

export type ConversationKind = "Giving" | "Receiving";

export interface ChatMessage {
  id: string;
  from: "me" | "them";
  text: string;
  time: string;
  status?: "Read" | "Delivered";
}

export interface Conversation {
  id: string;
  name: string;
  avatar: string;
  kind: ConversationKind;
  itemId: string;
  time: string;
  preview: string;
  unread: boolean;
  meta: string;
  contextLine: string;
  systemNote?: string;
  messages: ChatMessage[];
}

export const conversations: Conversation[] = [
  {
    id: "priya",
    name: "Priya S.",
    avatar: avatars.priya,
    kind: "Giving",
    itemId: "rolling-desk-chair",
    time: "9:12 AM",
    preview: "Saturday 10am works great!",
    unread: false,
    meta: "0.3 mi away · usually replies within an hour",
    contextLine: "You’re giving · Pickup Sat",
    systemNote: "Priya was picked at random",
    messages: [
      { id: "p1", from: "me", text: "Hi Priya! You were picked for the desk chair 🎉 When works for pickup?", time: "9:02 AM", status: "Read" },
      { id: "p2", from: "them", text: "Yay, thank you!! Saturday 10am works great.", time: "9:12 AM" },
      { id: "p3", from: "me", text: "Perfect — it’ll be on the porch at Elm & 3rd.", time: "9:14 AM", status: "Delivered" },
    ],
  },
  {
    id: "jordan",
    name: "Jordan Lee",
    avatar: avatars.jordan,
    kind: "Giving",
    itemId: "green-velvet-sofa",
    time: "8:40 AM",
    preview: "Is it still available?",
    unread: true,
    meta: "0.6 mi away · usually replies within a day",
    contextLine: "You’re giving · 8 interested",
    messages: [{ id: "j1", from: "them", text: "Hi! Is it still available?", time: "8:40 AM" }],
  },
  {
    id: "maya",
    name: "Maya R.",
    avatar: avatars.maya,
    kind: "Receiving",
    itemId: "board-book-bundle",
    time: "Yesterday",
    preview: "You’re welcome! Enjoy",
    unread: false,
    meta: "0.4 mi away · usually replies within an hour",
    contextLine: "You received · Picked up",
    messages: [
      { id: "m1", from: "me", text: "Got the books — my daughter already loves them. Thank you!", time: "Yesterday", status: "Read" },
      { id: "m2", from: "them", text: "You’re welcome! Enjoy", time: "Yesterday" },
    ],
  },
  {
    id: "marcus",
    name: "Marcus O.",
    avatar: avatars.marcus,
    kind: "Receiving",
    itemId: "vintage-film-camera",
    time: "Oct 30",
    preview: "Picked up, thanks so much.",
    unread: false,
    meta: "1.1 mi away · usually replies within a day",
    contextLine: "You received · Picked up",
    messages: [{ id: "k1", from: "them", text: "Picked up, thanks so much.", time: "Oct 30" }],
  },
];

export const NEIGHBOR_COUNT = 214;
export const NEIGHBORHOOD = "Maplewood";
