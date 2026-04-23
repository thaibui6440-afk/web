import React from 'react'
import {
  Lable,
  WrapperInfo,
  WrapperContainer,
  WrapperValue,
  WrapperItemOrder,
  WrapperItemOrderInfo
} from './style';
import Loading from '../../components/LoadingComponent/Loading';
import { useLocation } from 'react-router-dom';
import { orderContant } from '../../contant';
import { convertPrice } from '../../utils';

const OrderSucess = () => {
  const location = useLocation()
  const { state } = location

  return (
    <div style={{ background: '#f0f2f5', width: '100%', minHeight: '100vh', padding: '20px 0' }}>
      <Loading isLoading={false}>
        <div style={{ width: '1100px', margin: '0 auto' }}>
          
          {/* HEADER */}
          <div style={{
            background: '#fff',
            padding: '20px',
            borderRadius: '10px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            <h2 style={{ color: '#52c41a' }}>✅ Đặt hàng thành công</h2>
            <p>Cảm ơn bạn đã mua hàng!</p>
          </div>

          <WrapperContainer>
            
            {/* DELIVERY */}
            <WrapperInfo>
              <Lable>🚚 Phương thức giao hàng</Lable>
              <WrapperValue>
                <span style={{ color: '#fa8c16', fontWeight: '600' }}>
                  {orderContant.delivery[state?.delivery]}
                </span>{' '}
                Giao hàng tiết kiệm
              </WrapperValue>
            </WrapperInfo>

            {/* PAYMENT */}
            <WrapperInfo>
              <Lable>💰 Phương thức thanh toán</Lable>
              <WrapperValue>
                {orderContant.payment[state?.payment]}
              </WrapperValue>
            </WrapperInfo>

            {/* LIST PRODUCT */}
            <WrapperItemOrderInfo>
              <div style={{ width: '100%' }}>
                {state?.orders?.map((order) => {
                  return (
                    <WrapperItemOrder key={order?.name}>
                      
                      {/* LEFT */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 2 }}>
                        <img
                          src={order.image}
                          style={{
                            width: '80px',
                            height: '80px',
                            objectFit: 'cover',
                            borderRadius: '8px'
                          }}
                        />
                        <div style={{
                          fontWeight: '500',
                          maxWidth: '250px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {order?.name}
                        </div>
                      </div>

                      {/* RIGHT */}
                      <div style={{
                        flex: 1,
                        display: 'flex',
                        justifyContent: 'space-between'
                      }}>
                        <span>💵 {convertPrice(order?.price)}</span>
                        <span>SL: {order?.amount}</span>
                      </div>

                    </WrapperItemOrder>
                  )
                })}
              </div>
            </WrapperItemOrderInfo>

            {/* TOTAL */}
            <div style={{
              background: '#fff',
              padding: '20px',
              borderRadius: '10px',
              marginTop: '16px',
              textAlign: 'right'
            }}>
              <span style={{ fontSize: '18px', fontWeight: '600' }}>
                Tổng tiền:{' '}
              </span>
              <span style={{
                fontSize: '22px',
                color: '#ff4d4f',
                fontWeight: 'bold'
              }}>
                {convertPrice(state?.totalPriceMemo)}
              </span>
            </div>

          </WrapperContainer>
        </div>
      </Loading>
    </div>
  )
}

export default OrderSucess