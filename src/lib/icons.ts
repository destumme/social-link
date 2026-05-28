import type { IconSvgElement } from "@hugeicons/react";
import {
  Mail01Icon,
  SmartPhone01Icon,
  Link01Icon,
  LinkForwardIcon,
  GlobeIcon,
  Facebook01Icon,
  InstagramIcon,
  Linkedin01Icon,
  YoutubeIcon,
  RedditIcon,
  PinterestIcon,
  SnapchatIcon,
  ThreadsIcon,
  BlueskyIcon,
  MastodonIcon,
  TumblrIcon,
  WhatsappIcon,
  TelegramIcon,
  DiscordIcon,
  SignalIcon,
  WechatIcon,
  MessengerIcon,
  SkypeIcon,
  GithubIcon,
  GitlabIcon,
  SpotifyIcon,
  SoundcloudIcon,
  LastFmIcon,
  TwitchIcon,
  Kickstarter01Icon,
  ShopifyIcon,
  PaypalIcon,
  StripeIcon,
  WebflowIcon,
  WordpressIcon,
  ZoomIcon,
  WikipediaIcon,
  PexelsIcon,
  UnsplashIcon,
  // Override icons
  TelephoneIcon,
  UserGroupIcon,
  Camera01Icon,
  Image01Icon,
  Briefcase01Icon,
  Presentation01Icon,
  AddressBookIcon,
  PlayCircleIcon,
  LiveStreaming01Icon,
  GameController01Icon,
  BubbleChatIcon,
  Notification01Icon,
  Bookmark01Icon,
  PinLocation01Icon,
  Search01Icon,
  CloudIcon,
  Pen01Icon,
  Book01Icon,
  LibraryIcon,
  CodeIcon,
  TerminalIcon,
  SourceCodeIcon,
  HeadphonesIcon,
  MusicNote01Icon,
  AudioWave01Icon,
  Radio01Icon,
  ShoppingBag01Icon,
  CreditCardIcon,
  Wallet01Icon,
  Rocket01Icon,
  Money01Icon,
  BrushIcon,
  Layout01Icon,
  WebDesign01Icon,
  AntennaIcon,
  WaveIcon,
  Message01Icon,
  Chat01Icon,
  Video01Icon,
  User02Icon,
  UserAdd01Icon,
  UserCheck01Icon,
  MapPinIcon,
  Calendar01Icon,
  ShieldUserIcon,
  AudioWaveIcon,
} from "@hugeicons/core-free-icons";

export const iconMap: Record<string, unknown> = {
  CONTACT_INFO: SmartPhone01Icon,
  MAILING_ADDRESS: MapPinIcon,
  SOCIAL_LINK: Link01Icon,
  PROFESSIONAL_LINK: Briefcase01Icon,
  WEBSITE_LINK: GlobeIcon,
  MESSAGING_HANDLE: Chat01Icon,
  OTHER: LinkForwardIcon,
};

export const traitCategoryGroups = [
  {
    label: "Categories",
    options: [
      { value: "CONTACT_INFO", label: "Contact Info" },
      { value: "MAILING_ADDRESS", label: "Mailing Address" },
      { value: "SOCIAL_LINK", label: "Social Link" },
      { value: "PROFESSIONAL_LINK", label: "Professional Link" },
      { value: "WEBSITE_LINK", label: "Website Link" },
      { value: "MESSAGING_HANDLE", label: "Messaging Handle" },
      { value: "OTHER", label: "Other" },
    ],
  },
] as const;

export interface OverrideIconOption {
  value: string;
  label: string;
  icon: IconSvgElement;
}

