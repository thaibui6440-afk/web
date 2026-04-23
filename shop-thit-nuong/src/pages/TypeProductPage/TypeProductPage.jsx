import React, { Fragment } from 'react'
import CardComponent from '../../components/CardComponent/CardComponent'
import { Col, Pagination, Row } from 'antd'
import { WrapperProducts, WrapperContainer } from './style'
import { useLocation } from 'react-router-dom'
import * as ProductService from '../../services/ProductService'
import { useEffect, useState } from 'react'
import Loading from '../../components/LoadingComponent/Loading'
import { useSelector } from 'react-redux'
import { useDebounce } from '../../hooks/useDebounce'

const TypeProductPage = () => {
    const searchProduct = useSelector((state) => state?.product?.search)
    const searchDebounce = useDebounce(searchProduct, 500)

    const { state } = useLocation()
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)

    const [panigate, setPanigate] = useState({
        page: 0,
        limit: 9, // 👈 3x3 giống layout hình bạn
        total: 1,
    })

    const fetchProductType = async (type, page, limit) => {
        setLoading(true)
        const res = await ProductService.getProductType(type, page, limit)
        if (res?.status === 'OK') {
            setProducts(res?.data)
            setPanigate({ ...panigate, total: res?.totalPage })
        }
        setLoading(false)
    }

    useEffect(() => {
        if (state) {
            fetchProductType(state, panigate.page, panigate.limit)
        }
    }, [state, panigate.page, panigate.limit])

    const onChange = (current, pageSize) => {
        setPanigate({ ...panigate, page: current - 1, limit: pageSize })
    }

    return (
        <Loading isLoading={loading}>
            <WrapperContainer>
                <div className="container">
                    <Row justify="center">
                        <Col span={24}>
                            <WrapperProducts>
                                {products
                                    ?.filter((pro) => {
                                        if (searchDebounce === '') return pro
                                        if (pro?.name?.toLowerCase()?.includes(searchDebounce?.toLowerCase())) return pro
                                    })
                                    ?.map((product) => {
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

                            <Pagination
                                current={panigate.page + 1}
                                total={panigate?.total * 10}
                                onChange={onChange}
                                style={{
                                    textAlign: 'center',
                                    marginTop: '30px'
                                }}
                            />
                        </Col>
                    </Row>
                </div>
            </WrapperContainer>
        </Loading>
    )
}

export default TypeProductPage