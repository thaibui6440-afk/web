import Slider from "react-slick";
import styled from "styled-components";

export const WrapperSliderStyle = styled(Slider)`
  border-radius: 12px;
  overflow: hidden;

  /* ARROW */
  & .slick-arrow.slick-prev {
    left: 15px;
    z-index: 10;
  }

  & .slick-arrow.slick-next {
    right: 15px;
    z-index: 10;
  }

  & .slick-arrow::before {
    font-size: 32px;
    color: #fff;
    opacity: 0.8;
  }

  & .slick-arrow:hover::before {
    opacity: 1;
  }

  /* DOTS */
  & .slick-dots {
    bottom: 10px;
  }

  & .slick-dots li button::before {
    font-size: 10px;
    color: #fff;
    opacity: 0.5;
  }

  & .slick-dots li.slick-active button::before {
    opacity: 1;
    transform: scale(1.2);
  }

  /* SLIDE */
  & .slick-slide > div {
    display: flex;
    justify-content: center;
  }
`