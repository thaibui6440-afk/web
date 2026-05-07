import React, { useMemo } from 'react'
import {
  WrapperAllPrice, WrapperContentInfo, WrapperHeaderUser,
  WrapperInfoUser, WrapperItem, WrapperItemLabel, WrapperLabel,
  WrapperNameProduct, WrapperProduct, WrapperStyleContent
} from './style'
import { useLocation, useParams } from 'react-router-dom'
import * as OrderService from '../../services/OrderService'
import { useQuery } from '@tanstack/react-query'
import { orderContant } from '../../contant'
import { convertPrice } from '../../utils'
import Loading from '../../components/LoadingComponent/Loading'

const DetailsOrderPage = () => {
  const params = useParams()
  const location = useLocation()
  const { state } = location
  const { id } = params

  const fetchDetailsOrder = async () => {
    const res = await OrderService.getDetailsOrder(id, state?.token)
    return res.data
  }

  const queryOrder = useQuery({ queryKey: ['orders-details'], queryFn: fetchDetailsOrder }, {
    enabled: id
  })
  const { isLoading, data } = queryOrder

  const priceMemo = useMemo(() => {
    const result = data?.orderItems?.reduce((total, cur) => {
      return total + (cur.price * cur.amount)
    }, 0)
    return result
  }, [data])

  return (
    <Loading isLoading={isLoading}>
      <div style={{ width: '100%', minHeight: '100vh', background: '#f7f8fc', padding: '32px 0' }}>
        <div style={{ width: '1270px', margin: '0 auto' }}>

          {/* Page Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
            <div style={{
              width: '4px', height: '28px',
              background: 'linear-gradient(180deg, #e53935, #ff7043)',
              borderRadius: '4px'
            }} />
            <h4 style={{
              margin: 0, fontSize: '20px', fontWeight: '700',
              color: '#1a1a2e', letterSpacing: '0.3px'
            }}>
              Chi tiết đơn hàng
            </h4>
            <div style={{
              marginLeft: 'auto', fontSize: '12px', color: '#aaa',
              background: '#fff', border: '1px solid #eee',
              borderRadius: '20px', padding: '4px 14px',
            }}>
              #{id?.slice(-8)?.toUpperCase()}
            </div>
          </div>

          {/* Info Cards */}
          <WrapperHeaderUser>
            <WrapperInfoUser>
              <WrapperLabel>Địa chỉ người nhận</WrapperLabel>
              <WrapperContentInfo>
                <div className='name-info'>{data?.shippingAddress?.fullName}</div>
                <div className='address-info'><span>Địa chỉ: </span>{`${data?.shippingAddress?.address} ${data?.shippingAddress?.city}`}</div>
                <div className='phone-info'><span>Điện thoại: </span>{data?.shippingAddress?.phone}</div>
              </WrapperContentInfo>
            </WrapperInfoUser>

            <WrapperInfoUser>
              <WrapperLabel>Hình thức giao hàng</WrapperLabel>
              <WrapperContentInfo>
                <div className='delivery-info'><span className='name-delivery'>FAST</span>Giao hàng tiết kiệm</div>
                <div className='delivery-fee'><span>Phí giao hàng: </span>{data?.shippingPrice}</div>
              </WrapperContentInfo>
            </WrapperInfoUser>

            <WrapperInfoUser>
              <WrapperLabel>Hình thức thanh toán</WrapperLabel>
              <WrapperContentInfo>
                <div className='payment-info'>{orderContant.payment[data?.paymentMethod]}</div>
                <div className='status-payment'>{data?.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}</div>
              </WrapperContentInfo>
            </WrapperInfoUser>
          </WrapperHeaderUser>

          {/* Product Table */}
          <WrapperStyleContent>
            {/* Table Header */}
            <div style={{
              display: 'flex', alignItems: 'center',
              padding: '14px 24px',
              background: 'linear-gradient(135deg, #fff5f5 0%, #fff 100%)',
              borderBottom: '2px solid #fdecea',
            }}>
              <div style={{ width: '670px', fontSize: '12px', fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                Sản phẩm
              </div>
              <WrapperItemLabel>Giá</WrapperItemLabel>
              <WrapperItemLabel>Số lượng</WrapperItemLabel>
              <WrapperItemLabel>Giảm giá</WrapperItemLabel>
            </div>

            {/* Products */}
            {data?.orderItems?.map((order, index) => (
              <WrapperProduct key={index}>
                <WrapperNameProduct>
                  <img
                    src={order?.image}
                    style={{
                      width: '72px', height: '72px',
                      objectFit: 'cover', borderRadius: '10px',
                      border: '1px solid #eee', padding: '2px', flexShrink: 0,
                    }}
                  />
                  <div style={{
                    width: 260, overflow: 'hidden',
                    textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    fontSize: '14px', fontWeight: '500', color: '#1a1a2e',
                    lineHeight: '72px',
                  }}>
                    Điện thoại
                  </div>
                </WrapperNameProduct>
                <WrapperItem>{convertPrice(order?.price)}</WrapperItem>
                <WrapperItem>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    minWidth: '28px', height: '28px', borderRadius: '8px',
                    background: '#f5f5f5', fontWeight: '700', fontSize: '14px', color: '#1a1a2e',
                  }}>
                    {order?.amount}
                  </span>
                </WrapperItem>
                <WrapperItem>
                  {order?.discount ? convertPrice(priceMemo * order?.discount / 100) : '0 VND'}
                </WrapperItem>
              </WrapperProduct>
            ))}

            {/* Divider */}
            <div style={{ height: '1px', background: '#f0f0f0', margin: '8px 24px' }} />

            {/* Price Summary */}
            <div style={{ padding: '0 24px 8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '320px', padding: '8px 0', marginLeft: 'auto' }}>
                <span style={{ color: '#888', fontSize: '13px' }}>Tạm tính</span>
                <span style={{ fontWeight: '600', color: '#1a1a2e', fontSize: '14px' }}>{convertPrice(priceMemo)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '320px', padding: '8px 0', marginLeft: 'auto' }}>
                <span style={{ color: '#888', fontSize: '13px' }}>Phí vận chuyển</span>
                <span style={{ fontWeight: '600', color: '#1a1a2e', fontSize: '14px' }}>{convertPrice(data?.shippingPrice)}</span>
              </div>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                width: '320px', padding: '14px 18px',
                marginTop: '8px', marginBottom: '8px', marginLeft: 'auto',
                background: 'linear-gradient(135deg, #fff5f5, #fff8f8)',
                borderRadius: '12px', border: '1px solid #fdecea',
              }}>
                <span style={{ fontWeight: '700', color: '#1a1a2e', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Tổng cộng
                </span>
                <span style={{ fontWeight: '800', color: '#e53935', fontSize: '22px' }}>
                  {convertPrice(data?.totalPrice)}
                </span>
              </div>
            </div>
          </WrapperStyleContent>

        </div>
      </div>
    </Loading>
  )
}

export default DetailsOrderPage