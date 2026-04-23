import React from 'react'
import { Card } from 'antd'
import {
  WrapperCardStyle,
  WrapperName,
  WrapperPrice
} from './style'

const CardComponent = ({ name, price, image, onClick }) => {
  return (
    <WrapperCardStyle
      hoverable
      onClick={onClick}
      cover={
        <img
          alt="product"
          src={image}
          style={{
            height: '220px',
            objectFit: 'cover',
            borderRadius: '8px'
          }}
        />
      }
    >
      <WrapperName>{name}</WrapperName>
      <WrapperPrice>
        {price?.toLocaleString()} đ
      </WrapperPrice>
    </WrapperCardStyle>
  )
}

export default CardComponent