import { useState } from 'react';
import SwiperCore, { FreeMode, Navigation, Thumbs } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react.js';
import { EndPoints } from '../../../../api/endPoints';
import { ModalImage } from '../ModalImage';


import "./AreaImages.scss";

SwiperCore.use([FreeMode, Navigation, Thumbs]);

interface AreaImagesProps {
    areaPhotosIds: number[];
    // markerId: number;
}

function AreaImages(props: AreaImagesProps) {
    const [previewId, setPreviewId] = useState<number>(props.areaPhotosIds[0]);
    const [fullVisability, setFullVisability] = useState(false);

    const fullUrl = (id: number) => `http://${EndPoints.Gallery}/${id}/full`;
    const miniUrl = (id: number) => `http://${EndPoints.Gallery}/${id}/mini`;
    const prevUrl = (id: number) => `http://${EndPoints.Gallery}/${id}/prev`;

    const handleFullviewClose = () => { setFullVisability(false); }

    const thumbnails: JSX.Element[] = props.areaPhotosIds.map(imgId => {
        return (
            <SwiperSlide key={imgId} onClick={() => setPreviewId(imgId)}>
                <img className="slide" src={miniUrl(imgId)} alt="img mini" />
            </SwiperSlide>)
    })

    return (
        <div className="area-images">
            {previewId && <img src={prevUrl(previewId)} alt='area preview' onClick={() => setFullVisability(true)} />}
            {fullVisability && <ModalImage imgUrl={fullUrl(previewId)} onClose={handleFullviewClose} />}
            <Swiper
                className="swiper-carousel"
                slidesPerView={5}
                loop={true}
                centeredSlides={true}
                navigation={true}
                grabCursor={true}
                >
                {thumbnails}
            </Swiper>
        </div>
    )
}

export { AreaImages }
