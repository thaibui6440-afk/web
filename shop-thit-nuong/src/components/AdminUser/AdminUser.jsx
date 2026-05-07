import { Button, Form, Space, Switch, Tag } from 'antd'
import React from 'react'
import { WrapperHeader, WrapperUploadFile } from './style'
import TableComponent from '../TableComponent/TableComponent'
import InputComponent from '../InputComponent/InputComponent'
import DrawerComponent from '../DrawerComponent/DrawerComponent'
import Loading from '../LoadingComponent/Loading'
import ModalComponent from '../ModalComponent/ModalComponent'
import { getBase64 } from '../../utils'
import { useEffect } from 'react'
import * as message from '../../components/Message/Message'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useRef } from 'react'
import { useMutationHooks } from '../../hooks/useMutationHook'
import * as UserService from '../../services/UserService'
import { useIsFetching, useQueryClient } from '@tanstack/react-query'
import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons'

const AdminUser = () => {
  const [rowSelected, setRowSelected] = useState('')
  const [isOpenDrawer, setIsOpenDrawer] = useState(false)
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
  const user = useSelector((state) => state?.user)
  const searchInput = useRef(null)

  const [stateUserDetails, setStateUserDetails] = useState({
    name: '', email: '', phone: '',
    isAdmin: false, avatar: '', address: ''
  })

  const [form] = Form.useForm()

  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data
    return UserService.updateUser(id, { ...rests }, token)
  })

  const mutationDeletedMany = useMutationHooks((data) => {
    const { token, ...ids } = data
    return UserService.deleteManyUser(ids, token)
  })

  const mutationDeleted = useMutationHooks((data) => {
    const { id, token } = data
    return UserService.deleteUser(id, token)
  })

  const queryClient = useQueryClient()
  const users = queryClient.getQueryData(['users'])
  const isFetchingUser = useIsFetching(['users'])

  const handleDelteManyUsers = (ids) => {
    mutationDeletedMany.mutate({ ids: ids, token: user?.access_token }, {
      onSettled: () => queryClient.invalidateQueries(['users'])
    })
  }

  const fetchGetDetailsUser = async (rowSelected) => {
    const res = await UserService.getDetailsUser(rowSelected)
    if (res?.data) {
      setStateUserDetails({
        name: res?.data?.name,
        email: res?.data?.email,
        phone: res?.data?.phone,
        isAdmin: res?.data?.isAdmin,
        address: res?.data?.address,
        avatar: res.data?.avatar
      })
    }
    setIsLoadingUpdate(false)
  }

  useEffect(() => {
    form.setFieldsValue(stateUserDetails)
  }, [form, stateUserDetails])

  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      setIsLoadingUpdate(true)
      fetchGetDetailsUser(rowSelected)
    }
  }, [rowSelected, isOpenDrawer])

  const { data: dataUpdated, isLoading: isLoadingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate
  const { data: dataDeleted, isLoading: isLoadingDeleted, isSuccess: isSuccessDelected, isError: isErrorDeleted } = mutationDeleted
  const { data: dataDeletedMany, isLoading: isLoadingDeletedMany, isSuccess: isSuccessDelectedMany, isError: isErrorDeletedMany } = mutationDeletedMany

  useEffect(() => {
    if (isSuccessDelected && dataDeleted?.status === 'OK') {
      message.success()
      handleCancelDelete()
    } else if (isErrorDeleted) {
      message.error()
    }
  }, [isSuccessDelected])

  useEffect(() => {
    if (isSuccessDelectedMany && dataDeletedMany?.status === 'OK') {
      message.success()
    } else if (isErrorDeletedMany) {
      message.error()
    }
  }, [isSuccessDelectedMany])

  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === 'OK') {
      message.success()
      handleCloseDrawer()
    } else if (isErrorUpdated) {
      message.error()
    }
  }, [isSuccessUpdated])

  // Phân quyền trực tiếp trên bảng
  const handleToggleAdmin = (record, checked) => {
    mutationUpdate.mutate(
      { id: record._id, token: user?.access_token, isAdmin: checked },
      { onSettled: () => queryClient.invalidateQueries(['users']) }
    )
  }

  const renderAction = () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <DeleteOutlined
        style={{ color: '#e53935', fontSize: 22, cursor: 'pointer' }}
        onClick={() => setIsModalOpenDelete(true)}
      />
      <EditOutlined
        style={{ color: '#faad14', fontSize: 22, cursor: 'pointer' }}
        onClick={() => setIsOpenDrawer(true)}
      />
    </div>
  )

  const handleSearch = (selectedKeys, confirm) => confirm()
  const handleReset = (clearFilters) => clearFilters()

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <InputComponent
          ref={searchInput}
          placeholder={`Tìm ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button type="primary" onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />} size="small" style={{ width: 90 }}>
            Tìm
          </Button>
          <Button onClick={() => clearFilters && handleReset(clearFilters)}
            size="small" style={{ width: 90 }}>
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
    onFilterDropdownOpenChange: (visible) => {
      if (visible) setTimeout(() => searchInput.current?.select(), 100)
    },
  })

  const columns = [
    {
      title: 'Tên',
      dataIndex: 'name',
      sorter: (a, b) => a.name?.length - b.name?.length,
      ...getColumnSearchProps('name'),
      render: (text) => <span style={{ fontWeight: 600, color: '#1a1a2e' }}>{text}</span>
    },
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: (a, b) => a.email?.length - b.email?.length,
      ...getColumnSearchProps('email'),
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      ...getColumnSearchProps('address'),
    },
    {
      title: 'Điện thoại',
      dataIndex: 'phone',
      sorter: (a, b) => a.phone - b.phone,
      ...getColumnSearchProps('phone'),
    },
    {
      title: 'Phân quyền',
      dataIndex: 'isAdmin',
      filters: [
        { text: 'Admin', value: 'TRUE' },
        { text: 'User', value: 'FALSE' },
      ],
      onFilter: (value, record) => record.isAdmin === value,
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Tag
            color={record.rawIsAdmin ? 'red' : 'default'}
            style={{ borderRadius: 20, fontWeight: 600, minWidth: 50, textAlign: 'center' }}
          >
            {record.rawIsAdmin ? 'Admin' : 'User'}
          </Tag>
          <Switch
            checked={record.rawIsAdmin}
            size="small"
            style={{ background: record.rawIsAdmin ? '#e53935' : '#ccc' }}
            onChange={(checked) => handleToggleAdmin(record, checked)}
          />
        </div>
      )
    },
    {
      title: 'Thao tác',
      dataIndex: 'action',
      render: renderAction
    },
  ]

  const dataTable = users?.data?.length > 0 && users?.data?.map((u) => ({
    ...u,
    key: u._id,
    isAdmin: u.isAdmin ? 'TRUE' : 'FALSE',
    rawIsAdmin: u.isAdmin,
  }))

  const handleCloseDrawer = () => {
    setIsOpenDrawer(false)
    setStateUserDetails({ name: '', email: '', phone: '', isAdmin: false, avatar: '', address: '' })
    form.resetFields()
  }

  const handleCancelDelete = () => setIsModalOpenDelete(false)

  const handleDeleteUser = () => {
    mutationDeleted.mutate({ id: rowSelected, token: user?.access_token }, {
      onSettled: () => queryClient.invalidateQueries(['users'])
    })
  }

  const handleOnchangeDetails = (e) => {
    setStateUserDetails({ ...stateUserDetails, [e.target.name]: e.target.value })
  }

  const handleOnchangeAvatarDetails = async ({ fileList }) => {
    const file = fileList[0]
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }
    setStateUserDetails({ ...stateUserDetails, avatar: file.preview })
  }

  const onUpdateUser = () => {
    mutationUpdate.mutate({ id: rowSelected, token: user?.access_token, ...stateUserDetails }, {
      onSettled: () => queryClient.invalidateQueries(['users'])
    })
  }

  return (
    <div style={{ padding: '24px', background: '#f7f8fc', minHeight: '100vh' }}>

      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <div style={{
          width: 4, height: 28,
          background: 'linear-gradient(180deg, #e53935, #ff7043)',
          borderRadius: 4
        }} />
        <WrapperHeader style={{ margin: 0 }}>Quản lý người dùng</WrapperHeader>
      </div>

      {/* Table */}
      <div style={{
        background: '#fff', borderRadius: 16, padding: 20,
        border: '1px solid #f0f0f0', boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
      }}>
        <TableComponent
          handleDelteMany={handleDelteManyUsers}
          columns={columns}
          isLoading={isFetchingUser}
          data={dataTable}
          onRow={(record) => ({
            onClick: () => setRowSelected(record._id)
          })}
        />
      </div>

      {/* Drawer chỉnh sửa */}
      <DrawerComponent title='Chi tiết người dùng' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width="50%">
        <Loading isLoading={isLoadingUpdate || isLoadingUpdated}>
          <Form name="basic" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}
            onFinish={onUpdateUser} autoComplete="on" form={form}>

            <Form.Item label="Tên" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
              <InputComponent value={stateUserDetails.name} onChange={handleOnchangeDetails} name="name" style={{ borderRadius: 8, height: 40 }} />
            </Form.Item>

            <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Vui lòng nhập email!' }]}>
              <InputComponent value={stateUserDetails.email} onChange={handleOnchangeDetails} name="email" style={{ borderRadius: 8, height: 40 }} />
            </Form.Item>

            <Form.Item label="Điện thoại" name="phone" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}>
              <InputComponent value={stateUserDetails.phone} onChange={handleOnchangeDetails} name="phone" style={{ borderRadius: 8, height: 40 }} />
            </Form.Item>

            <Form.Item label="Địa chỉ" name="address" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}>
              <InputComponent value={stateUserDetails.address} onChange={handleOnchangeDetails} name="address" style={{ borderRadius: 8, height: 40 }} />
            </Form.Item>

            <Form.Item label="Quyền Admin" name="isAdmin">
              <Switch
                checked={stateUserDetails.isAdmin}
                onChange={(checked) => setStateUserDetails({ ...stateUserDetails, isAdmin: checked })}
                style={{ background: stateUserDetails.isAdmin ? '#e53935' : '#ccc' }}
              />
              <span style={{ marginLeft: 10, color: stateUserDetails.isAdmin ? '#e53935' : '#888', fontWeight: 600 }}>
                {stateUserDetails.isAdmin ? 'Admin' : 'User'}
              </span>
            </Form.Item>

            <Form.Item label="Ảnh đại diện" name="avatar">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <WrapperUploadFile onChange={handleOnchangeAvatarDetails} maxCount={1}>
                  <Button style={{ borderRadius: 8 }}>Chọn ảnh</Button>
                </WrapperUploadFile>
                {stateUserDetails?.avatar && (
                  <img src={stateUserDetails?.avatar} style={{
                    height: 60, width: 60, borderRadius: '50%',
                    objectFit: 'cover', border: '2px solid #f0f0f0'
                  }} alt="avatar" />
                )}
              </div>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 4, span: 20 }}>
              <Button type="primary" htmlType="submit" style={{
                height: 40, borderRadius: 10, fontWeight: 700, minWidth: 120,
                background: 'linear-gradient(135deg, #e53935, #ff7043)', border: 'none'
              }}>
                Cập nhật
              </Button>
            </Form.Item>
          </Form>
        </Loading>
      </DrawerComponent>

      {/* Modal xóa */}
      <ModalComponent
        title={<span style={{ color: '#e53935', fontWeight: 700 }}>⚠️ Xóa người dùng</span>}
        open={isModalOpenDelete}
        onCancel={handleCancelDelete}
        onOk={handleDeleteUser}
        okButtonProps={{ danger: true, style: { borderRadius: 8, fontWeight: 600 } }}
        cancelButtonProps={{ style: { borderRadius: 8 } }}
        okText="Xóa" cancelText="Hủy"
      >
        <Loading isLoading={isLoadingDeleted}>
          <p style={{ fontSize: 15, color: '#555', margin: '12px 0' }}>
            Bạn có chắc muốn xóa tài khoản này không? Hành động này không thể hoàn tác.
          </p>
        </Loading>
      </ModalComponent>
    </div>
  )
}

export default AdminUser