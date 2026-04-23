import { Checkbox } from "antd";
import styled from "styled-components";

export const WrapperStyleHeader = styled.div`
  background: #ffffff;
  padding: 14px 20px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  border: 1px solid #f0f0f0;
  span {
    color: #444;
    font-weight: 500;
    font-size: 13px;
    letter-spacing: 0.3px;
  }
`;

export const WrapperStyleHeaderDilivery = styled.div`
  background: linear-gradient(135deg, #fff7f0 0%, #fff0f0 100%);
  padding: 14px 20px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  border: 1px solid #ffe0d0;
  margin-bottom: 10px;
  span {
    color: #c0392b;
    font-weight: 500;
    font-size: 13px;
  }
`;

export const WrapperLeft = styled.div`
  width: 910px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const WrapperListOrder = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const WrapperItemOrder = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 20px;
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  border: 1px solid #f5f5f5;
  transition: box-shadow 0.2s ease, transform 0.2s ease;

  &:hover {
    box-shadow: 0 6px 20px rgba(255, 57, 69, 0.1);
    transform: translateY(-1px);
  }

  img {
    border-radius: 10px;
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
  width: 90px;
  border: 1.5px solid #e8e8e8;
  border-radius: 8px;
  overflow: hidden;
  background: #fafafa;

  button {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    cursor: pointer;
    transition: background 0.15s;

    &:hover {
      background: #fff0f0;
    }
  }
`;

export const WrapperRight = styled.div`
  width: 330px;
  margin-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 0;
  align-items: center;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  border: 1px solid #f0f0f0;
  background: #fff;
  height: fit-content;
  position: sticky;
  top: 20px;
`;

export const WrapperInfo = styled.div`
  padding: 16px 20px;
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
  align-items: flex-start;
  justify-content: space-between;
  padding: 18px 20px;
  background: #fff9f9;
  width: 100%;
  border-top: 2px dashed #ffe0e0;
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