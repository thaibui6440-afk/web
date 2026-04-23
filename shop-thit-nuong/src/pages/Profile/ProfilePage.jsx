import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import InputForm from '../../components/InputForm/InputForm'
import {
    WrapperContentProfile,
    WrapperHeader,
    WrapperInput,
    WrapperLabel,
    WrapperUploadFile,
    WrapperAvatar
} from './style'
import * as UserService from '../../services/UserService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import Loading from '../../components/LoadingComponent/Loading'
import * as message from '../../components/Message/Message'
import { updateUser } from '../../redux/slides/userSlide'
import { Button } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { getBase64 } from '../../utils'

const ProfilePage = () => {
    const user = useSelector((state) => state.user)

    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [avatar, setAvatar] = useState('')

    const dispatch = useDispatch()

    const mutation = useMutationHooks((data) => {
        const { id, access_token, ...rests } = data
        UserService.updateUser(id, rests, access_token)
    })

    const { data, isLoading, isSuccess, isError } = mutation

    useEffect(() => {
        setEmail(user?.email)
        setName(user?.name)
        setPhone(user?.phone)
        setAddress(user?.address)
        setAvatar(user?.avatar)
    }, [user])

    useEffect(() => {
        if (isSuccess) {
            message.success()
            handleGetDetailsUser(user?.id, user?.access_token)
        } else if (isError) {
            message.error()
        }
    }, [isSuccess, isError])

    const handleGetDetailsUser = async (id, token) => {
        const res = await UserService.getDetailsUser(id, token)
        dispatch(updateUser({ ...res?.data, access_token: token }))
    }

    const handleOnchangeAvatar = async ({ fileList }) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj)
        }
        setAvatar(file.preview)
    }

    const handleUpdate = () => {
        mutation.mutate({
            id: user?.id,
            email,
            name,
            phone,
            address,
            avatar,
            access_token: user?.access_token
        })
    }

    return (
        <div style={{ width: '1270px', margin: '0 auto' }}>
            <WrapperHeader>Thông tin người dùng</WrapperHeader>

            <Loading isLoading={isLoading}>
                <WrapperContentProfile>

                    {/* AVATAR */}
                    <WrapperAvatar>
                        <img
                            src={avatar}
                            alt="avatar"
                        />
                        <WrapperUploadFile onChange={handleOnchangeAvatar} maxCount={1}>
                            <Button icon={<UploadOutlined />}>Đổi ảnh</Button>
                        </WrapperUploadFile>
                    </WrapperAvatar>

                    {/* NAME */}
                    <WrapperInput>
                        <WrapperLabel>Name</WrapperLabel>
                        <InputForm value={name} onChange={setName} />
                    </WrapperInput>

                    {/* EMAIL */}
                    <WrapperInput>
                        <WrapperLabel>Email</WrapperLabel>
                        <InputForm value={email} onChange={setEmail} />
                    </WrapperInput>

                    {/* PHONE */}
                    <WrapperInput>
                        <WrapperLabel>Phone</WrapperLabel>
                        <InputForm value={phone} onChange={setPhone} />
                    </WrapperInput>

                    {/* ADDRESS */}
                    <WrapperInput>
                        <WrapperLabel>Address</WrapperLabel>
                        <InputForm value={address} onChange={setAddress} />
                    </WrapperInput>

                    {/* BUTTON */}
                    <div style={{ textAlign: 'center', marginTop: '10px' }}>
                        <ButtonComponent
                            onClick={handleUpdate}
                            size={40}
                            styleButton={{
                                background: '#ff4d4f',
                                border: 'none',
                                padding: '10px 30px',
                                borderRadius: '6px'
                            }}
                            textbutton={'Cập nhật'}
                            styleTextButton={{
                                color: '#fff',
                                fontSize: '15px',
                                fontWeight: '600'
                            }}
                        />
                    </div>

                </WrapperContentProfile>
            </Loading>
        </div>
    )
}

export default ProfilePage