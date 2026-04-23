import { Radio } from "antd";
import styled from "styled-components";

export const WrapperContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

export const WrapperInfo = styled.div`
  padding: 16px 20px;
  background: #fff;
  border-radius: 10px;
`

export const WrapperValue = styled.div`
  background: #f6ffed;
  border: 1px solid #b7eb8f;
  padding: 10px 14px;
  width: fit-content;
  border-radius: 6px;
  margin-top: 6px;
  font-size: 14px;
`

export const WrapperItemOrderInfo = styled.div`
  background: #fff;
  border-radius: 10px;
  padding: 10px 0;
`

export const WrapperItemOrder = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
`

export const Lable = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #333;
`

export const WrapperRadio = styled(Radio.Group)`
  margin-top: 6px;
`