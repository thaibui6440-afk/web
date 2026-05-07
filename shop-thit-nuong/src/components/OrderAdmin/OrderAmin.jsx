import { Button, Form, Space, Switch, Tag, Tooltip } from 'antd'
import React, { useEffect } from 'react'
import { WrapperHeader } from './style'
import TableComponent from '../TableComponent/TableComponent'
import InputComponent from '../InputComponent/InputComponent'
import Loading from '../LoadingComponent/Loading'
import { convertPrice } from '../../utils'
import * as message from '../Message/Message'
import * as OrderService from '../../services/OrderService'
import { useQuery } from '@tanstack/react-query'
import { SearchOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import { orderContant } from '../../contant'

import { useMutationHooks } from '../../hooks/useMutationHook'

const OrderAdmin = () => {
  const user = useSelector((state) => state?.user)

  const getAllOrder = async () => {
    const res = await OrderService.getAllOrder(user?.access_token)
    return res
  }

  const queryOrder = useQuery({ queryKey: ['orders'], queryFn: getAllOrder })
  const { isLoading: isLoadingOrders, data: orders } = queryOrder

  // Mutation cập nhật đơn hàng
  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rest } = data
    return OrderService.updateOrder(id, rest, token)
  })

  const { isSuccess, isError } = mutationUpdate

  useEffect(() => {
    if (isSuccess) {
      message.success('Cập nhật thành công!')
      queryOrder.refetch()
    } else if (isError) {
      message.error('Cập nhật thất bại!')
    }
  }, [isSuccess, isError])

  const handleUpdateStatus = (id, field, value) => {
    mutationUpdate.mutate({
      id,
      token: user?.access_token,
      [field]: value
    })
  }

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <InputComponent
          placeholder={`Tìm ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button type="primary" icon={<SearchOutlined />} size="small" style={{ width: 90 }}
            onClick={() => confirm()}>
            Tìm
          </Button>
          <Button size="small" style={{ width: 90 }}
            onClick={() => { clearFilters && clearFilters(); confirm() }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#e53935' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
  })

  const columns = [
    {
      title: 'Khách hàng',
      dataIndex: 'userName',
      sorter: (a, b) => a.userName?.localeCompare(b.userName),
      ...getColumnSearchProps('userName'),
      render: (text) => <span style={{ fontWeight: 600, color: '#1a1a2e' }}>{text}</span>
    },
    {
      title: 'Điện thoại',
      dataIndex: 'phone',
      ...getColumnSearchProps('phone'),
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      ...getColumnSearchProps('address'),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalPrice',
      sorter: (a, b) => a.rawTotal - b.rawTotal,
      render: (text) => <span style={{ color: '#e53935', fontWeight: 700 }}>{text}</span>
    },
    {
      title: 'Thanh toán',
      dataIndex: 'isPaid',
      filters: [
        { text: 'Đã thanh toán', value: true },
        { text: 'Chưa thanh toán', value: false },
      ],
      onFilter: (value, record) => record.rawIsPaid === value,
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Tag color={record.rawIsPaid ? 'success' : 'warning'}
            style={{ borderRadius: 20, fontWeight: 600 }}>
            {record.rawIsPaid ? 'Đã TT' : 'Chưa TT'}
          </Tag>
          <Tooltip title={record.rawIsPaid ? 'Đánh dấu chưa thanh toán' : 'Xác nhận đã thanh toán'}>
            <Switch
              checked={record.rawIsPaid}
              size="small"
              style={{ background: record.rawIsPaid ? '#52c41a' : '#ccc' }}
              onChange={(checked) => handleUpdateStatus(record._id, 'isPaid', checked)}
            />
          </Tooltip>
        </div>
      )
    },
    {
      title: 'Giao hàng',
      dataIndex: 'isDelivered',
      filters: [
        { text: 'Đã giao', value: true },
        { text: 'Chưa giao', value: false },
      ],
      onFilter: (value, record) => record.rawIsDelivered === value,
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Tag color={record.rawIsDelivered ? 'success' : 'orange'}
            style={{ borderRadius: 20, fontWeight: 600 }}>
            {record.rawIsDelivered ? 'Đã giao' : 'Chưa giao'}
          </Tag>
          <Tooltip title={record.rawIsDelivered ? 'Đánh dấu chưa giao' : 'Xác nhận đã giao'}>
            <Switch
              checked={record.rawIsDelivered}
              size="small"
              style={{ background: record.rawIsDelivered ? '#52c41a' : '#ccc' }}
              onChange={(checked) => handleUpdateStatus(record._id, 'isDelivered', checked)}
            />
          </Tooltip>
        </div>
      )
    },
    {
      title: 'Phương thức',
      dataIndex: 'paymentMethod',
      ...getColumnSearchProps('paymentMethod'),
    },
  ]

  const dataTable = orders?.data?.length && orders?.data?.map((order) => ({
    ...order,
    key: order._id,
    userName: order?.shippingAddress?.fullName,
    phone: order?.shippingAddress?.phone,
    address: `${order?.shippingAddress?.address}, ${order?.shippingAddress?.city}`,
    paymentMethod: orderContant.payment[order?.paymentMethod],
    rawIsPaid: order?.isPaid,
    rawIsDelivered: order?.isDelivered,
    rawTotal: order?.totalPrice,
    totalPrice: convertPrice(order?.totalPrice),
  }))

  return (
    <div style={{ padding: '24px', background: '#f7f8fc', minHeight: '100vh' }}>

      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <div style={{
          width: 4, height: 28,
          background: 'linear-gradient(180deg, #e53935, #ff7043)',
          borderRadius: 4
        }} />
        <WrapperHeader style={{ margin: 0 }}>Quản lý đơn hàng</WrapperHeader>
      </div>

      

      {/* Table */}
      <div style={{
        background: '#fff', borderRadius: 16, padding: 20,
        border: '1px solid #f0f0f0',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
      }}>
        <TableComponent
          columns={columns}
          isLoading={isLoadingOrders}
          data={dataTable}
        />
      </div>
    </div>
  )
}

export default OrderAdmin