export const overrideIconOptions: {
  label: string;
  options: OverrideIconOption[];
}[] = [
  {
    label: "Communication",
    options: [
      { value: "telephone", label: "Telephone", icon: TelephoneIcon },
      { value: "mail-01", label: "Mail", icon: Mail01Icon },
      { value: "chat-01", label: "Chat", icon: Chat01Icon },
      { value: "message-01", label: "Message", icon: Message01Icon },
      { value: "video-01", label: "Video", icon: Video01Icon },
    ],
  },
  {
    label: "Social & Links",
    options: [
      { value: "link-01", label: "Link", icon: Link01Icon },
      { value: "link-forward", label: "External Link", icon: LinkForwardIcon },
      { value: "globe", label: "Globe", icon: GlobeIcon },
      { value: "user-group", label: "Group", icon: UserGroupIcon },
    ],
  },
  {
    label: "Visual",
    options: [
      { value: "camera-01", label: "Camera", icon: Camera01Icon },
      { value: "image-01", label: "Image", icon: Image01Icon },
    ],
  },
  {
    label: "Professional",
    options: [
      { value: "briefcase-01", label: "Briefcase", icon: Briefcase01Icon },
      {
        value: "presentation-01",
        label: "Presentation",
        icon: Presentation01Icon,
      },
      { value: "address-book", label: "Address Book", icon: AddressBookIcon },
    ],
  },
  {
    label: "Video & Gaming",
    options: [
      { value: "play-circle", label: "Play", icon: PlayCircleIcon },
      {
        value: "live-streaming-01",
        label: "Live Stream",
        icon: LiveStreaming01Icon,
      },
      {
        value: "game-controller-01",
        label: "Game Controller",
        icon: GameController01Icon,
      },
    ],
  },
  {
    label: "Discussion",
    options: [
      { value: "bubble-chat", label: "Bubble Chat", icon: BubbleChatIcon },
      {
        value: "notification-01",
        label: "Notification",
        icon: Notification01Icon,
      },
    ],
  },
  {
    label: "Bookmark & Discovery",
    options: [
      { value: "bookmark-01", label: "Bookmark", icon: Bookmark01Icon },
      { value: "pin-location-01", label: "Pin", icon: PinLocation01Icon },
      { value: "search-01", label: "Search", icon: Search01Icon },
    ],
  },
  {
    label: "Weather",
    options: [{ value: "cloud", label: "Cloud", icon: CloudIcon }],
  },
  {
    label: "Writing & Knowledge",
    options: [
      { value: "pen-01", label: "Pen", icon: Pen01Icon },
      { value: "book-01", label: "Book", icon: Book01Icon },
      { value: "library", label: "Library", icon: LibraryIcon },
    ],
  },
  {
    label: "Code & Dev",
    options: [
      { value: "code", label: "Code", icon: CodeIcon },
      { value: "terminal", label: "Terminal", icon: TerminalIcon },
      { value: "source-code", label: "Source Code", icon: SourceCodeIcon },
      { value: "web-design-01", label: "Web Design", icon: WebDesign01Icon },
    ],
  },
  {
    label: "Music & Audio",
    options: [
      { value: "headphones", label: "Headphones", icon: HeadphonesIcon },
      { value: "music-note-01", label: "Music Note", icon: MusicNote01Icon },
      { value: "audio-wave-01", label: "Audio Wave", icon: AudioWave01Icon },
      { value: "audio-wave", label: "Audio Lines", icon: AudioWaveIcon },
      { value: "radio-01", label: "Radio", icon: Radio01Icon },
    ],
  },
  {
    label: "Commerce & Payment",
    options: [
      {
        value: "shopping-bag-01",
        label: "Shopping Bag",
        icon: ShoppingBag01Icon,
      },
      { value: "credit-card", label: "Credit Card", icon: CreditCardIcon },
      { value: "wallet-01", label: "Wallet", icon: Wallet01Icon },
      { value: "money-01", label: "Money", icon: Money01Icon },
    ],
  },
  {
    label: "Launch & Design",
    options: [
      { value: "rocket-01", label: "Rocket", icon: Rocket01Icon },
      { value: "brush", label: "Brush", icon: BrushIcon },
      { value: "layout-01", label: "Layout", icon: Layout01Icon },
    ],
  },
  {
    label: "Signal & Broadcast",
    options: [
      { value: "antenna", label: "Antenna", icon: AntennaIcon },
      { value: "wave", label: "Wave", icon: WaveIcon },
    ],
  },
  {
    label: "People",
    options: [
      { value: "user", label: "User", icon: User02Icon },
      { value: "user-add-01", label: "User Add", icon: UserAdd01Icon },
      { value: "user-check-01", label: "User Check", icon: UserCheck01Icon },
      { value: "shield-user", label: "Shield User", icon: ShieldUserIcon },
    ],
  },
  {
    label: "Location & Time",
    options: [
      { value: "map-pin", label: "Map Pin", icon: MapPinIcon },
      { value: "calendar-01", label: "Calendar", icon: Calendar01Icon },
    ],
  },
  {
    label: "Platforms",
    options: [
      { value: "facebook", label: "Facebook", icon: Facebook01Icon },
      { value: "instagram", label: "Instagram", icon: InstagramIcon },
      { value: "linkedin", label: "LinkedIn", icon: Linkedin01Icon },
      { value: "youtube", label: "YouTube", icon: YoutubeIcon },
      { value: "reddit", label: "Reddit", icon: RedditIcon },
      { value: "pinterest", label: "Pinterest", icon: PinterestIcon },
      { value: "snapchat", label: "Snapchat", icon: SnapchatIcon },
      { value: "threads", label: "Threads", icon: ThreadsIcon },
      { value: "bluesky", label: "Bluesky", icon: BlueskyIcon },
      { value: "mastodon", label: "Mastodon", icon: MastodonIcon },
      { value: "tumblr", label: "Tumblr", icon: TumblrIcon },
      { value: "whatsapp", label: "WhatsApp", icon: WhatsappIcon },
      { value: "telegram", label: "Telegram", icon: TelegramIcon },
      { value: "discord", label: "Discord", icon: DiscordIcon },
      { value: "signal", label: "Signal", icon: SignalIcon },
      { value: "wechat", label: "WeChat", icon: WechatIcon },
      { value: "messenger", label: "Messenger", icon: MessengerIcon },
      { value: "skype", label: "Skype", icon: SkypeIcon },
      { value: "github", label: "GitHub", icon: GithubIcon },
      { value: "gitlab", label: "GitLab", icon: GitlabIcon },
      { value: "spotify", label: "Spotify", icon: SpotifyIcon },
      { value: "soundcloud", label: "SoundCloud", icon: SoundcloudIcon },
      { value: "last-fm", label: "Last.fm", icon: LastFmIcon },
      { value: "twitch", label: "Twitch", icon: TwitchIcon },
      { value: "kickstarter", label: "Kickstarter", icon: Kickstarter01Icon },
      { value: "shopify", label: "Shopify", icon: ShopifyIcon },
      { value: "paypal", label: "PayPal", icon: PaypalIcon },
      { value: "stripe", label: "Stripe", icon: StripeIcon },
      { value: "webflow", label: "Webflow", icon: WebflowIcon },
      { value: "wordpress", label: "WordPress", icon: WordpressIcon },
      { value: "zoom", label: "Zoom", icon: ZoomIcon },
      { value: "wikipedia", label: "Wikipedia", icon: WikipediaIcon },
      { value: "pexels", label: "Pexels", icon: PexelsIcon },
      { value: "unsplash", label: "Unsplash", icon: UnsplashIcon },
    ],
  },
];

export function getCategoryIconElement(value: string | null | undefined) {
  if (!value) return null;
  const icon = iconMap[value];
  return icon ? (icon as IconSvgElement) : null;
}

export function getOverrideIconElement(value: string | null | undefined) {
  if (!value) return null;
  for (const group of overrideIconOptions) {
    for (const opt of group.options) {
      if (opt.value === value) return opt.icon;
    }
  }
  return null;
}
