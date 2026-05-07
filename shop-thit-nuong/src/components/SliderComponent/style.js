import styled from 'styled-components'
import Slider from 'react-slick'

export const WrapperSliderStyle = styled(Slider)`
  position: relative;
  border-radius: 16px;
  overflow: hidden;

  .slick-dots {
    bottom: 14px;

    li button:before {
      font-size: 10px;
      color: rgba(255,255,255,0.6);
      opacity: 1;
    }

    li.slick-active button:before {
      color: #fff;
      opacity: 1;
    }
  }

  .slick-prev, .slick-next {
    z-index: 10;
    width: 40px;
    height: 40px;
    background: rgba(255,255,255,0.85);
    border-radius: 50%;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    transition: background 0.2s;

    &:hover {
      background: #fff;
    }

    &:before {
      color: #e53935;
      font-size: 18px;
    }
  }

  .slick-prev {
    left: 14px;
  }

  .slick-next {
    right: 14px;
  }
`