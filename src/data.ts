import { avatars, images } from "./assets";

export const categories = ["Furniture", "Kids & Baby", "Kitchen", "Clothing", "Books", "Garden", "Toys"] as const;
export type Category = (typeof categories)[number] | "Electronics";
export const allCategories: Category[] = [...categories, "Electronics"];
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
  distanceMi: number;
}

export const neighbors: Record<string, Neighbor> = {
  maya: { id: "maya", name: "Maya R.", firstName: "Maya", avatar: avatars.maya, itemsGiven: 12, since: 2021, pronoun: "her", distanceMi: 0.4 },
  sam: { id: "sam", name: "Sam T.", firstName: "Sam", avatar: avatars.sam, itemsGiven: 7, since: 2022, pronoun: "them", distanceMi: 0.8 },
  lena: { id: "lena", name: "Lena P.", firstName: "Lena", avatar: avatars.lena, itemsGiven: 4, since: 2023, pronoun: "them", distanceMi: 0.2 },
  theo: { id: "theo", name: "Theo M.", firstName: "Theo", avatar: avatars.theo, itemsGiven: 9, since: 2020, pronoun: "them", distanceMi: 0.9 },
  ruth: { id: "ruth", name: "Ruth A.", firstName: "Ruth", avatar: avatars.ruth, itemsGiven: 15, since: 2019, pronoun: "them", distanceMi: 0.6 },
  dana: { id: "dana", name: "Dana K.", firstName: "Dana", avatar: avatars.dana, itemsGiven: 6, since: 2022, pronoun: "them", distanceMi: 1.1 },
  priya: { id: "priya", name: "Priya S.", firstName: "Priya", avatar: avatars.priya, itemsGiven: 3, since: 2024, pronoun: "them", distanceMi: 0.3 },
  jordan: { id: "jordan", name: "Jordan Lee", firstName: "Jordan", avatar: avatars.jordan, itemsGiven: 5, since: 2022, pronoun: "them", distanceMi: 0.6 },
  marcus: { id: "marcus", name: "Marcus O.", firstName: "Marcus", avatar: avatars.marcus, itemsGiven: 2, since: 2023, pronoun: "them", distanceMi: 1.1 },
};

/* ---------- Items neighbors are giving (Browse) ---------- */

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
  /** Hours since posted — used for "Newest". */
  postedHoursAgo: number;
  postedLabel: string;
  /** Hours until the giveaway ends — used for "Ending soon". */
  endsInHours: number;
  crossStreets: string;
  endsLabel: string;
  condition: string;
  pickup: string;
  giverId: string;
  interestedCount: number;
  ended: boolean;
  isNew?: boolean;
  description: string;
}

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
    endsInHours: 92,
    crossStreets: "Elm & 3rd",
    endsLabel: "Ends Sat, 5 PM",
    condition: "Gently used",
    pickup: "Porch pickup, weekends",
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
    endsInHours: 92,
    crossStreets: "Oak & 5th",
    endsLabel: "Drawing Sat, 5 PM",
    condition: "Used — small tear",
    pickup: "Garage pickup, evenings",
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
    endsInHours: 111,
    crossStreets: "Birch & 2nd",
    endsLabel: "Drawing Sun, 12 PM",
    condition: "Well loved",
    pickup: "Porch pickup, anytime",
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
    endsInHours: 117,
    crossStreets: "Cedar & 7th",
    endsLabel: "Drawing Sun, 6 PM",
    condition: "New, unopened",
    pickup: "Porch pickup, weekdays",
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
    endsInHours: 135,
    crossStreets: "Maple & 1st",
    endsLabel: "Ends Mon, 9 AM",
    condition: "Good",
    pickup: "Porch pickup, weekends",
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
    endsInHours: 0,
    crossStreets: "Pine & 4th",
    endsLabel: "Ended",
    condition: "Works, light meter unreliable",
    pickup: "Picked up",
    giverId: "dana",
    interestedCount: 11,
    ended: true,
    description: "35mm SLR with a 50mm lens. Shutter works; light meter is unreliable.",
  },
];

export const getItem = (id: string) => items.find((i) => i.id === id);

/* ---------- The user's own giveaways (My Items → Giving) ---------- */

export type GiveawayStatus = "active" | "pickup" | "gifted" | "ended";

export interface InterestedNeighbor {
  neighborId: string;
  story: string;
}

export interface Giveaway {
  id: string;
  title: string;
  category: Category;
  method: Method;
  photos: string[];
  description: string;
  pickup: string;
  status: GiveawayStatus;
  endsLabel: string;
  /** Short form used in tags/meta, e.g. "Sat". */
  endsDay: string;
  daysLeft: number;
  views: number;
  postedLabel: string;
  interested: InterestedNeighbor[];
  recipientId?: string;
  pickupDay?: string;
  giftedLabel?: string;
}

