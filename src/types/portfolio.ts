export type Company = 'Hexavia' | 'Tdotwheels' | 'Paidflow' | 'Other';

export type MediaType = 'video' | 'graphics';

export interface ProjectMetrics {
  views?: string;
  impressions?: string;
  engagementRate?: string;
  leadsOrSales?: string;
  sharesOrSaves?: string;
  roas?: string;
  adSpend?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  company: Company;
  mediaType: MediaType;
  mediaUrl: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  description: string;
  strategyHighlights: string[];
  metrics: ProjectMetrics;
  tags: string[];
  clientObjective?: string;
  deliverables?: string[];
  isMetaAd?: boolean;
  metaAdDetails?: {
    campaignType: 'Lead Generation' | 'Conversions / Sales' | 'Traffic & Retargeting';
    roas?: string;
    adSpend?: string;
    targetAudience?: string;
  };
  instagramUrl?: string;
  reelId?: string;
  createdAt: string;
  featured?: boolean;
}

export interface PostWorkFormData {
  title: string;
  company: Company;
  mediaType: MediaType;
  mediaUrl: string;
  videoUrl?: string;
  instagramUrl?: string;
  description: string;
  strategyHighlights: string;
  views?: string;
  engagementRate?: string;
  impressions?: string;
  leadsOrSales?: string;
  roas?: string;
  tags: string;
  isMetaAd?: boolean;
  featured?: boolean;
}
