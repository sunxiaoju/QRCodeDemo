export type ErrorType = 'AbortError' | 'NotAllowedError' | 'NotFoundError' | 'NotReadableError' | 'OverConstrainedError' | 'SecurityError' | 'TypeError';

export interface QRCodeResult {
  err?: {
    type: ErrorType,
    message: string
  },
  data?: string,
}

export interface GlobalBindData {
  video: HTMLVideoElement;
  canvasElement: HTMLCanvasElement | null;
  canvas: CanvasRenderingContext2D | null;
}

export type Callback = (params: QRCodeResult) => void;

export type InitCamera = (id: string, callback: Callback) => GlobalBindData?;
export default InitCamera;
