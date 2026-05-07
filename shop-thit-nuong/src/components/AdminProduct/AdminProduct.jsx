import {
  Button, Form, Select, Space, Card, Row, Col, Typography
} from 'antd'
import {
  PlusOutlined, DeleteOutlined, EditOutlined
} from '@ant-design/icons'
import React, { useRef, useState, useEffect } from 'react'
import {
  WrapperHeader, WrapperUploadFile, WrapperContainer, WrapperTable
} from './style'
import TableComponent from '../TableComponent/TableComponent'
import InputComponent from '../InputComponent/InputComponent'
import { getBase64, renderOptions } from '../../utils'
import * as ProductService from '../../services/ProductService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import Loading from '../../components/LoadingComponent/Loading'
import * as message from '../../components/Message/Message'
import { useQuery } from '@tanstack/react-query'
import DrawerComponent from '../DrawerComponent/DrawerComponent'
import { useSelector } from 'react-redux'
import ModalComponent from '../ModalComponent/ModalComponent'

const { Title } = Typography

const AdminProduct = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [rowSelected, setRowSelected] = useState('')
  const [isOpenDrawer, setIsOpenDrawer] = useState(false)
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
  const user = useSelector((state) => state?.user)

  const inittial = () => ({
    name: '', price: '', description: '', rating: '',
    image: '', type: '', countInStock: '', newType: '', discount: '',
  })

  const [stateProduct, setStateProduct] = useState(inittial())
  const [stateProductDetails, setStateProductDetails] = useState(inittial())
  const [form] = Form.useForm()

  // ====== MUTATIONS ======
  const mutation = useMutationHooks((data) => {
    const { access_token, ...productData } = data
    return ProductService.createProduct(productData, access_token)
  })

  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data
    return ProductService.updateProduct(id, token, rests)
  })

  const mutationDeleted = useMutationHooks((data) => {
    return ProductService.deleteProduct(data.id, data.token)
  })

  const mutationDeletedMany = useMutationHooks((data) => {
    return ProductService.deleteManyProduct(data.ids, data.token)
  })

  // ====== QUERIES ======
  const getAllProducts = async () => ProductService.getAllProduct()
  const fetchAllTypeProduct = async () => ProductService.getAllTypeProduct()

  const queryProduct = useQuery({ queryKey: ['products'], queryFn: getAllProducts })
  const typeProduct = useQuery({ queryKey: ['type-product'], queryFn: fetchAllTypeProduct })
  const { data: products, isLoading: isLoadingProducts } = queryProduct

  // ====== EFFECTS ======
  const { isSuccess, isError, data: dataCreate } = mutation
  useEffect(() => {
    if (isSuccess && dataCreate?.status === 'OK') {
      message.success()
      setIsModalOpen(false)
      setStateProduct(inittial())
    } else if (isError) {
      message.error()
    }
  }, [isSuccess, isError])

  const { isSuccess: isSuccessUpdate, isError: isErrorUpdate, data: dataUpdate } = mutationUpdate
  useEffect(() => {
    if (isSuccessUpdate && dataUpdate?.status === 'OK') {
      message.success()
      setIsOpenDrawer(false)
    } else if (isErrorUpdate) {
      message.error()
    }
  }, [isSuccessUpdate, isErrorUpdate])

  const { isSuccess: isSuccessDelete, isError: isErrorDelete, data: dataDelete } = mutationDeleted
  useEffect(() => {
    if (isSuccessDelete && dataDelete?.status === 'OK') {
      message.success()
      setIsModalOpenDelete(false)
    } else if (isErrorDelete) {
      message.error()
    }
  }, [isSuccessDelete, isErrorDelete])

  // ====== FETCH CHI TIẾT KHI CHỌN ROW ======
  const fetchDetailsProduct = async (rowSelected) => {
    const res = await ProductService.getDetailsProduct(rowSelected)
    if (res?.data) {
      setStateProductDetails({
        name: res.data.name,
        price: res.data.price,
        description: res.data.description,
        rating: res.data.rating,
        image: res.data.image,
        type: res.data.type,
        countInStock: res.data.countInStock,
        discount: res.data.discount,
      })
    }
    setIsLoadingUpdate(false)
  }

  useEffect(() => {
    if (rowSelected) {
      setIsLoadingUpdate(true)
      fetchDetailsProduct(rowSelected)
    }
  }, [rowSelected])

  useEffect(() => {
    if (stateProductDetails) {
      form.setFieldsValue(stateProductDetails)
    }
  }, [stateProductDetails, form])

  // ====== HANDLERS ======
  const handleDeleteProduct = () => {
    mutationDeleted.mutate({ id: rowSelected, token: user?.access_token }, {
      onSettled: () => queryProduct.refetch()
    })
  }

  const handleCancelDelete = () => setIsModalOpenDelete(false)

  const handleDelteManyProducts = (ids) => {
    mutationDeletedMany.mutate({ ids, token: user?.access_token }, {
      onSettled: () => queryProduct.refetch()
    })
  }

  const handleOnchangeDetails = (e) => {
    setStateProductDetails({
      ...stateProductDetails,
      [e.target.name]: e.target.value
    })
  }

  const handleOnchangeAvatarDetails = async ({ fileList }) => {
    const file = fileList[0]
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }
    setStateProductDetails({ ...stateProductDetails, image: file.preview })
  }

  const onUpdateProduct = () => {
    mutationUpdate.mutate({
      id: rowSelected,
      token: user?.access_token,
      ...stateProductDetails
    }, {
      onSettled: () => queryProduct.refetch()
    })
  }

  const handleOnchange = (e) => {
    setStateProduct({ ...stateProduct, [e.target.name]: e.target.value })
  }

  const handleOnchangeAvatar = async ({ fileList }) => {
    const file = fileList[0]
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }
    setStateProduct({ ...stateProduct, image: file.preview })
  }

  const onFinish = () => {
    mutation.mutate({
      ...stateProduct,
      type: stateProduct.type === 'add_type' ? stateProduct.newType : stateProduct.type,
      access_token: user?.access_token
    }, {
      onSettled: () => queryProduct.refetch()
    })
  }

  // ====== TABLE ======
  const renderAction = () => (
    <Space size="middle">
      <DeleteOutlined
        style={{ color: '#ff4d4f', fontSize: 20, cursor: 'pointer' }}
        onClick={() => setIsModalOpenDelete(true)}
      />
      <EditOutlined
        style={{ color: '#faad14', fontSize: 20, cursor: 'pointer' }}
        onClick={() => setIsOpenDrawer(true)}
      />
    </Space>
  )

  const columns = [
    { title: 'Tên', dataIndex: 'name' },
    { title: 'Giá', dataIndex: 'price' },
    { title: 'Đánh giá', dataIndex: 'rating' },
    { title: 'Loại', dataIndex: 'type' },
    { title: 'Thao tác', dataIndex: 'action', render: renderAction }
  ]

  const dataTable = products?.data?.map((product) => ({
    ...product, key: product._id
  })) || []

  return (
  <WrapperContainer>
    {/* HEADER */}
    <WrapperHeader>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <div style={{
          width: '4px', height: '28px',
          background: 'linear-gradient(180deg, #e53935, #ff7043)',
          borderRadius: '4px'
        }} />
        <Title level={3} style={{ margin: 0 }}>Quản lý sản phẩm</Title>
      </div>
    </WrapperHeader>

    {/* BUTTON ADD */}
    <Card style={{ marginBottom: 20, borderRadius: 16, border: '1px solid #f0f0f0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', textAlign: 'center' }}>
      <Button
        type="dashed" icon={<PlusOutlined />} size="large"
        style={{ height: 80, width: 220, fontSize: 16, borderRadius: 12, borderColor: '#e53935', color: '#e53935' }}
        onClick={() => setIsModalOpen(true)}
      >
        Thêm sản phẩm
      </Button>
    </Card>

    {/* TABLE */}
    <WrapperTable>
      <TableComponent
        handleDelteMany={handleDelteManyProducts}
        columns={columns}
        isLoading={isLoadingProducts}
        data={dataTable}
        onRow={(record) => ({
          onClick: () => setRowSelected(record._id)
        })}
      />
    </WrapperTable>

    {/* MODAL TẠO SẢN PHẨM */}
    <ModalComponent
      title={<span style={{ fontSize: 16, fontWeight: 700, color: '#1a1a2e' }}>➕ Tạo sản phẩm mới</span>}
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      footer={null}
      width={600}
    >
      <Loading isLoading={mutation.isLoading}>
        <Form layout="vertical" onFinish={onFinish} style={{ marginTop: 12 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={<span style={{ fontWeight: 600 }}>Tên sản phẩm</span>}>
                <InputComponent name="name" value={stateProduct.name} onChange={handleOnchange}
                  style={{ borderRadius: 8, height: 40 }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={<span style={{ fontWeight: 600 }}>Giá (VND)</span>}>
                <InputComponent name="price" value={stateProduct.price} onChange={handleOnchange}
                  style={{ borderRadius: 8, height: 40 }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label={<span style={{ fontWeight: 600 }}>Mô tả</span>}>
            <InputComponent name="description" value={stateProduct.description} onChange={handleOnchange}
              style={{ borderRadius: 8, height: 40 }} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={<span style={{ fontWeight: 600 }}>Số lượng tồn kho</span>}>
                <InputComponent name="countInStock" value={stateProduct.countInStock} onChange={handleOnchange}
                  style={{ borderRadius: 8, height: 40 }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={<span style={{ fontWeight: 600 }}>Đánh giá</span>}>
                <InputComponent name="rating" value={stateProduct.rating} onChange={handleOnchange}
                  style={{ borderRadius: 8, height: 40 }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label={<span style={{ fontWeight: 600 }}>Ảnh sản phẩm</span>}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <WrapperUploadFile onChange={handleOnchangeAvatar} maxCount={1}>
                <Button icon={<PlusOutlined />} style={{ borderRadius: 8 }}>Upload ảnh</Button>
              </WrapperUploadFile>
              {stateProduct.image && (
                <img src={stateProduct.image} alt="preview"
                  style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 10, border: '1px solid #eee' }} />
              )}
            </div>
          </Form.Item>
          <Button type="primary" htmlType="submit" block
            style={{ height: 44, borderRadius: 10, fontWeight: 700, fontSize: 15, background: 'linear-gradient(135deg, #e53935, #ff7043)', border: 'none', marginTop: 8 }}>
            Tạo sản phẩm
          </Button>
        </Form>
      </Loading>
    </ModalComponent>

    {/* DRAWER CHỈNH SỬA */}
    <DrawerComponent
      title={<span style={{ fontSize: 16, fontWeight: 700, color: '#1a1a2e' }}>✏️ Chi tiết sản phẩm</span>}
      isOpen={isOpenDrawer}
      onClose={() => setIsOpenDrawer(false)}
      width="50%"
    >
      <Loading isLoading={isLoadingUpdate || mutationUpdate.isLoading}>
        <Form form={form} layout="vertical" onFinish={onUpdateProduct} style={{ padding: '8px 0' }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={<span style={{ fontWeight: 600 }}>Tên sản phẩm</span>} name="name">
                <InputComponent name="name" value={stateProductDetails.name} onChange={handleOnchangeDetails}
                  style={{ borderRadius: 8, height: 40 }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={<span style={{ fontWeight: 600 }}>Giá (VND)</span>} name="price">
                <InputComponent name="price" value={stateProductDetails.price} onChange={handleOnchangeDetails}
                  style={{ borderRadius: 8, height: 40 }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label={<span style={{ fontWeight: 600 }}>Mô tả</span>} name="description">
            <InputComponent name="description" value={stateProductDetails.description} onChange={handleOnchangeDetails}
              style={{ borderRadius: 8, height: 40 }} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={<span style={{ fontWeight: 600 }}>Số lượng tồn kho</span>} name="countInStock">
                <InputComponent name="countInStock" value={stateProductDetails.countInStock} onChange={handleOnchangeDetails}
                  style={{ borderRadius: 8, height: 40 }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={<span style={{ fontWeight: 600 }}>Đánh giá</span>} name="rating">
                <InputComponent name="rating" value={stateProductDetails.rating} onChange={handleOnchangeDetails}
                  style={{ borderRadius: 8, height: 40 }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label={<span style={{ fontWeight: 600 }}>Ảnh sản phẩm</span>}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <WrapperUploadFile onChange={handleOnchangeAvatarDetails} maxCount={1}>
                <Button icon={<PlusOutlined />} style={{ borderRadius: 8 }}>Upload ảnh</Button>
              </WrapperUploadFile>
              {stateProductDetails.image && (
                <img src={stateProductDetails.image} alt="preview"
                  style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 10, border: '1px solid #eee' }} />
              )}
            </div>
          </Form.Item>
          <Button type="primary" htmlType="submit" block
            style={{ height: 44, borderRadius: 10, fontWeight: 700, fontSize: 15, background: 'linear-gradient(135deg, #e53935, #ff7043)', border: 'none', marginTop: 8 }}>
            Cập nhật sản phẩm
          </Button>
        </Form>
      </Loading>
    </DrawerComponent>

    {/* MODAL XÁC NHẬN XÓA */}
    <ModalComponent
      title={<span style={{ fontSize: 16, fontWeight: 700, color: '#e53935' }}>⚠️ Xóa sản phẩm</span>}
      open={isModalOpenDelete}
      onCancel={handleCancelDelete}
      onOk={handleDeleteProduct}
      okButtonProps={{ danger: true, style: { borderRadius: 8, fontWeight: 600 } }}
      cancelButtonProps={{ style: { borderRadius: 8 } }}
      okText="Xóa"
      cancelText="Hủy"
    >
      <p style={{ fontSize: 15, color: '#555', margin: '12px 0' }}>
        Bạn có chắc muốn xóa sản phẩm này không? Hành động này không thể hoàn tác.
      </p>
    </ModalComponent>
  </WrapperContainer>
)
}

export default AdminProduct