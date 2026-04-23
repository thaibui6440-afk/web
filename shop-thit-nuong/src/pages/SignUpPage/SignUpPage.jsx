import React, { useState, useEffect } from 'react'
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
import { useNavigate } from 'react-router-dom'
import * as UserService from '../../services/UserService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import Loading from '../../components/LoadingComponent/Loading'
import * as message from '../../components/Message/Message'

const SignUpPage = () => {
  const navigate = useNavigate()

  const [isShowPassword, setIsShowPassword] = useState(false)
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const mutation = useMutationHooks(
    data => UserService.signupUser(data)
  )

  const { data, isLoading, isSuccess, isError } = mutation

  useEffect(() => {
    if (isSuccess) {
      message.success()
      navigate('/sign-in')
    } else if (isError) {
      message.error()
    }
  }, [isSuccess, isError])

  const handleSignUp = () => {
    mutation.mutate({ email, password, confirmPassword })
  }

  return (
    <WrapperLoginContainer>
      <WrapperLoginBox>

        {/* LEFT */}
        <WrapperContainerLeft>
          <h2>Đăng ký</h2>
          <p style={{ marginBottom: 20 }}>Tạo tài khoản mới </p>

          <InputForm
            placeholder="Email"
            value={email}
            onChange={(value) => setEmail(value)}
          />

          {/* PASSWORD */}
          <div style={{ position: 'relative', marginTop: 12 }}>
            <span
              onClick={() => setIsShowPassword(!isShowPassword)}
              style={{ position: 'absolute', right: 10, top: 8, cursor: 'pointer' }}
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

          {/* CONFIRM */}
          <div style={{ position: 'relative', marginTop: 12 }}>
            <span
              onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
              style={{ position: 'absolute', right: 10, top: 8, cursor: 'pointer' }}
            >
              {isShowConfirmPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
            </span>

            <InputForm
              placeholder="Nhập lại mật khẩu"
              type={isShowConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(value) => setConfirmPassword(value)}
            />
          </div>

          {data?.status === 'ERR' && (
            <span style={{ color: 'red', marginTop: 10 }}>
              {data?.message}
            </span>
          )}

          <Loading isLoading={isLoading}>
            <ButtonComponent
              disabled={!email.length || !password.length || !confirmPassword.length}
              onClick={handleSignUp}
              size={40}
              styleButton={{
                background: '#ff4d4f',
                height: '48px',
                width: '100%',
                border: 'none',
                borderRadius: '8px',
                margin: '24px 0 10px'
              }}
              textbutton={'Đăng ký'}
              styleTextButton={{
                color: '#fff',
                fontSize: '16px',
                fontWeight: '600'
              }}
            />
          </Loading>

          <p>
            Đã có tài khoản?
            <WrapperTextLight onClick={() => navigate('/sign-in')}>
              {' '}Đăng nhập
            </WrapperTextLight>
          </p>
        </WrapperContainerLeft>

        {/* RIGHT */}
        <WrapperContainerRight>
          <Image src={imageLogo} preview={false} width={180} />
          <h3>Join Us</h3>
          <span>Bắt đầu mua sắm ngay</span>
        </WrapperContainerRight>

      </WrapperLoginBox>
    </WrapperLoginContainer>
  )
}

export default SignUpPage