export const seedGiveaways: Giveaway[] = [
  {
    id: "sofa",
    title: "Green velvet sofa",
    category: "Furniture",
    method: "Tell your story",
    photos: [images.sofa],
    description: "3-seater, about 6 years old.",
    pickup: "Porch pickup near Elm & 3rd",
    status: "active",
    endsLabel: "Sat 5 PM",
    endsDay: "Sat",
    daysLeft: 2,
    views: 46,
    postedLabel: "Posted Nov 1",
    interested: [
      { neighborId: "priya", story: "We just moved in with two toddlers and have nowhere to sit — this would make our first family movie night!" },
      { neighborId: "marcus", story: "Setting up a reading corner at the community garden shed for neighborhood kids." },
      { neighborId: "jordan", story: "My couch gave out last month and I’ve been sitting on a camping chair since." },
      { neighborId: "ruth", story: "My grandkids visit every Sunday and we’re all squeezed onto a loveseat." },
      { neighborId: "sam", story: "Furnishing a first apartment on a very tight budget." },
      { neighborId: "lena", story: "Our book club meets at my place and we’re short on seats." },
      { neighborId: "theo", story: "Would love it for the shared lounge in our building." },
      { neighborId: "dana", story: "Green is my favorite color and my living room is empty!" },
    ],
  },
  {
    id: "chair",
    title: "Rolling desk chair",
    category: "Furniture",
    method: "Random pick",
    photos: [images.chairThumb],
    description: "Adjustable height, mesh back.",
    pickup: "Porch pickup near Elm & 3rd",
    status: "pickup",
    endsLabel: "Sat 5 PM",
    endsDay: "Sat",
    daysLeft: 0,
    views: 31,
    postedLabel: "Posted Oct 31",
    interested: [
      { neighborId: "priya", story: "" },
      { neighborId: "jordan", story: "" },
      { neighborId: "theo", story: "" },
    ],
    recipientId: "priya",
    pickupDay: "Sat",
  },
  {
    id: "camera",
    title: "Vintage film camera",
    category: "Electronics",
    method: "Random pick",
    photos: [images.camera],
    description: "35mm SLR with a 50mm lens.",
    pickup: "Porch pickup near Elm & 3rd",
    status: "gifted",
    endsLabel: "Oct 30",
    endsDay: "Oct 30",
    daysLeft: 0,
    views: 58,
    postedLabel: "Posted Oct 28",
    interested: [],
    giftedLabel: "Gifted Oct 30",
  },
];

/** End-date choices offered when posting a giveaway. Today is Tue, Nov 3. */
export const endOptions = [
  { value: "thu", label: "Thu, Nov 5 · 5:00 PM", day: "Thu", daysLeft: 2 },
  { value: "fri", label: "Fri, Nov 6 · 5:00 PM", day: "Fri", daysLeft: 3 },
  { value: "sat", label: "Sat, Nov 7 · 5:00 PM", day: "Sat", daysLeft: 4 },
  { value: "sun", label: "Sun, Nov 8 · 5:00 PM", day: "Sun", daysLeft: 5 },
] as const;

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
  neighborId: string;
  kind: ConversationKind;
  itemTitle: string;
  itemImage?: string;
  /** Where "View item" goes. */
  itemHref?: string;
  /** Short status shown as a tag in the mobile chat header, e.g. "PICKUP SAT". */
  statusTag?: string;
  time: string;
  preview: string;
  unread: boolean;
  meta: string;
  contextLine: string;
  systemNote?: string;
  messages: ChatMessage[];
}

export const seedConversations: Conversation[] = [
  {
    id: "priya",
    neighborId: "priya",
    kind: "Giving",
    itemTitle: "Rolling desk chair",
    itemImage: images.chairThumb,
    itemHref: "/giving/chair",
    statusTag: "Pickup Sat",
    time: "9:12 AM",
    preview: "Saturday 10am works great, thank you!",
    unread: true,
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
    neighborId: "jordan",
    kind: "Giving",
    itemTitle: "Green velvet sofa",
    itemImage: images.sofa,
    itemHref: "/giving/sofa",
    time: "8:40 AM",
    preview: "Is it still available?",
    unread: true,
    meta: "0.6 mi away · usually replies within a day",
    contextLine: "You’re giving · 8 interested",
    messages: [{ id: "j1", from: "them", text: "Hi! Is it still available?", time: "8:40 AM" }],
  },
  {
    id: "maya",
    neighborId: "maya",
    kind: "Receiving",
    itemTitle: "Board book bundle",
    itemImage: images.books,
    itemHref: "/item/board-book-bundle",
    statusTag: "Picked up",
    time: "Yesterday",
    preview: "You’re welcome! Enjoy 📚",
    unread: false,
    meta: "0.4 mi away · usually replies within an hour",
    contextLine: "You received · Picked up",
    messages: [
      { id: "m1", from: "me", text: "Got the books — my daughter already loves them. Thank you!", time: "Yesterday", status: "Read" },
      { id: "m2", from: "them", text: "You’re welcome! Enjoy 📚", time: "Yesterday" },
    ],
  },
  {
    id: "marcus",
    neighborId: "marcus",
    kind: "Receiving",
    itemTitle: "Vintage film camera",
    itemImage: images.camera,
    itemHref: "/item/vintage-film-camera",
    statusTag: "Picked up",
    time: "Oct 30",
    preview: "Picked up, thanks so much.",
    unread: false,
    meta: "1.1 mi away · usually replies within a day",
    contextLine: "You received · Picked up",
    messages: [{ id: "k1", from: "them", text: "Picked up, thanks so much.", time: "Oct 30" }],
  },
  {
    id: "dana",
    neighborId: "dana",
    kind: "Receiving",
    itemTitle: "Kids’ rain boots",
    statusTag: "Picked up",
    time: "Oct 28",
    preview: "Left them on the porch.",
    unread: false,
    meta: "1.1 mi away · usually replies within a day",
    contextLine: "You received · Picked up",
    messages: [{ id: "d1", from: "them", text: "Left them on the porch.", time: "Oct 28" }],
  },
];

export const NEIGHBOR_COUNT = 214;
export const NEIGHBORHOOD = "Maplewood";
