import {Checkbox, Form } from 'antd'
import React, { useEffect, useState } from 'react'
import { CustomCheckbox, WrapperCountOrder, WrapperInfo, WrapperItemOrder, WrapperLeft, WrapperListOrder, WrapperRight, WrapperStyleHeader, WrapperStyleHeaderDilivery, WrapperTotal } from './style';
import { DeleteOutlined, MinusOutlined, PlusOutlined, ShoppingCartOutlined, CarOutlined } from '@ant-design/icons'

import { WrapperInputNumber } from '../../components/ProductDetailsComponent/style';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useDispatch, useSelector } from 'react-redux';
import { decreaseAmount, increaseAmount, removeAllOrderProduct, removeOrderProduct, selectedOrder } from '../../redux/slides/orderSlide';
import { convertPrice } from '../../utils';
import { useMemo } from 'react';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import InputComponent from '../../components/InputComponent/InputComponent';
import { useMutationHooks } from '../../hooks/useMutationHook';
import * as  UserService from '../../services/UserService'
import Loading from '../../components/LoadingComponent/Loading';
import * as message from '../../components/Message/Message'
import { updateUser } from '../../redux/slides/userSlide';
import { useNavigate } from 'react-router-dom';
import StepComponent from '../../components/StepConponent/StepComponent';

