import { Form, Radio } from 'antd'
import React, { useEffect, useState, useMemo } from 'react'
import {
  Lable,
  WrapperInfo,
  WrapperLeft,
  WrapperRadio,
  WrapperRight,
  WrapperTotal
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
    name: '',
    phone: '',
    address: '',
    city: ''
  })

  const [form] = Form.useForm()
  const dispatch = useDispatch()

  useEffect(() => {
    form.setFieldsValue(stateUserDetails)
  }, [form, stateUserDetails])

  useEffect(() => {
    if (isOpenModalUpdateInfo) {
      setStateUserDetails({
        city: user?.city,
        name: user?.name,
        address: user?.address,
        phone: user?.phone
      })
    }
  }, [isOpenModalUpdateInfo])

  const handleChangeAddress = () => {
    setIsOpenModalUpdateInfo(true)
  }

  const priceMemo = useMemo(() => {
    return order?.orderItemsSlected?.reduce((total, cur) => {
      return total + cur.price * cur.amount
    }, 0)
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
      order?.orderItemsSlected?.forEach((element) => {
        arrayOrdered.push(element.product)
      })
      dispatch(removeAllOrderProduct({ listChecked: arrayOrdered }))
      message.success('Đặt hàng thành công')
      navigate('/orderSuccess', {
        state: {
          delivery,
          payment,
          orders: order?.orderItemsSlected,
          totalPriceMemo
        }
      })
    } else if (isError) {
      message.error()
    }
  }, [isSuccess, isError])

  const handleAddOrder = () => {
    if (
      user?.access_token &&
      order?.orderItemsSlected &&
      user?.name &&
      user?.address &&
      user?.phone &&
      user?.city &&
      priceMemo &&
      user?.id
    ) {
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
      mutationUpdate.mutate(
        { id: user?.id, token: user?.access_token, ...stateUserDetails },
        {
          onSuccess: () => {
            dispatch(updateUser({ name, address, city, phone }))
            setIsOpenModalUpdateInfo(false)
          }
        }
      )
    }
  }

  const handleOnchangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value
    })
  }

  const handleDilivery = (e) => setDelivery(e.target.value)
  const handlePayment = (e) => setPayment(e.target.value)

  // ===== UI MỚI =====
  return (
    <div style={{ background: '#f0f2f5', minHeight: '100vh', padding: '20px 0' }}>
      <Loading isLoading={isLoadingAddOrder}>
        <div style={{ width: '1200px', margin: '0 auto' }}>
          <h2 style={{ marginBottom: '20px' }}>💳 Thanh toán</h2>

          <div style={{ display: 'flex', gap: '20px' }}>
            {/* LEFT */}
            <WrapperLeft>
              <WrapperInfo>
                <Lable>🚚 Phương thức giao hàng</Lable>
                <WrapperRadio onChange={handleDilivery} value={delivery}>
                  <Radio value="fast">Giao hàng nhanh</Radio>
                </WrapperRadio>
              </WrapperInfo>

              <WrapperInfo style={{ marginTop: '16px' }}>
                <Lable>💰 Phương thức thanh toán</Lable>
                <WrapperRadio onChange={handlePayment} value={payment}>
                  <Radio value="later_money">
                    Thanh toán khi nhận hàng
                  </Radio>
                </WrapperRadio>
              </WrapperInfo>
            </WrapperLeft>

            {/* RIGHT */}
            <WrapperRight>
              <WrapperInfo>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <span>📍 </span>
                    <span style={{ fontWeight: '600' }}>
                      {user?.address} - {user?.city}
                    </span>
                  </div>
                  <span
                    onClick={handleChangeAddress}
                    style={{ color: '#1677ff', cursor: 'pointer' }}
                  >
                    Sửa
                  </span>
                </div>
              </WrapperInfo>

              <WrapperInfo>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Tạm tính</span>
                  <span>{convertPrice(priceMemo)}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Giảm giá</span>
                  <span>{convertPrice(priceDiscountMemo)}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Phí ship</span>
                  <span>{convertPrice(diliveryPriceMemo)}</span>
                </div>
              </WrapperInfo>

              <WrapperTotal>
                <span>Tổng tiền</span>
                <span style={{ color: 'red', fontSize: '22px', fontWeight: 'bold' }}>
                  {convertPrice(totalPriceMemo)}
                </span>
              </WrapperTotal>

              <ButtonComponent
                onClick={handleAddOrder}
                size={40}
                styleButton={{
                  background: '#ff4d4f',
                  height: '50px',
                  width: '100%',
                  borderRadius: '10px'
                }}
                textbutton={'Đặt hàng'}
                styleTextButton={{ color: '#fff', fontWeight: '700' }}
              />
            </WrapperRight>
          </div>
        </div>

        {/* MODAL giữ nguyên */}
        <ModalComponent
          title="Cập nhật thông tin"
          open={isOpenModalUpdateInfo}
          onCancel={handleCancleUpdate}
          onOk={handleUpdateInforUser}
        >
          <Loading isLoading={isLoading}>
            <Form form={form}>
              <Form.Item label="Name" name="name">
                <InputComponent
                  value={stateUserDetails.name}
                  onChange={handleOnchangeDetails}
                  name="name"
                />
              </Form.Item>

              <Form.Item label="City" name="city">
                <InputComponent
                  value={stateUserDetails.city}
                  onChange={handleOnchangeDetails}
                  name="city"
                />
              </Form.Item>

              <Form.Item label="Phone" name="phone">
                <InputComponent
                  value={stateUserDetails.phone}
                  onChange={handleOnchangeDetails}
                  name="phone"
                />
              </Form.Item>

              <Form.Item label="Address" name="address">
                <InputComponent
                  value={stateUserDetails.address}
                  onChange={handleOnchangeDetails}
                  name="address"
                />
              </Form.Item>
            </Form>
          </Loading>
        </ModalComponent>
      </Loading>
    </div>
  )
}

export default PaymentPage