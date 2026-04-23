import React from 'react'
import SliderComponent from '../../components/SliderComponent/SliderComponent'
import TypeProduct from '../../components/TypeProduct/TypeProduct'
import { WrapperButtonMore, WrapperProducts, WrapperTypeProduct } from './style'
import slider1 from '../../assets/images/slider-thit-nuong.png'
import slider2 from '../../assets/images/slider4.webp'
import slider3 from '../../assets/images/slider3.png'
import CardComponent from '../../components/CardComponent/CardComponent'
import { useQuery } from '@tanstack/react-query'
import * as ProductService from '../../services/ProductService'
import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import Loading from '../../components/LoadingComponent/Loading'
import { useDebounce } from '../../hooks/useDebounce'

const HomePage = () => {
  const searchProduct = useSelector((state) => state?.product?.search)
  const searchDebounce = useDebounce(searchProduct, 500)

  const [loading, setLoading] = useState(false)
  const [limit, setLimit] = useState(8)
  const [typeProducts, setTypeProducts] = useState([])

  const fetchProductAll = async (context) => {
    const limit = context?.queryKey && context?.queryKey[1]
    const search = context?.queryKey && context?.queryKey[2]
    const res = await ProductService.getAllProduct(search, limit)
    return res
  }

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct()
    if (res?.status === 'OK') {
      setTypeProducts(res?.data)
    }
  }

  const { isLoading, data: products, isPreviousData } = useQuery(
    ['products', limit, searchDebounce],
    fetchProductAll,
    { retry: 3, retryDelay: 1000, keepPreviousData: true }
  )

  useEffect(() => {
    fetchAllTypeProduct()
  }, [])

  return (
    <Loading isLoading={isLoading || loading}>
      
      {/* CATEGORY */}
      <div style={{ background: '#fff', borderBottom: '1px solid #eee' }}>
        <div style={{ width: '1200px', margin: '0 auto' }}>
          <WrapperTypeProduct>
            {typeProducts.map((item) => (
              <TypeProduct name={item} key={item} />
            ))}
          </WrapperTypeProduct>
        </div>
      </div>

      {/* BODY */}
      <div style={{ background: '#f5f5fa', padding: '20px 0' }}>
        <div style={{ width: '1200px', margin: '0 auto' }}>
          
          {/* SLIDER */}
          <div style={{ marginBottom: '20px' }}>
            <SliderComponent arrImages={[slider1, slider2, slider3]} />
          </div>

          {/* TITLE */}
          <h3 style={{ marginBottom: '16px' }}>🔥 Sản phẩm nổi bật</h3>

          {/* PRODUCT LIST */}
          <WrapperProducts>
            {products?.data?.map((product) => {
              return (
                <CardComponent
                  key={product._id}
                  countInStock={product.countInStock}
                  description={product.description}
                  image={product.image}
                  name={product.name}
                  price={product.price}
                  rating={product.rating}
                  type={product.type}
                  selled={product.selled}
                  discount={product.discount}
                  id={product._id}
                />
              )
            })}
          </WrapperProducts>

          {/* LOAD MORE */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
            <WrapperButtonMore
              textbutton={isPreviousData ? 'Đang tải...' : "Xem thêm"}
              type="outline"
              styleButton={{
                border: `1px solid ${
                  products?.total === products?.data?.length ? '#ccc' : '#ff4d4f'
                }`,
                color: `${
                  products?.total === products?.data?.length ? '#ccc' : '#ff4d4f'
                }`,
                width: '220px',
                height: '42px',
                borderRadius: '8px'
              }}
              disabled={
                products?.total === products?.data?.length ||
                products?.totalPage === 1
              }
              styleTextButton={{
                fontWeight: 600,
                color:
                  products?.total === products?.data?.length ? '#ccc' : '#ff4d4f'
              }}
              onClick={() => setLimit((prev) => prev + 8)}
            />
          </div>
        </div>
      </div>
    </Loading>
  )
}

export default HomePage