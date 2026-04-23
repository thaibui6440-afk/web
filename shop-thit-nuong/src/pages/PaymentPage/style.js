import { Radio } from "antd";
import styled from "styled-components";

export const WrapperStyleHeader = styled.div`
  background: #ffffff;
  padding: 12px 18px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);

  span {
    color: #333;
    font-weight: 500;
    font-size: 14px;
  }
`;

export const WrapperLeft = styled.div`
  width: 70%;
`;

export const WrapperListOrder = styled.div``;

export const WrapperItemOrder = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 18px;
  background: #fff;
  margin-top: 12px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
`;

export const WrapperPriceDiscount = styled.span`
  color: #999;
  font-size: 12px;
  text-decoration: line-through;
  margin-left: 6px;
`;

export const WrapperCountOrder = styled.div`
  display: flex;
  align-items: center;
  width: 90px;
  border: 1px solid #ddd;
  border-radius: 6px;
  overflow: hidden;
`;

export const WrapperRight = styled.div`
  width: 30%;
  margin-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const WrapperInfo = styled.div`
  padding: 16px 20px;
  background: #fff;
  border-radius: 10px;
  width: 100%;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
`;

export const WrapperTotal = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 18px 20px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
`;

export const Lable = styled.span`
  font-size: 13px;
  color: #333;
  font-weight: 600;
`;

export const WrapperRadio = styled(Radio.Group)`
  margin-top: 10px;
  background: #f9fbff;
  border: 1px solid #d6e4ff;
  width: 100%;
  border-radius: 10px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  .ant-radio-wrapper {
    padding: 8px 10px;
    border-radius: 6px;
    transition: 0.2s;
  }

  .ant-radio-wrapper:hover {
    background: #e6f4ff;
  }
`;