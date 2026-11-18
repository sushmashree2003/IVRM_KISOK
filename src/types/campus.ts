export interface CampusLiveNotice {
  id: string;
  text: string;
  badge?: string;
  priority?: "normal" | "high" | "urgent";
  date?: string;
}

export interface CampusBranding {
  instituteName: string;
  shortCode: string;
  aiName?: string;
  logo: string;
  motto: string;
  affiliation: string;
  tickerNotices: (string | CampusLiveNotice)[];
  virtualTour360Url?: string;
  virtualTourTitle?: string;
}

export interface HeroConfig {
  videoUrl: string;
  posterUrl: string;
  backgroundImageUrl?: string;
  kicker?: string;
  headline: string;
  subheadline: string;
  badge1Bold?: string;
  badge1Sub?: string;
  badge2Bold?: string;
  badge2Sub?: string;
  badge3Bold?: string;
  badge3Sub?: string;
  badge4Bold?: string;
  badge4Sub?: string;
  button1Text?: string;
  button2Text?: string;
  legacyTag?: string;
  ctaText?: string;
  ctaAction?: string;
}

export interface LeadershipMember {
  id: string;
  name: string;
  designation: string;
  image: string;
  quotePreview: string;
  fullQuote: string;
  order?: number;
  active?: boolean;
}

export interface TourFacility {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
  highlights?: string[];
  order?: number;
  active?: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  shortTitle: string;
  category: string;
  categoryFilter: "academics" | "sports" | "cultural" | "facilities" | "all";
  date: string;
  description: string;
  src: string;
  featured?: boolean;
}

export interface CampusEvent {
  id: string;
  day: string;
  month: string;
  year?: string;
  name: string;
  tag: string;
  tagClass: "academics" | "sports" | "stem" | "fest" | "ptm" | "general";
  venue: string;
  image: string;
  cardClass?: string;
  description?: string;
  time?: string;
}

export interface CampusAchievement {
  id: string;
  title: string;
  badge: string;
  rank: string;
  category: string;
  date: string;
  image: string;
  description?: string;
}

export interface QuickStats {
  studentsCount: string;
  facultyCount: string;
  busCount: string;
  labsCount: string;
  campusArea: string;
}

export interface RoleHubConfig {
  title?: string;
  kicker?: string;
  videoUrl?: string;
  posterUrl?: string;
  backgroundImageUrl?: string;
  useHeroVideo?: boolean;
  transparent?: boolean;
  overlayOpacity?: number;
}

export interface CampusInfoData {
  branding: CampusBranding;
  hero: HeroConfig;
  roleHub?: RoleHubConfig;
  quickStats: QuickStats;
  stats?: QuickStats;
  leadership: LeadershipMember[];
  facilities: TourFacility[];
  gallery: GalleryItem[];
  events: CampusEvent[];
  achievements: CampusAchievement[];
  footerMotto?: string;
  virtualTour360Url?: string;
}
