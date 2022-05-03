import React, { FC } from 'react';
import QRImage from './assets/qrimage.png';
import QRCheckImage from './assets/qrcheckimage.png';
import './CarInspectionCert.css';
import { CarTypeEnum } from './CarInspectionCert';

export interface QRCodeConfig {
  id: number;
  data?: string;
  status?: 'done' | 'wait';
  empty?: boolean;
}

interface PropsType {
  type: CarTypeEnum,
  codeList: QRCodeConfig[];
}
export const QRImageDefault: FC<PropsType> = ({ type, codeList }) => {
  console.log('>>>>>>', type);
  return (
    <section className='qr-image-default'>
      <div className='qr-area'>
        <div className='qr-image'><img src={QRImage} /></div>
      </div>
      {
        type === '1' && <div className='qr-area'>
          <div className='qr-image'><img src={QRImage} /></div>
          <div className='qr-image'><img src={QRImage} /></div>
          <div className='qr-image'><img src={QRImage} /></div>
        </div>
      }
      <div className='qr-area qr-circle'>
        {
          codeList.map((item: QRCodeConfig) => (
            item.empty ? <div className='empty'/> : <div className='qr-image'><img src={item.status === 'done' ? QRCheckImage : QRImage} /></div>)
          )
        }
      </div>
      <div className='qr-area'>
        <div className='qr-image'><img src={QRImage} /></div>
        <div className='qr-image qr-image-last'><img src={QRImage} /></div>
      </div>
    </section>
  );
}