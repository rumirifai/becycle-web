export interface DetectionResult {
    recycle_id: number;
    material_type: string;
    can_be_recycled: boolean;
    recycle_process: string;
    possible_products: string;
    image_url: string;
  }