import { Col, Image, Rate, Row } from 'antd'
import React from 'react'
import {
  WrapperStyleNameProduct,
  WrapperStyleTextSell,
  WrapperPriceProduct,
  WrapperPriceTextProduct,
  WrapperAddressProduct,
  WrapperQualityProduct,
  WrapperInputNumber
} from './style'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons'
import ButtonComponent from '../ButtonComponent/ButtonComponent'
import * as ProductService from '../../services/ProductService'
import { useQuery } from '@tanstack/react-query'
import Loading from '../LoadingComponent/Loading'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { addOrderProduct, resetOrder } from '../../redux/slides/orderSlide'
import { convertPrice, initFacebookSDK } from '../../utils'
import * as message from '../Message/Message'



const ProductDetailsComponent = ({ idProduct }) => {
  const [numProduct, setNumProduct] = useState(1)
  const user = useSelector((state) => state.user)
  const order = useSelector((state) => state.order)
  const [errorLimitOrder, setErrorLimitOrder] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  const onChange = (value) => setNumProduct(Number(value))

  const fetchGetDetailsProduct = async (context) => {
    const id = context?.queryKey && context?.queryKey[1]
    if (id) {
      const res = await ProductService.getDetailsProduct(id)
      return res.data
    }
  }

  useEffect(() => {
    initFacebookSDK()
  }, [])

  useEffect(() => {
    const orderRedux = order?.orderItems?.find(
      (item) => item.product === productDetails?._id
    )
    if (
      (orderRedux?.amount + numProduct) <= orderRedux?.countInstock ||
      (!orderRedux && productDetails?.countInStock > 0)
    ) {
      setErrorLimitOrder(false)
    } else {
      setErrorLimitOrder(true)
    }
  }, [numProduct])

  useEffect(() => {
    if (order.isSucessOrder) {
      message.success('Đã thêm vào giỏ hàng')
    }
    return () => {
      dispatch(resetOrder())
    }
  }, [order.isSucessOrder])

  const handleChangeCount = (type, limited) => {
    if (!limited) {
      setNumProduct(type === 'increase' ? numProduct + 1 : numProduct - 1)
    }
  }

  const { isLoading, data: productDetails } = useQuery(
    ['product-details', idProduct],
    fetchGetDetailsProduct,
    { enabled: !!idProduct }
  )

  const handleAddOrderProduct = () => {
    if (!user?.id) {
      navigate('/sign-in', { state: location?.pathname })
    } else {
      const orderRedux = order?.orderItems?.find(
        (item) => item.product === productDetails?._id
      )
      if (
        (orderRedux?.amount + numProduct) <= orderRedux?.countInstock ||
        (!orderRedux && productDetails?.countInStock > 0)
      ) {
        dispatch(
          addOrderProduct({
            orderItem: {
              name: productDetails?.name,
              amount: numProduct,
              image: productDetails?.image,
              price: productDetails?.price,
              product: productDetails?._id,
              discount: productDetails?.discount,
              countInstock: productDetails?.countInStock
            }
          })
        )
      } else {
        setErrorLimitOrder(true)
      }
    }
  }

  return (
    <Loading isLoading={isLoading}>
      <div style={{ background: '#f5f5fa', padding: '20px 0' }}>
        <Row
          style={{
            width: '1200px',
            margin: '0 auto',
            background: '#fff',
            borderRadius: '10px',
            padding: '20px'
          }}
        >
          {/* LEFT IMAGE */}
          <Col span={10} style={{ paddingRight: '20px' }}>
            <Image
              src={productDetails?.image}
              preview={false}
              style={{ borderRadius: '10px' }}
            />
          </Col>

          {/* RIGHT INFO */}
          <Col span={14}>
            <WrapperStyleNameProduct>
              {productDetails?.name}
            </WrapperStyleNameProduct>

            <div style={{ margin: '10px 0' }}>
              <Rate allowHalf value={productDetails?.rating} />
              <WrapperStyleTextSell>
                {' '}| Đã bán 1000+
              </WrapperStyleTextSell>
            </div>

            {/* PRICE */}
            <WrapperPriceProduct>
              <WrapperPriceTextProduct>
                {convertPrice(productDetails?.price)}
              </WrapperPriceTextProduct>
            </WrapperPriceProduct>

            {/* ADDRESS */}
            <WrapperAddressProduct>
              <span>Giao đến </span>
              <span className="address">{user?.address}</span> -
              <span className="change-address"> Đổi địa chỉ</span>
            </WrapperAddressProduct>

            
            

            {/* QUANTITY */}
            <div style={{ margin: '20px 0' }}>
              <div>Số lượng</div>
              <WrapperQualityProduct>
                <button onClick={() => handleChangeCount('decrease', numProduct === 1)}>
                  <MinusOutlined />
                </button>
                <WrapperInputNumber
                  value={numProduct}
                  onChange={onChange}
                  min={1}
                  max={productDetails?.countInStock}
                />
                <button onClick={() => handleChangeCount('increase', numProduct === productDetails?.countInStock)}>
                  <PlusOutlined />
                </button>
              </WrapperQualityProduct>
            </div>

            {/* BUTTON */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <ButtonComponent
                size={40}
                styleButton={{
                  background: '#ff4d4f',
                  height: '48px',
                  width: '200px',
                  borderRadius: '8px'
                }}
                onClick={handleAddOrderProduct}
                textbutton={'Chọn mua'}
                styleTextButton={{ color: '#fff', fontWeight: '700' }}
              />

              <ButtonComponent
                size={40}
                styleButton={{
                  background: '#fff',
                  height: '48px',
                  width: '200px',
                  border: '1px solid #1677ff',
                  borderRadius: '8px'
                }}
                textbutton={'Mua trả sau'}
                styleTextButton={{ color: '#1677ff' }}
              />
            </div>

            {errorLimitOrder && (
              <div style={{ color: 'red', marginTop: '10px' }}>
                Sản phẩm hết hàng
              </div>
            )}
          </Col>

          
        </Row>
      </div>
    </Loading>
  )
}

export default ProductDetailsComponent