const OrderPage = () => {
  const order = useSelector((state) => state.order)
  const user = useSelector((state) => state.user)

  const [listChecked, setListChecked] = useState([])
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false)
  const [stateUserDetails, setStateUserDetails] = useState({
    name: '',
    phone: '',
    address: '',
    city: ''
  })
  const navigate = useNavigate()
  const [form] = Form.useForm();
  const dispatch = useDispatch()

  const onChange = (e) => {
    if(listChecked.includes(e.target.value)){
      const newListChecked = listChecked.filter((item) => item !== e.target.value)
      setListChecked(newListChecked)
    }else {
      setListChecked([...listChecked, e.target.value])
    }
  };

  const handleChangeCount = (type, idProduct, limited) => {
    if(type === 'increase') {
      if(!limited) dispatch(increaseAmount({idProduct}))
    }else {
      if(!limited) dispatch(decreaseAmount({idProduct}))
    }
  }

  const handleDeleteOrder = (idProduct) => {
    dispatch(removeOrderProduct({idProduct}))
  }

  const handleOnchangeCheckAll = (e) => {
    if(e.target.checked) {
      const newListChecked = []
      order?.orderItems?.forEach((item) => {
        newListChecked.push(item?.product)
      })
      setListChecked(newListChecked)
    }else {
      setListChecked([])
    }
  }

  useEffect(() => { dispatch(selectedOrder({listChecked})) },[listChecked])
  useEffect(() => { form.setFieldsValue(stateUserDetails) }, [form, stateUserDetails])
  useEffect(() => {
    if(isOpenModalUpdateInfo) {
      setStateUserDetails({ city: user?.city, name: user?.name, address: user?.address, phone: user?.phone })
    }
  }, [isOpenModalUpdateInfo])

  const handleChangeAddress = () => setIsOpenModalUpdateInfo(true)

  const priceMemo = useMemo(() => {
    return order?.orderItemsSlected?.reduce((total, cur) => total + (cur.price * cur.amount), 0)
  },[order])

  const priceDiscountMemo = useMemo(() => {
    const result = order?.orderItemsSlected?.reduce((total, cur) => {
      const totalDiscount = cur.discount ? cur.discount : 0
      return total + (priceMemo * (totalDiscount * cur.amount) / 100)
    },0)
    return Number(result) ? result : 0
  },[order])

  const diliveryPriceMemo = useMemo(() => {
    if(priceMemo >= 20000 && priceMemo < 500000) return 10000
    else if(priceMemo >= 500000 || order?.orderItemsSlected?.length === 0) return 0
    else return 20000
  },[priceMemo])

  const totalPriceMemo = useMemo(() => {
    return Number(priceMemo) - Number(priceDiscountMemo) + Number(diliveryPriceMemo)
  },[priceMemo, priceDiscountMemo, diliveryPriceMemo])

  const handleRemoveAllOrder = () => {
    if(listChecked?.length > 1) dispatch(removeAllOrderProduct({listChecked}))
  }

  const handleAddCard = () => {
    if(!order?.orderItemsSlected?.length) {
      message.error('Vui lòng chọn sản phẩm')
    } else if(!user?.phone || !user.address || !user.name || !user.city) {
      setIsOpenModalUpdateInfo(true)
    } else {
      navigate('/payment')
    }
  }

  const mutationUpdate = useMutationHooks(
    (data) => {
      const { id, token, ...rests } = data
      return UserService.updateUser(id, { ...rests }, token)
    },
  )

  const {isLoading} = mutationUpdate

  const handleCancleUpdate = () => {
    setStateUserDetails({ name: '', email: '', phone: '', isAdmin: false })
    form.resetFields()
    setIsOpenModalUpdateInfo(false)
  }

  const handleUpdateInforUser = () => {
    const {name, address, city, phone} = stateUserDetails
    if(name && address && city && phone){
      mutationUpdate.mutate({ id: user?.id, token: user?.access_token, ...stateUserDetails }, {
        onSuccess: () => {
          dispatch(updateUser({name, address, city, phone}))
          setIsOpenModalUpdateInfo(false)
        }
      })
    }
  }

  const handleOnchangeDetails = (e) => {
    setStateUserDetails({ ...stateUserDetails, [e.target.name]: e.target.value })
  }

  return (
    <div style={{ background: 'linear-gradient(160deg, #fff5f5 0%, #f5f5fa 100%)', width: '100%', minHeight: '100vh', paddingBottom: 40 }}>
      <div style={{ maxWidth: '1270px', margin: '0 auto', padding: '0 16px' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '24px 0 16px' }}>
          <ShoppingCartOutlined style={{ fontSize: 24, color: '#ff3945' }} />
          <h3 style={{ fontWeight: 700, fontSize: 22, margin: 0, color: '#1a1a1a', letterSpacing: '-0.5px' }}>
            Giỏ hàng
            <span style={{ marginLeft: 8, fontSize: 14, fontWeight: 500, color: '#999' }}>
              ({order?.orderItems?.length} sản phẩm)
            </span>
          </h3>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-start', gap: 16, alignItems: 'flex-start' }}>
          <WrapperLeft>
            <WrapperStyleHeaderDilivery>
              <CarOutlined style={{ fontSize: 16, color: '#e74c3c', marginRight: 8 }} />
              <span>🎉 Miễn phí vận chuyển cho đơn hàng từ <strong>500.000 VND</strong></span>
            </WrapperStyleHeaderDilivery>

            <WrapperStyleHeader>
              <span style={{ display: 'inline-flex', alignItems: 'center', width: '390px', gap: 8 }}>
                <CustomCheckbox onChange={handleOnchangeCheckAll} checked={listChecked?.length === order?.orderItems?.length} />
                <span style={{ fontWeight: 600, color: '#333' }}>Chọn tất cả ({order?.orderItems?.length})</span>
              </span>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ color: '#888' }}>Đơn giá</span>
                <span style={{ color: '#888' }}>Số lượng</span>
                <span style={{ color: '#888' }}>Thành tiền</span>
                <DeleteOutlined style={{ cursor: 'pointer', color: '#ff3945', fontSize: 16 }} onClick={handleRemoveAllOrder} />
              </div>
            </WrapperStyleHeader>

            <WrapperListOrder>
              {order?.orderItems?.map((order) => (
                <WrapperItemOrder key={order?.product}>
                  <div style={{ width: '390px', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <CustomCheckbox onChange={onChange} value={order?.product} checked={listChecked.includes(order?.product)} />
                    <img src={order?.image} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 10 }} alt={order?.name} />
                    <div style={{ width: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500, fontSize: 14, color: '#222' }}>
                      {order?.name}
                    </div>
                  </div>

                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 14, color: '#ff3945', fontWeight: 600 }}>{convertPrice(order?.price)}</span>

                    <WrapperCountOrder>
                      <button onClick={() => handleChangeCount('decrease', order?.product, order?.amount === 1)}>
                        <MinusOutlined style={{ color: '#555', fontSize: 10 }} />
                      </button>
                      <WrapperInputNumber defaultValue={order?.amount} value={order?.amount} size="small" min={1} max={order?.countInstock} />
                      <button onClick={() => handleChangeCount('increase', order?.product, order?.amount === order.countInstock, order?.amount === 1)}>
                        <PlusOutlined style={{ color: '#555', fontSize: 10 }} />
                      </button>
                    </WrapperCountOrder>

                    <span style={{ color: '#ff3945', fontSize: 14, fontWeight: 700 }}>{convertPrice(order?.price * order?.amount)}</span>

                    <DeleteOutlined
                      style={{ cursor: 'pointer', color: '#ccc', fontSize: 16 }}
                      onMouseEnter={e => e.target.style.color = '#ff3945'}
                      onMouseLeave={e => e.target.style.color = '#ccc'}
                      onClick={() => handleDeleteOrder(order?.product)}
                    />
                  </div>
                </WrapperItemOrder>
              ))}
            </WrapperListOrder>
          </WrapperLeft>

          <WrapperRight>
            <WrapperInfo>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: 12, color: '#aaa', display: 'block', marginBottom: 2 }}>Giao đến</span>
                  <span style={{ fontWeight: 600, fontSize: 13, color: '#222' }}>
                    {user?.address ? `${user?.address}, ${user?.city}` : 'Chưa có địa chỉ'}
                  </span>
                </div>
                <span onClick={handleChangeAddress} style={{ color: '#ff3945', cursor: 'pointer', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', marginLeft: 8 }}>
                  Thay đổi
                </span>
              </div>
            </WrapperInfo>

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
                <span style={{ color: '#666' }}>Phí giao hàng</span>
                <span style={{ fontWeight: 600, color: diliveryPriceMemo === 0 ? '#27ae60' : '#222' }}>
                  {diliveryPriceMemo === 0 ? 'Miễn phí' : convertPrice(diliveryPriceMemo)}
                </span>
              </div>
            </WrapperInfo>

            <WrapperTotal>
              <span style={{ fontWeight: 600, fontSize: 15, color: '#333' }}>Tổng tiền</span>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{ color: '#ff3945', fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px' }}>{convertPrice(totalPriceMemo)}</span>
                <span style={{ color: '#aaa', fontSize: 11 }}>(Đã bao gồm VAT nếu có)</span>
              </div>
            </WrapperTotal>

            <div style={{ padding: '16px 20px', width: '100%', background: '#fff' }}>
              <ButtonComponent
                onClick={() => handleAddCard()}
                size={40}
                styleButton={{
                  background: 'linear-gradient(135deg, #ff3945, #ff6b35)',
                  height: '48px',
                  width: '100%',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 15px rgba(255,57,69,0.35)',
                }}
                textbutton={'🛒  Mua hàng ngay'}
                styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
              />
            </div>
          </WrapperRight>
        </div>
      </div>

      <ModalComponent title="Cập nhật thông tin giao hàng" open={isOpenModalUpdateInfo} onCancel={handleCancleUpdate} onOk={handleUpdateInforUser}>
        <Loading isLoading={isLoading}>
          <Form name="basic" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} autoComplete="on" form={form}>
            <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input your name!' }]}>
              <InputComponent value={stateUserDetails['name']} onChange={handleOnchangeDetails} name="name" />
            </Form.Item>
            <Form.Item label="City" name="city" rules={[{ required: true, message: 'Please input your city!' }]}>
              <InputComponent value={stateUserDetails['city']} onChange={handleOnchangeDetails} name="city" />
            </Form.Item>
            <Form.Item label="Phone" name="phone" rules={[{ required: true, message: 'Please input your phone!' }]}>
              <InputComponent value={stateUserDetails.phone} onChange={handleOnchangeDetails} name="phone" />
            </Form.Item>
            <Form.Item label="Adress" name="address" rules={[{ required: true, message: 'Please input your address!' }]}>
              <InputComponent value={stateUserDetails.address} onChange={handleOnchangeDetails} name="address" />
            </Form.Item>
          </Form>
        </Loading>
      </ModalComponent>
    </div>
  )
}

export default OrderPage