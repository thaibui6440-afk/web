import { Row } from "antd";
import { Link } from "react-router-dom";
import styled from "styled-components";

export const WrapperHeader = styled(Row)`
  align-items: center;
  width: 1200px;
  padding: 12px 0;
`

export const WrapperTextHeader = styled(Link)`
  font-size: 20px;
  color: #fff;
  font-weight: bold;

  &:hover {
    color: #fff;
  }
`

export const WrapperHeaderAccout = styled.div`
  display: flex;
  align-items: center;
  color: #fff;
  gap: 8px;
`

export const WrapperTextHeaderSmall = styled.span`
  font-size: 13px;
  color: #fff;
`

export const WrapperContentPopup = styled.p`
  cursor: pointer;
  padding: 6px 0;

  &:hover {
    color: #ff4d4f;
  }
`