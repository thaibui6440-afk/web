import { Card } from "antd";
import styled from "styled-components";

export const WrapperCardStyle = styled(Card)`
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
  border: none;
  box-shadow: none;
  background: #fff;

  &:hover {
    transform: translateY(-4px);
    transition: all 0.3s ease;
  }

  .ant-card-body {
    padding: 10px;
    text-align: center;
  }
`

export const WrapperName = styled.div`
  font-size: 15px;
  color: #000;
  margin-bottom: 6px;
  min-height: 40px;
`

export const WrapperPrice = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #666;
`