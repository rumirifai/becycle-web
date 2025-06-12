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