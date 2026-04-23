import React, { useEffect, useState } from 'react'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import InputForm from '../../components/InputForm/InputForm'
import {
  WrapperContainerLeft,
  WrapperContainerRight,
  WrapperTextLight,
  WrapperLoginContainer,
  WrapperLoginBox
} from './style'
import imageLogo from '../../assets/images/logo-login.png'
import { Image } from 'antd'
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons'
import { useLocation, useNavigate } from 'react-router-dom'
import * as UserService from '../../services/UserService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import Loading from '../../components/LoadingComponent/Loading'
import jwt_decode from "jwt-decode";
import { useDispatch, useSelector } from 'react-redux'
import { updateUser } from '../../redux/slides/userSlide'

const SignInPage = () => {
  const [isShowPassword, setIsShowPassword] = useState(false)
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)
  const navigate = useNavigate()

  const mutation = useMutationHooks(
    data => UserService.loginUser(data)
  )
  const { data, isLoading, isSuccess } = mutation

  useEffect(() => {
    if (isSuccess) {
      if (location?.state) {
        navigate(location?.state)
      } else {
        navigate('/')
      }
      localStorage.setItem('access_token', JSON.stringify(data?.access_token))
      localStorage.setItem('refresh_token', JSON.stringify(data?.refresh_token))
      if (data?.access_token) {
        const decoded = jwt_decode(data?.access_token)
        if (decoded?.id) {
          handleGetDetailsUser(decoded?.id, data?.access_token)
        }
      }
    }
  }, [isSuccess])

  const handleGetDetailsUser = async (id, token) => {
    const storage = localStorage.getItem('refresh_token')
    const refreshToken = JSON.parse(storage)
    const res = await UserService.getDetailsUser(id, token)
    dispatch(updateUser({ ...res?.data, access_token: token, refreshToken }))
  }

  const handleSignIn = () => {
    mutation.mutate({ email, password })
  }

  return (
    <WrapperLoginContainer>
      <WrapperLoginBox>

        {/* LEFT */}
        <WrapperContainerLeft>
          <h2>Đăng nhập</h2>
          <p style={{ marginBottom: 20 }}>Chào mừng bạn quay lại </p>

          <InputForm
            placeholder="Email"
            value={email}
            onChange={(value) => setEmail(value)}
          />

          <div style={{ position: 'relative', marginTop: 12 }}>
            <span
              onClick={() => setIsShowPassword(!isShowPassword)}
              style={{
                position: 'absolute',
                right: 10,
                top: 8,
                cursor: 'pointer'
              }}
            >
              {isShowPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
            </span>

            <InputForm
              placeholder="Mật khẩu"
              type={isShowPassword ? "text" : "password"}
              value={password}
              onChange={(value) => setPassword(value)}
            />
          </div>

          {data?.status === 'ERR' && (
            <span style={{ color: 'red', marginTop: 10 }}>
              {data?.message}
            </span>
          )}

          <Loading isLoading={isLoading}>
            <ButtonComponent
              disabled={!email.length || !password.length}
              onClick={handleSignIn}
              size={40}
              styleButton={{
                background: '#ff4d4f',
                height: '48px',
                width: '100%',
                border: 'none',
                borderRadius: '8px',
                margin: '24px 0 10px'
              }}
              textbutton={'Đăng nhập'}
              styleTextButton={{
                color: '#fff',
                fontSize: '16px',
                fontWeight: '600'
              }}
            />
          </Loading>

          <p style={{ marginTop: 10 }}>
            <WrapperTextLight>Quên mật khẩu?</WrapperTextLight>
          </p>

          <p>
            Chưa có tài khoản?
            <WrapperTextLight onClick={() => navigate('/sign-up')}>
              {' '}Đăng ký
            </WrapperTextLight>
          </p>
        </WrapperContainerLeft>

        {/* RIGHT */}
        <WrapperContainerRight>
          <Image src={imageLogo} preview={false} width={180} />
          <h3>Welcome Back</h3>
          <span>Mua sắm dễ dàng hơn</span>
        </WrapperContainerRight>

      </WrapperLoginBox>
    </WrapperLoginContainer>
  )
}

export default SignInPage