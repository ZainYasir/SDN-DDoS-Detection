export interface PredictionResponse {
  predictions: string[];
}

export interface UploadState {
  status: 'idle' | 'uploading' | 'success' | 'error';
  message?: string;
  data?: PredictionResponse;
}