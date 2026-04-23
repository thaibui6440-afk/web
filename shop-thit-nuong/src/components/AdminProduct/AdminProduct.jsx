import {
  Button,
  Form,
  Select,
  Space,
  Card,
  Row,
  Col,
  Typography
} from 'antd'
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined
} from '@ant-design/icons'
import React, { useRef, useState, useEffect } from 'react'
import {
  WrapperHeader,
  WrapperUploadFile,
  WrapperContainer,
  WrapperTable
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
  const searchInput = useRef(null)

  const inittial = () => ({
    name: '',
    price: '',
    description: '',
    rating: '',
    image: '',
    type: '',
    countInStock: '',
    newType: '',
    discount: '',
  })

  const [stateProduct, setStateProduct] = useState(inittial())
  const [stateProductDetails, setStateProductDetails] = useState(inittial())

  const [form] = Form.useForm()

  // ====== LOGIC GIỮ NGUYÊN ======
  const mutation = useMutationHooks((data) => {
    return ProductService.createProduct(data)
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

  const getAllProducts = async () => {
    return ProductService.getAllProduct()
  }

  const fetchAllTypeProduct = async () => {
    return ProductService.getAllTypeProduct()
  }

  const queryProduct = useQuery({ queryKey: ['products'], queryFn: getAllProducts })
  const typeProduct = useQuery({ queryKey: ['type-product'], queryFn: fetchAllTypeProduct })

  const { data: products, isLoading: isLoadingProducts } = queryProduct

  // ====== UI ACTION ======
  const renderAction = () => (
    <Space size="middle">
      <DeleteOutlined
        style={{ color: '#ff4d4f', fontSize: 20 }}
        onClick={() => setIsModalOpenDelete(true)}
      />
      <EditOutlined
        style={{ color: '#faad14', fontSize: 20 }}
        onClick={() => setIsOpenDrawer(true)}
      />
    </Space>
  )

  const columns = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Price', dataIndex: 'price' },
    { title: 'Rating', dataIndex: 'rating' },
    { title: 'Type', dataIndex: 'type' },
    { title: 'Action', render: renderAction }
  ]

  const dataTable =
    products?.data?.map((product) => ({
      ...product,
      key: product._id
    })) || []

  // ====== FORM HANDLER ======
  const handleOnchange = (e) => {
    setStateProduct({
      ...stateProduct,
      [e.target.name]: e.target.value
    })
  }

  const handleOnchangeAvatar = async ({ fileList }) => {
    const file = fileList[0]
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }
    setStateProduct({
      ...stateProduct,
      image: file.preview
    })
  }

  const onFinish = () => {
    mutation.mutate({
      ...stateProduct,
      type: stateProduct.type === 'add_type'
        ? stateProduct.newType
        : stateProduct.type
    }, {
      onSettled: () => queryProduct.refetch()
    })
  }

  return (
    <WrapperContainer>
      {/* HEADER */}
      <WrapperHeader>
        <Title level={3}>Quản lý sản phẩm</Title>
      </WrapperHeader>

      {/* BUTTON ADD */}
      <Card
        style={{
          marginBottom: 20,
          borderRadius: 12,
          textAlign: 'center'
        }}
      >
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          size="large"
          style={{
            height: 80,
            width: 200,
            fontSize: 18,
            borderRadius: 10
          }}
          onClick={() => setIsModalOpen(true)}
        >
          Thêm sản phẩm
        </Button>
      </Card>

      {/* TABLE */}
      <WrapperTable>
        <TableComponent
          columns={columns}
          isLoading={isLoadingProducts}
          data={dataTable}
          onRow={(record) => ({
            onClick: () => setRowSelected(record._id)
          })}
        />
      </WrapperTable>

      {/* MODAL CREATE */}
      <ModalComponent
        title="Tạo sản phẩm"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Loading isLoading={mutation.isLoading}>
          <Form layout="vertical" onFinish={onFinish}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Tên">
                  <InputComponent name="name" onChange={handleOnchange} />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Giá">
                  <InputComponent name="price" onChange={handleOnchange} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Mô tả">
              <InputComponent name="description" onChange={handleOnchange} />
            </Form.Item>

            <Form.Item label="Ảnh">
              <WrapperUploadFile onChange={handleOnchangeAvatar}>
                <Button>Upload</Button>
              </WrapperUploadFile>
            </Form.Item>

            <Button type="primary" htmlType="submit" block>
              Tạo sản phẩm
            </Button>
          </Form>
        </Loading>
      </ModalComponent>
    </WrapperContainer>
  )
}

export default AdminProduct