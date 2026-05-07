import { Radio } from "antd";
import styled from "styled-components";

export const WrapperStyleHeader = styled.div`
  background: #ffffff;
  padding: 12px 18px;
  border-radius: 12px;
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
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const WrapperListOrder = styled.div``;

export const WrapperItemOrder = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 18px;
  background: #fff;
  margin-top: 12px;
  border-radius: 12px;
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
  display: flex;
  flex-direction: column;
  gap: 14px;
  position: sticky;
  top: 20px;
  height: fit-content;
`;

export const WrapperInfo = styled.div`
  padding: 18px 22px;
  background: #fff;
  border-radius: 14px;
  width: 100%;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  border: 1px solid #f0f0f0;

  div {
    margin-bottom: 8px;
    &:last-child { margin-bottom: 0; }
  }
`;

export const WrapperTotal = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 22px;
  background: linear-gradient(135deg, #fff5f5 0%, #fff9f0 100%);
  border-radius: 14px;
  border: 1.5px dashed #ffcdd2;
  box-shadow: 0 2px 12px rgba(255,57,69,0.08);
`;

export const Lable = styled.span`
  font-size: 14px;
  color: #222;
  font-weight: 700;
  display: block;
  margin-bottom: 12px;
`;

export const WrapperRadio = styled(Radio.Group)`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;

  .ant-radio-wrapper {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    border-radius: 10px;
    border: 1.5px solid #f0f0f0;
    background: #fafafa;
    transition: all 0.2s;
    margin: 0;
    font-weight: 500;
    font-size: 14px;
    color: #333;

    &:hover {
      border-color: #ff3945;
      background: #fff5f5;
    }
  }

  .ant-radio-wrapper-checked {
    border-color: #ff3945 !important;
    background: #fff0f0 !important;
    color: #ff3945;
  }
`;

export const MomoBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, #ae2070, #d82d8b);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 20px;
  margin-left: 8px;
  letter-spacing: 0.3px;
`;