import React from 'react'
import { useNavigate } from 'react-router-dom'
import { WrapperType } from './styled'

const TypeProduct = ({ name }) => {
  const navigate = useNavigate()
  const handleNavigatetype = (type) => {
    const slug = type
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\//g, '-')      // ← đổi / thành -
        .replace(/ /g, '_')
    navigate(`/product/${slug}`, { state: type })
}
  return (
    <WrapperType onClick={() => handleNavigatetype(name)}>{name}</WrapperType>
  )
}

export default TypeProduct