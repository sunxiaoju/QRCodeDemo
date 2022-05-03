import jsQR from "jsqr";
import { Point } from "jsqr/dist/locator";
import { Callback, ErrorType, GlobalBindData, InitCamera } from './index.d';

// 设置全局参量,默认参数只初始化一次
let video: HTMLVideoElement = document.createElement('video');
let canvasElement: HTMLCanvasElement | null  = null;
let canvas: CanvasRenderingContext2D | null = null;

// 设计一个全局对象，返回到外层，方便对数据进行控制
const globalBind: GlobalBindData = {
  // 可以在用户扫描到二维码之后，暂停数据流和继续数据流
  video,
  canvasElement,
  canvas,
};

// 设置全局接受参数
let globalOptions:  { id: string, callback: Callback };

/**
 * 通过canvas构建画布
*/
const createCanvas = (id: string) => {
  // 如果画布已经初始化之后不在重新获取
  if (canvas) return canvas;

  // 这里as专一一下，因为只有 HTMLCanvasElement 才有getContext方法
  canvasElement = document.getElementById(id) as HTMLCanvasElement;
  canvas = canvasElement.getContext('2d') as CanvasRenderingContext2D;
}

/**
 * 创建video
*/
const createVideo = () => {
  if (video) return video;
  video = document.createElement('video');
}

/***
 * 初始化相机权限
*/
const initCamera: InitCamera = (id:string, callback: Callback) => {
  // 传入参数全局统一管理
  globalOptions = { id, callback }
  // 初始化数据
  createCanvas(id);
  createVideo();
  // js 开启手机摄像头
  navigator.mediaDevices.getUserMedia({video: { facingMode: 'environment' }}).then((stream: MediaStream) => {
    video.srcObject = stream;
    // required to tell iOS safari we don't want fullscreen
    video.setAttribute('playsinline', "true");
    video.play();
    // 关键帧动画,传入一个function
    requestAnimationFrame(tick);
    return globalBind;
  }).catch((err) => {
    handelMediaError(err);
    console.log(err);
  });
  return globalBind;
}

// 处理错误类型的回调 
const handelMediaError = (err: Error) => {
  globalOptions.callback({
    err: {
      type: err.name as ErrorType,
      message: err.message as string
    },
  });
}

const tick = () => {
  // 当有视频流进入时，
  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    // 这里处理主要逻辑
    // 设置canvas的宽度和高度
    canvasElement!.width = video.videoWidth;
    canvasElement!.height = video.videoHeight;

    // 绘制 canvas
    canvas!.drawImage(video, 0, 0, canvasElement!.width, canvasElement!.height);
    // 获取canvas图片
    const imageData = canvas!.getImageData(0, 0, canvasElement!.width, canvasElement!.height);
    // 读取二维码信息
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: "dontInvert",
    });
    // 如果code读取到了信息
    if (code) {
      // 设置边框颜色警示读取到了信息
      drawLine(code.location.topLeftCorner, code.location.topRightCorner, "#FF3B58");
      drawLine(code.location.topRightCorner, code.location.bottomRightCorner, "#FF3B58");
      drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, "#FF3B58");
      drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, "#FF3B58");
      // 读取到的信息内容,就回调出去
      globalOptions.callback({ data: code.data });
    } else {
      // 未读取到信息, 暂时不做任何处理
    }
  }
  // 动画识别
  requestAnimationFrame(tick);
}

// 绘制识别到到信息
const drawLine = (begin: Point, end: Point, color: string) => {
  canvas!.beginPath();
  canvas!.moveTo(begin.x, begin.y);
  canvas!.lineTo(end.x, end.y);
  canvas!.lineWidth = 4;
  canvas!.strokeStyle = color;
  canvas!.stroke();
}


export default initCamera;