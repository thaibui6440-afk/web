import { Image } from 'antd';
import React from 'react'
import { WrapperSliderStyle } from './style';

const SliderComponent = ({ arrImages }) => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 600,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2500
    };

    return (
        <WrapperSliderStyle {...settings}>
            {arrImages.map((image) => {
                return (
                    <div key={image} style={{ padding: '0 8px' }}>
                        <Image
                            src={image}
                            alt="slider"
                            preview={false}
                            width="100%"
                            height="300px"
                            style={{
                                objectFit: 'cover',
                                borderRadius: '12px'
                            }}
                        />
                    </div>
                )
            })}
        </WrapperSliderStyle>
    )
}

export default SliderComponent