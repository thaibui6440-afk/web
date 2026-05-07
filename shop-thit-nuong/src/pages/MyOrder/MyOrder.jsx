import React, { useEffect } from 'react'
import Loading from '../../components/LoadingComponent/Loading';
import { useQuery } from '@tanstack/react-query';
import * as OrderService from '../../services/OrderService'
import { useSelector } from 'react-redux';
import { convertPrice } from '../../utils';
import { WrapperItemOrder, WrapperListOrder, WrapperHeaderItem, WrapperFooterItem, WrapperContainer, WrapperStatus } from './style';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutationHooks } from '../../hooks/useMutationHook';
import * as message from '../../components/Message/Message'

const MyOrderPage = () => {
  const location = useLocation()
  const { state } = location
  const navigate = useNavigate()

  const fetchMyOrder = async () => {
    const res = await OrderService.getOrderByUserId(state?.id, state?.token)
    return Array.isArray(res.data) ? res.data : []
  }

  const user = useSelector((state) => state.user)

  const queryOrder = useQuery({
    queryKey: ['orders'],
    queryFn: fetchMyOrder,
    enabled: !!(state?.id && state?.token)
  })
  const { isLoading, data } = queryOrder

  const handleDetailsOrder = (id) => {
    navigate(`/details-order/${id}`, {
      state: { token: state?.token }
    })
  }

  const mutation = useMutationHooks(
    (data) => {
      const { id, token, orderItems, userId } = data
      const res = OrderService.cancelOrder(id, token, orderItems, userId)
      return res
    }
  )

  const handleCanceOrder = (order) => {
    mutation.mutate({ id: order._id, token: state?.token, orderItems: order?.orderItems, userId: user.id }, {
      onSuccess: () => { queryOrder.refetch() },
    })
  }

  const { isLoading: isLoadingCancel, isSuccess: isSuccessCancel, isError: isErrorCancle, data: dataCancel } = mutation

  useEffect(() => {
    if (isSuccessCancel && dataCancel?.status === 'OK') {
      message.success()
    } else if (isSuccessCancel && dataCancel?.status === 'ERR') {
      message.error(dataCancel?.message)
    } else if (isErrorCancle) {
      message.error()
    }
  }, [isErrorCancle, isSuccessCancel])

  const statusBadge = (label, value, isTrue) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <span style={{ fontSize: '12px', color: '#888' }}>{label}</span>
      <span style={{
        fontSize: '12px',
        fontWeight: '600',
        padding: '3px 10px',
        borderRadius: '20px',
        background: isTrue ? '#e8f5e9' : '#fff3e8',
        color: isTrue ? '#2e7d32' : '#e65c00',
      }}>
        {value}
      </span>
    </div>
  )

  const renderProduct = (items) => {
    return Array.isArray(items) && items?.map((order) => (
      <WrapperHeaderItem key={order?._id}>
        <img
          src={order?.image}
          style={{
            width: '68px',
            height: '68px',
            objectFit: 'cover',
            borderRadius: '10px',
            border: '1px solid #eee',
            padding: '2px',
            flexShrink: 0,
            boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
          }}
        />
        <div style={{
          flex: 1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          marginLeft: '14px',
          fontSize: '14px',
          fontWeight: '500',
          color: '#1a1a2e',
        }}>
          {order?.name}
        </div>
        <span style={{
          fontSize: '14px',
          fontWeight: '700',
          color: '#1a1a2e',
          marginLeft: 'auto',
          flexShrink: 0,
        }}>
          {convertPrice(order?.price)}
        </span>
      </WrapperHeaderItem>
    ))
  }

  return (
    <Loading isLoading={isLoading || isLoadingCancel}>
      <WrapperContainer>
        <div style={{ width: '1270px', margin: '0 auto' }}>

          {/* Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '4px', height: '26px',
              background: 'linear-gradient(180deg, #e53935, #ff7043)',
              borderRadius: '4px'
            }} />
            <h4 style={{
              margin: 0,
              fontSize: '20px',
              fontWeight: '700',
              color: '#1a1a2e',
              letterSpacing: '0.3px'
            }}>
              Đơn hàng của tôi
            </h4>
            {Array.isArray(data) && data.length > 0 && (
              <span style={{
                fontSize: '12px',
                color: '#e53935',
                background: '#fff0f0',
                border: '1px solid #fdecea',
                borderRadius: '20px',
                padding: '2px 10px',
                fontWeight: '600',
              }}>
                {data.length} đơn
              </span>
            )}
          </div>

          <WrapperListOrder>
            {Array.isArray(data) && data.map((order) => (
              <WrapperItemOrder key={order?._id}>

                {/* Status Row */}
                <WrapperStatus>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#1a1a2e', marginRight: '8px' }}>
                    Trạng thái
                  </span>
                  {statusBadge('Giao hàng:', order.isDelivered ? 'Đã giao hàng' : 'Chưa giao hàng', order.isDelivered)}
                  {statusBadge('Thanh toán:', order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán', order.isPaid)}
                </WrapperStatus>

                {/* Products */}
                {renderProduct(order?.orderItems)}

                {/* Footer */}
                <WrapperFooterItem>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '13px', color: '#888' }}>Tổng tiền:</span>
                    <span style={{ fontSize: '18px', fontWeight: '800', color: '#e53935' }}>
                      {convertPrice(order?.totalPrice)}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <ButtonComponent
                      onClick={() => handleCanceOrder(order)}
                      size={40}
                      styleButton={{
                        height: '36px',
                        border: '1px solid #e53935',
                        borderRadius: '8px',
                        padding: '0 16px',
                        background: '#fff',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      textbutton={'Hủy đơn hàng'}
                      styleTextButton={{ color: '#e53935', fontSize: '13px', fontWeight: '600' }}
                    />
                    <ButtonComponent
                      onClick={() => handleDetailsOrder(order?._id)}
                      size={40}
                      styleButton={{
                        height: '36px',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0 16px',
                        background: 'linear-gradient(135deg, #e53935, #ff7043)',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(229,57,53,0.25)',
                        transition: 'all 0.2s',
                      }}
                      textbutton={'Xem chi tiết'}
                      styleTextButton={{ color: '#fff', fontSize: '13px', fontWeight: '600' }}
                    />
                  </div>
                </WrapperFooterItem>

              </WrapperItemOrder>
            ))}
          </WrapperListOrder>

        </div>
      </WrapperContainer>
    </Loading>
  )
}

export default MyOrderPage