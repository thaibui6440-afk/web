import { InputNumber } from "antd";
import styled from "styled-components";

export const WrapperStyleNameProduct = styled.h1`
  font-size: 22px;
  font-weight: 600;
  color: #222;
`

export const WrapperStyleTextSell = styled.span`
  font-size: 14px;
  color: #888;
`

export const WrapperPriceProduct = styled.div`
  background: #fff1f0;
  border-radius: 8px;
  margin: 10px 0;
`

export const WrapperPriceTextProduct = styled.h1`
  font-size: 28px;
  color: #ff4d4f;
  font-weight: bold;
  padding: 10px;
`

export const WrapperAddressProduct = styled.div`
  margin: 10px 0;

  .address {
    font-weight: 500;
    text-decoration: underline;
  }

  .change-address {
    color: #1677ff;
    cursor: pointer;
    margin-left: 4px;
  }
`

export const WrapperQualityProduct = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  width: 120px;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 4px;

  button {
    border: none;
    background: transparent;
    cursor: pointer;
  }
`

export const WrapperInputNumber = styled(InputNumber)`
  width: 40px;
  border: none;

  .ant-input-number-handler-wrap {
    display: none;
  }
`