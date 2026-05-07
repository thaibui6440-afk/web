import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  WrapperCardStyle,
  WrapperName,
  WrapperPrice
} from './style'

const CardComponent = ({ name, price, image, id, rating, discount, selled, countInStock }) => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/product-details/${id}`)
  }

  return (
    <WrapperCardStyle
      hoverable
      onClick={handleClick}
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

      {discount > 0 && (
        <span style={{ color: '#999', textDecoration: 'line-through', fontSize: 13 }}>
          {price?.toLocaleString()} đ
        </span>
      )}

      <WrapperPrice>
        {discount > 0
          ? (price * (1 - discount / 100))?.toLocaleString()
          : price?.toLocaleString()} đ
      </WrapperPrice>

      <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>
        ⭐ {rating} &nbsp;|&nbsp; Đã bán: {selled}
      </div>

      {countInStock === 0 && (
        <div style={{ color: 'red', fontSize: 13, marginTop: 4 }}>Hết hàng</div>
      )}
    </WrapperCardStyle>
  )
}

export default CardComponent