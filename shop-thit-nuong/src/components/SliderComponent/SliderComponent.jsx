import { Image } from 'antd';
import React from 'react'
import { WrapperSliderStyle } from './style';

const SliderComponent = ({ arrImages }) => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 700,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3500,
        pauseOnHover: true,
        arrows: true,
    };

    return (
        <WrapperSliderStyle {...settings}>
            {arrImages.map((image) => (
                <div key={image}>
                    <img
                        src={image}
                        alt="slider"
                        style={{
                            width: '100%',
                            height: 'auto',
                            aspectRatio: '16/5',
                            objectFit: 'cover',
                            borderRadius: '16px',
                            display: 'block',
                        }}
                    />
                </div>
            ))}
        </WrapperSliderStyle>
    )
}

export default SliderComponent