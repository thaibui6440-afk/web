import { Checkbox } from "antd";
import styled from "styled-components";

export const WrapperStyleHeader = styled.div`
  background: #ffffff;
  padding: 16px 24px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  border: 1px solid #f0f0f0;
  span {
    color: #444;
    font-weight: 500;
    font-size: 13px;
    letter-spacing: 0.3px;
  }
`;

export const WrapperStyleHeaderDilivery = styled.div`
  background: linear-gradient(135deg, #fffbf0 0%, #fff5e0 100%);
  padding: 14px 20px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  border: 1px solid #ffd59e;
  margin-bottom: 10px;
  span {
    color: #b7550a;
    font-weight: 600;
    font-size: 13px;
  }
`;

export const WrapperLeft = styled.div`
  width: 910px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const WrapperListOrder = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const WrapperItemOrder = styled.div`
  display: flex;
  align-items: center;
  padding: 20px 24px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  border: 1px solid #f5f5f5;
  transition: box-shadow 0.25s ease, transform 0.25s ease, border-color 0.25s ease;

  &:hover {
    box-shadow: 0 8px 28px rgba(255, 57, 69, 0.12);
    transform: translateY(-2px);
    border-color: #ffcdd2;
  }

  img {
    border-radius: 12px;
    border: 1px solid #f0f0f0;
  }
`;

export const WrapperPriceDiscount = styled.span`
  color: #bbb;
  font-size: 12px;
  text-decoration: line-through;
  margin-left: 4px;
`;

export const WrapperCountOrder = styled.div`
  display: flex;
  align-items: center;
  width: 100px;
  border: 1.5px solid #ffcdd2;
  border-radius: 20px;
  overflow: hidden;
  background: #fff;

  button {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;

    &:hover {
      background: #fff0f0;
      color: #ff3945;
    }
  }
`;

export const WrapperRight = styled.div`
  width: 360px;
  margin-left: 16px;
  display: flex;
  flex-direction: column;
  gap: 0;
  align-items: center;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(255, 57, 69, 0.12);
  border: 1px solid #ffe4e4;
  background: #fff;
  height: fit-content;
  position: sticky;
  top: 20px;
`;

export const WrapperInfo = styled.div`
  padding: 18px 22px;
  border-bottom: 1px solid #f5f5f5;
  background: #fff;
  width: 100%;

  span {
    font-size: 13.5px;
    color: #555;
  }
`;

export const WrapperTotal = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 22px;
  background: linear-gradient(135deg, #fff5f5 0%, #fff9f0 100%);
  width: 100%;
  border-top: 2px dashed #ffcdd2;
`;

export const CustomCheckbox = styled(Checkbox)`
  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: #ff3945;
    border-color: #ff3945;
  }
  .ant-checkbox:hover .ant-checkbox-inner {
    border-color: #ff3945;
  }
  .ant-checkbox-inner {
    border-radius: 5px;
  }
`;