import { Badge, Col, Popover } from 'antd'
import React, { useEffect, useState } from 'react'
import {
  WrapperContentPopup,
  WrapperHeader,
  WrapperHeaderAccout,
  WrapperTextHeader,
  WrapperTextHeaderSmall
} from './style'
import {
  UserOutlined,
  CaretDownOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons'
import ButttonInputSearch from '../ButtonInputSearch/ButttonInputSearch'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import * as UserService from '../../services/UserService'
import { resetUser } from '../../redux/slides/userSlide'
import Loading from '../LoadingComponent/Loading'
import { searchProduct } from '../../redux/slides/productSlide'

const HeaderComponent = ({ isHiddenSearch = false, isHiddenCart = false }) => {
  const navigate = useNavigate()
  const user = useSelector((state) => state.user)
  const order = useSelector((state) => state.order)
  const dispatch = useDispatch()

  const [userName, setUserName] = useState('')
  const [userAvatar, setUserAvatar] = useState('')
  const [search, setSearch] = useState('')
  const [isOpenPopup, setIsOpenPopup] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleNavigateLogin = () => navigate('/sign-in')

  const handleLogout = async () => {
    setLoading(true)
    await UserService.logoutUser()
    dispatch(resetUser())
    setLoading(false)
  }

  useEffect(() => {
    setUserName(user?.name)
    setUserAvatar(user?.avatar)
  }, [user?.name, user?.avatar])

  const handleClickNavigate = (type) => {
    if (type === 'profile') {
      navigate('/profile-user')
    } else if (type === 'admin') {
      navigate('/system/admin')
    } else if (type === 'my-order') {
      navigate('/my-order', {
        state: {
          id: user?.id,
          token: user?.access_token
        }
      })
    } else {
      handleLogout()
    }
    setIsOpenPopup(false)
  }

  const content = (
    <div>
      <WrapperContentPopup onClick={() => handleClickNavigate('profile')}>
        Thông tin người dùng
      </WrapperContentPopup>
      {user?.isAdmin && (
        <WrapperContentPopup onClick={() => handleClickNavigate('admin')}>
          Quản lí hệ thống
        </WrapperContentPopup>
      )}
      <WrapperContentPopup onClick={() => handleClickNavigate('my-order')}>
        Đơn hàng của tôi
      </WrapperContentPopup>
      <WrapperContentPopup onClick={() => handleClickNavigate()}>
        Đăng xuất
      </WrapperContentPopup>
    </div>
  )

  const onSearch = (e) => {
    setSearch(e.target.value)
    dispatch(searchProduct(e.target.value))
  }

  return (
    <div style={{ width: '100%', background: '#ff4d4f', display: 'flex', justifyContent: 'center' }}>
      <WrapperHeader>

        {/* LOGO */}
        <Col span={5}>
          <WrapperTextHeader to="/">Thịt Nướng</WrapperTextHeader>
        </Col>

        {/* SEARCH */}
        {!isHiddenSearch && (
          <Col span={11}>
            <ButttonInputSearch
              size="large"
              bordered={false}
              textbutton="Tìm kiếm"
              placeholder="Tìm sản phẩm..."
              onChange={onSearch}
              backgroundColorButton="#d9363e"
            />
          </Col>
        )}

        {/* RIGHT */}
        <Col span={8} style={{ display: 'flex', gap: '40px', alignItems: 'center', justifyContent: 'flex-end' }}>
          
          {/* USER */}
          <Loading isLoading={loading}>
            <WrapperHeaderAccout>
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt="avatar"
                  style={{
                    height: '32px',
                    width: '32px',
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <UserOutlined style={{ fontSize: '28px' }} />
              )}

              {user?.email ? (
                <Popover content={content} trigger="click" open={isOpenPopup}>
                  <div
                    onClick={() => setIsOpenPopup((prev) => !prev)}
                    style={{ cursor: 'pointer', maxWidth: 120, overflow: 'hidden', whiteSpace: 'nowrap' }}
                  >
                    {userName || user?.email}
                  </div>
                </Popover>
              ) : (
                <div onClick={handleNavigateLogin} style={{ cursor: 'pointer' }}>
                  <WrapperTextHeaderSmall>Đăng nhập</WrapperTextHeaderSmall>
                  <div>
                    <WrapperTextHeaderSmall>Tài khoản</WrapperTextHeaderSmall>
                    <CaretDownOutlined />
                  </div>
                </div>
              )}
            </WrapperHeaderAccout>
          </Loading>

          {/* CART */}
          {!isHiddenCart && (
            <div
              onClick={() => navigate('/order')}
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Badge count={order?.orderItems?.length} size="small">
                <ShoppingCartOutlined style={{ fontSize: '28px', color: '#fff' }} />
              </Badge>
              <WrapperTextHeaderSmall>Giỏ hàng</WrapperTextHeaderSmall>
            </div>
          )}
        </Col>
      </WrapperHeader>
    </div>
  )
}

export default HeaderComponent