export interface DetectionResult {
  recycle_id: number;
  material_type: string;
  can_be_recycled: boolean;
  recycle_process: string;
  possible_products: string;
  image_url: string;
}

export interface HistoryItem {
  history_id: number;
  image_url: string;
  prediction_result: string;
  created_at: string;
  user_id: number;
  recycle_id: number;
  material_type?: string;
  can_be_recycled?: boolean;
  recycle_process?: string;
  possible_products?: string;
}

export interface Article {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

export interface UserProfile {
  user_id: number;
  full_name: string;
  bio: string;
  address: string;
  email: string;
  username: string;
  exp: number;
  points: number;
  profile_picture: string | null;
}

export interface Reward {
  reward_id: number;
  name: string;
  description: string;
  image_url: string;
  points_required: number;
}