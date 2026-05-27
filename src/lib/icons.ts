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
  PHONE_NUMBER: SmartPhone01Icon,
  EMAIL: Mail01Icon,
  SOCIAL_MEDIA_LINK: Link01Icon,
  WEBSITE_LINK: GlobeIcon,
  FACEBOOK: Facebook01Icon,
  INSTAGRAM: InstagramIcon,
  LINKEDIN: Linkedin01Icon,
  YOUTUBE: YoutubeIcon,
  REDDIT: RedditIcon,
  PINTEREST: PinterestIcon,
  SNAPCHAT: SnapchatIcon,
  THREADS: ThreadsIcon,
  BLUESKY: BlueskyIcon,
  MASTODON: MastodonIcon,
  TUMBLR: TumblrIcon,
  WHATSAPP: WhatsappIcon,
  TELEGRAM: TelegramIcon,
  DISCORD: DiscordIcon,
  SIGNAL: SignalIcon,
  WECHAT: WechatIcon,
  MESSENGER: MessengerIcon,
  SKYPE: SkypeIcon,
  GITHUB: GithubIcon,
  GITLAB: GitlabIcon,
  SPOTIFY: SpotifyIcon,
  SOUNDCLOUD: SoundcloudIcon,
  LAST_FM: LastFmIcon,
  TWITCH: TwitchIcon,
  KICKSTARTER: Kickstarter01Icon,
  SHOPIFY: ShopifyIcon,
  PAYPAL: PaypalIcon,
  STRIPE: StripeIcon,
  WEBFLOW: WebflowIcon,
  WORDPRESS: WordpressIcon,
  ZOOM: ZoomIcon,
  WIKIPEDIA: WikipediaIcon,
  PEXELS: PexelsIcon,
  UNSPLASH: UnsplashIcon,
};

export const traitCategoryGroups = [
  {
    label: "Contact Info",
    options: [
      { value: "PHONE_NUMBER", label: "Phone Number" },
      { value: "EMAIL", label: "Email" },
    ],
  },
  {
    label: "Social Media",
    options: [
      { value: "FACEBOOK", label: "Facebook" },
      { value: "INSTAGRAM", label: "Instagram" },
      { value: "LINKEDIN", label: "LinkedIn" },
      { value: "YOUTUBE", label: "YouTube" },
      { value: "REDDIT", label: "Reddit" },
      { value: "PINTEREST", label: "Pinterest" },
      { value: "SNAPCHAT", label: "Snapchat" },
      { value: "THREADS", label: "Threads" },
      { value: "BLUESKY", label: "Bluesky" },
      { value: "MASTODON", label: "Mastodon" },
      { value: "TUMBLR", label: "Tumblr" },
    ],
  },
  {
    label: "Messaging",
    options: [
      { value: "WHATSAPP", label: "WhatsApp" },
      { value: "TELEGRAM", label: "Telegram" },
      { value: "DISCORD", label: "Discord" },
      { value: "SIGNAL", label: "Signal" },
      { value: "WECHAT", label: "WeChat" },
      { value: "MESSENGER", label: "Messenger" },
      { value: "SKYPE", label: "Skype" },
    ],
  },
  {
    label: "Dev/Tech",
    options: [
      { value: "GITHUB", label: "GitHub" },
      { value: "GITLAB", label: "GitLab" },
    ],
  },
  {
    label: "Music",
    options: [
      { value: "SPOTIFY", label: "Spotify" },
      { value: "SOUNDCLOUD", label: "SoundCloud" },
      { value: "LAST_FM", label: "Last.fm" },
    ],
  },
  {
    label: "Streaming",
    options: [
      { value: "TWITCH", label: "Twitch" },
      { value: "KICKSTARTER", label: "Kickstarter" },
    ],
  },
  {
    label: "Business",
    options: [
      { value: "SHOPIFY", label: "Shopify" },
      { value: "PAYPAL", label: "PayPal" },
      { value: "STRIPE", label: "Stripe" },
      { value: "WEBFLOW", label: "Webflow" },
      { value: "WORDPRESS", label: "WordPress" },
    ],
  },
  {
    label: "Other",
    options: [
      { value: "ZOOM", label: "Zoom" },
      { value: "WIKIPEDIA", label: "Wikipedia" },
      { value: "PEXELS", label: "Pexels" },
      { value: "UNSPLASH", label: "Unsplash" },
    ],
  },
  {
    label: "Links",
    options: [
      { value: "SOCIAL_MEDIA_LINK", label: "Social Media Link" },
      { value: "WEBSITE_LINK", label: "Website Link" },
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
