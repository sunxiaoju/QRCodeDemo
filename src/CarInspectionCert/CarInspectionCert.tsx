import React, { FC, useCallback, useState } from 'react';
import { QRImageDefault, QRCodeConfig } from './QRImageDefault';
import initCamera from '../../QRCode/index';
import { QRCodeResult } from '../../QRCode/index.d';

export enum CarTypeEnum {
  CAR0 = '0',
  CAR1 = '1'
}

export interface PropsType {
  handleClose?: () => {},
  type: CarTypeEnum;
}

const defaultList: QRCodeConfig[] = [
  { id: 1, status: 'wait' },
  { id: 2, status: 'wait' },
  { id: 3, status: 'wait' },
  { id: 10, empty: true },
  { id: 4, status: 'wait' },
  { id: 5, status: 'wait' },
];

const defaultLightList: QRCodeConfig[] = [
  { id: 11, status: 'wait' },
  { id: 12, status: 'wait' },
];


export const CarInspectionCert: FC<PropsType>  = ({
  handleClose,
  type = '0'
}) => {
  const [codeList, setCodeList] = useState<QRCodeConfig[]>(type === '0' ? defaultList : defaultLightList);

  const handleCameraMethod = useCallback(() => {
    console.log('拍摄方法');
    const qrCode = initCamera('canvas', ({ err, data }: QRCodeResult) => {
      if (!err) {
        qrCode!.video.pause();
        console.log('========', data);
        handleQRCodeResult(data as string);
        // 这里模拟数据处理逻辑，可以根据此控制相机的暂停与继续
        setTimeout(() => {
          qrCode!.video.play();
        }, 5000);
      }
    })
  }, []);

  const handleQRCodeResult = (data: string) => {
    let list = codeList;
    if (data.startsWith('111')) {
      list[0] = {...list[0], data, status: 'done'};
    } else if (data.startsWith('222')) {
      list[1] = {...list[1], data, status: 'done'};
    } else if (data.startsWith('333')) {
      list[2] = {...list[2], data, status: 'done'};
    } else if (data.startsWith('444')) {
      list[4] = {...list[4], data, status: 'done'};
    } else if (data.startsWith('555')) {
      list[5] = {...list[5], data, status: 'done'};
    }
    setCodeList([...list]);
  }

  return (
    <div className="car-inspection-cert">
      <section className="section-header">
        <div onClick={handleClose}>閉じる</div>
        <div onClick={handleCameraMethod}>撮影方法</div>
      </section>
      <section className="section-content">
        <span>車検証のQRコードを左から2~6番目まで<br />順番に読み取ってください</span>
        <QRImageDefault type={type} codeList={codeList}/>
      </section>
      <section className="section-canvas">
        <div className="div-canvas">
          <canvas id='canvas' />
        </div>
      </section>
      <section>
        <p>这里是备注内容</p>
      </section>
    </div>
  )
}