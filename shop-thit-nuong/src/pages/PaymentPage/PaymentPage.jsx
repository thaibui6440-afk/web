import { Form, Radio } from 'antd'
import React, { useEffect, useState, useMemo } from 'react'
import {
  Lable,
  WrapperInfo,
  WrapperLeft,
  WrapperRadio,
  WrapperRight,
  WrapperTotal,
  MomoBadge
} from './style'

import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import { useDispatch, useSelector } from 'react-redux'
import { convertPrice } from '../../utils'
import ModalComponent from '../../components/ModalComponent/ModalComponent'
import InputComponent from '../../components/InputComponent/InputComponent'
import { useMutationHooks } from '../../hooks/useMutationHook'
import * as UserService from '../../services/UserService'
import * as OrderService from '../../services/OrderService'
import Loading from '../../components/LoadingComponent/Loading'
import * as message from '../../components/Message/Message'
import { updateUser } from '../../redux/slides/userSlide'
import { useNavigate } from 'react-router-dom'
import { removeAllOrderProduct } from '../../redux/slides/orderSlide'
import * as PaymentService from '../../services/PaymentService'

const PaymentPage = () => {
  const order = useSelector((state) => state.order)
  const user = useSelector((state) => state.user)

  const [delivery, setDelivery] = useState('fast')
  const [payment, setPayment] = useState('later_money')
  const navigate = useNavigate()
  const [sdkReady, setSdkReady] = useState(false)

  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false)
  const [stateUserDetails, setStateUserDetails] = useState({
    name: '', phone: '', address: '', city: ''
  })

  const [form] = Form.useForm()
  const dispatch = useDispatch()

  useEffect(() => { form.setFieldsValue(stateUserDetails) }, [form, stateUserDetails])

  useEffect(() => {
    if (isOpenModalUpdateInfo) {
      setStateUserDetails({ city: user?.city, name: user?.name, address: user?.address, phone: user?.phone })
    }
  }, [isOpenModalUpdateInfo])

  const handleChangeAddress = () => setIsOpenModalUpdateInfo(true)

  const priceMemo = useMemo(() => {
    return order?.orderItemsSlected?.reduce((total, cur) => total + cur.price * cur.amount, 0)
  }, [order])

  const priceDiscountMemo = useMemo(() => {
    const result = order?.orderItemsSlected?.reduce((total, cur) => {
      const totalDiscount = cur.discount ? cur.discount : 0
      return total + (priceMemo * (totalDiscount * cur.amount) / 100)
    }, 0)
    return Number(result) || 0
  }, [order])

  const diliveryPriceMemo = useMemo(() => {
    if (priceMemo > 200000) return 10000
    if (priceMemo === 0) return 0
    return 20000
  }, [priceMemo])

  const totalPriceMemo = useMemo(() => {
    return Number(priceMemo) - Number(priceDiscountMemo) + Number(diliveryPriceMemo)
  }, [priceMemo, priceDiscountMemo, diliveryPriceMemo])

  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data
    return UserService.updateUser(id, { ...rests }, token)
  })

  const mutationAddOrder = useMutationHooks((data) => {
    const { token, ...rests } = data
    return OrderService.createOrder(rests, token)
  })

  const { isLoading } = mutationUpdate
  const { data: dataAdd, isLoading: isLoadingAddOrder, isSuccess, isError } = mutationAddOrder

  useEffect(() => {
    if (isSuccess && dataAdd?.status === 'OK') {
      const arrayOrdered = []
      order?.orderItemsSlected?.forEach((element) => { arrayOrdered.push(element.product) })
      dispatch(removeAllOrderProduct({ listChecked: arrayOrdered }))
      message.success('Đặt hàng thành công')
      navigate('/orderSuccess', { state: { delivery, payment, orders: order?.orderItemsSlected, totalPriceMemo } })
    } else if (isError) {
      message.error()
    }
  }, [isSuccess, isError])

  const handleAddOrder = () => {
    if (user?.access_token && order?.orderItemsSlected && user?.name && user?.address && user?.phone && user?.city && priceMemo && user?.id) {
      mutationAddOrder.mutate({
        token: user?.access_token,
        orderItems: order?.orderItemsSlected,
        fullName: user?.name,
        address: user?.address,
        phone: user?.phone,
        city: user?.city,
        paymentMethod: payment,
        itemsPrice: priceMemo,
        shippingPrice: diliveryPriceMemo,
        totalPrice: totalPriceMemo,
        user: user?.id,
        email: user?.email
      })
    }
  }

  const handleCancleUpdate = () => {
    form.resetFields()
    setIsOpenModalUpdateInfo(false)
  }

  const handleUpdateInforUser = () => {
    const { name, address, city, phone } = stateUserDetails
    if (name && address && city && phone) {
      mutationUpdate.mutate({ id: user?.id, token: user?.access_token, ...stateUserDetails }, {
        onSuccess: () => {
          dispatch(updateUser({ name, address, city, phone }))
          setIsOpenModalUpdateInfo(false)
        }
      })
    }
  }

  const handleOnchangeDetails = (e) => {
    setStateUserDetails({ ...stateUserDetails, [e.target.name]: e.target.value })
  }

  const handleDilivery = (e) => setDelivery(e.target.value)
  const handlePayment = (e) => setPayment(e.target.value)

  return (
    <div style={{ background: 'linear-gradient(160deg, #fff5f5 0%, #f5f5fa 100%)', minHeight: '100vh', padding: '28px 0 60px' }}>
      <Loading isLoading={isLoadingAddOrder}>
        <div style={{ width: '1200px', margin: '0 auto' }}>

          {/* TIÊU ĐỀ */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'linear-gradient(135deg, #ff3945, #ff6b35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(255,57,69,0.3)'
            }}>
              <span style={{ fontSize: 22 }}>💳</span>
            </div>
            <div>
              <h2 style={{ margin: 0, fontWeight: 800, fontSize: 22, color: '#1a1a1a' }}>Thanh toán</h2>
              <span style={{ fontSize: 13, color: '#999' }}>Kiểm tra và xác nhận đơn hàng</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>

            {/* LEFT */}
            <WrapperLeft>

              {/* PHƯƠNG THỨC GIAO HÀNG */}
              <WrapperInfo>
                <Lable>🚚 Phương thức giao hàng</Lable>
                <WrapperRadio onChange={handleDilivery} value={delivery}>
                  <Radio value="fast">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span>⚡</span>
                      <span>Giao hàng nhanh</span>
                      <span style={{
                        fontSize: 11, background: '#e6f4ff', color: '#1677ff',
                        padding: '1px 8px', borderRadius: 20, fontWeight: 600
                      }}>
                        Nhận trong 2-3 ngày
                      </span>
                    </div>
                  </Radio>
                </WrapperRadio>
              </WrapperInfo>

              {/* PHƯƠNG THỨC THANH TOÁN */}
              <WrapperInfo>
                <Lable>💰 Phương thức thanh toán</Lable>
                <WrapperRadio onChange={handlePayment} value={payment}>

                  {/* COD */}
                  <Radio value="later_money">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 18 }}>💵</span>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>Thanh toán khi nhận hàng</div>
                        <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>Trả tiền mặt khi shipper giao hàng</div>
                      </div>
                    </div>
                  </Radio>

                  {/* MOMO */}
                  <Radio value="momo">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 8,
                        background: 'linear-gradient(135deg, #ae2070, #d82d8b)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <span style={{ color: '#fff', fontWeight: 900, fontSize: 13 }}>M</span>
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontWeight: 600, fontSize: 14 }}>Ví MoMo</span>
                          <MomoBadge>Phổ biến</MomoBadge>
                        </div>
                        <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>Thanh toán nhanh qua ví điện tử MoMo</div>
                      </div>
                    </div>
                  </Radio>

                </WrapperRadio>

                {/* THÔNG BÁO KHI CHỌN MOMO */}
                {payment === 'momo' && (
                  <div style={{
                    marginTop: 14, padding: '12px 16px',
                    background: 'linear-gradient(135deg, #fdf0f7, #fce4f4)',
                    border: '1px solid #f0a8d0', borderRadius: 10,
                    fontSize: 13, color: '#a0336e', display: 'flex', alignItems: 'center', gap: 8
                  }}>
                    <span style={{ fontSize: 16 }}>ℹ️</span>
                    Bạn sẽ được chuyển đến ứng dụng <strong>MoMo</strong> để hoàn tất thanh toán sau khi đặt hàng.
                  </div>
                )}
              </WrapperInfo>
            </WrapperLeft>

            {/* RIGHT */}
            <WrapperRight>

              {/* ĐỊA CHỈ GIAO HÀNG */}
              <WrapperInfo>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: 11, color: '#aaa', display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      📍 Giao đến
                    </span>
                    <span style={{ fontWeight: 600, fontSize: 13, color: '#222' }}>
                      {user?.address ? `${user?.address} - ${user?.city}` : 'Chưa có địa chỉ'}
                    </span>
                  </div>
                  <span
                    onClick={handleChangeAddress}
                    style={{
                      color: '#ff3945', cursor: 'pointer', fontSize: 12, fontWeight: 700,
                      whiteSpace: 'nowrap', marginLeft: 10, padding: '4px 10px',
                      border: '1px solid #ffcdd2', borderRadius: 20, background: '#fff5f5'
                    }}
                  >
                    Sửa
                  </span>
                </div>
              </WrapperInfo>

              {/* CHI TIẾT GIÁ */}
              <WrapperInfo>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ color: '#666' }}>Tạm tính</span>
                  <span style={{ fontWeight: 600, color: '#222' }}>{convertPrice(priceMemo)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ color: '#666' }}>Giảm giá</span>
                  <span style={{ fontWeight: 600, color: '#27ae60' }}>- {convertPrice(priceDiscountMemo)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#666' }}>Phí ship</span>
                  <span style={{ fontWeight: 600, color: diliveryPriceMemo === 0 ? '#27ae60' : '#222' }}>
                    {diliveryPriceMemo === 0 ? '🎁 Miễn phí' : convertPrice(diliveryPriceMemo)}
                  </span>
                </div>
              </WrapperInfo>

              {/* TỔNG TIỀN */}
              <WrapperTotal>
                <span style={{ fontWeight: 700, fontSize: 15, color: '#333' }}>Tổng tiền</span>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <span style={{ color: '#ff3945', fontSize: 24, fontWeight: 800, letterSpacing: '-0.5px' }}>
                    {convertPrice(totalPriceMemo)}
                  </span>
                  <span style={{ color: '#bbb', fontSize: 11 }}>(Đã bao gồm VAT nếu có)</span>
                </div>
              </WrapperTotal>

              {/* NÚT ĐẶT HÀNG */}
              <div>
                <ButtonComponent
                  onClick={handleAddOrder}
                  size={40}
                  styleButton={{
                    background: payment === 'momo'
                      ? 'linear-gradient(135deg, #ae2070, #d82d8b)'
                      : 'linear-gradient(135deg, #ff3945, #ff6b35)',
                    height: '52px',
                    width: '100%',
                    border: 'none',
                    borderRadius: '14px',
                    boxShadow: payment === 'momo'
                      ? '0 6px 20px rgba(174,32,112,0.4)'
                      : '0 6px 20px rgba(255,57,69,0.4)',
                    transition: 'all 0.3s'
                  }}
                  textbutton={payment === 'momo' ? '💜  Thanh toán qua MoMo' : '🛒  Đặt hàng ngay'}
                  styleTextButton={{ color: '#fff', fontSize: '16px', fontWeight: '700' }}
                />
                <p style={{ textAlign: 'center', color: '#bbb', fontSize: 11, marginTop: 10, marginBottom: 0 }}>
                  🔒 Thanh toán an toàn & bảo mật
                </p>
              </div>

            </WrapperRight>
          </div>
        </div>

        {/* MODAL CẬP NHẬT THÔNG TIN */}
        <ModalComponent title="Cập nhật thông tin giao hàng" open={isOpenModalUpdateInfo} onCancel={handleCancleUpdate} onOk={handleUpdateInforUser}>
          <Loading isLoading={isLoading}>
            <Form form={form}>
              <Form.Item label="Name" name="name">
                <InputComponent value={stateUserDetails.name} onChange={handleOnchangeDetails} name="name" />
              </Form.Item>
              <Form.Item label="City" name="city">
                <InputComponent value={stateUserDetails.city} onChange={handleOnchangeDetails} name="city" />
              </Form.Item>
              <Form.Item label="Phone" name="phone">
                <InputComponent value={stateUserDetails.phone} onChange={handleOnchangeDetails} name="phone" />
              </Form.Item>
              <Form.Item label="Address" name="address">
                <InputComponent value={stateUserDetails.address} onChange={handleOnchangeDetails} name="address" />
              </Form.Item>
            </Form>
          </Loading>
        </ModalComponent>
      </Loading>
    </div>
  )
}

export default PaymentPage