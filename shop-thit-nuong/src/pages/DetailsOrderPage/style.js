import styled from "styled-components"

export const WrapperHeaderUser = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
`

export const WrapperInfoUser = styled.div`
  flex: 1;

  .name-info {
    font-size: 14px;
    color: #1a1a2e;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .address-info, .phone-info, .delivery-info, .delivery-fee, .payment-info {
    color: #555e6d;
    font-size: 13px;
    margin-top: 8px;
    line-height: 1.5;
  }
  .address-info span, .phone-info span, .delivery-fee span {
    color: #888;
    font-size: 12px;
  }
  .name-delivery {
    color: #e65c00;
    font-weight: 700;
    font-size: 12px;
    background: #fff3e8;
    padding: 2px 8px;
    border-radius: 4px;
    margin-right: 6px;
  }
  .status-payment {
    margin-top: 10px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: #e65c00;
    font-size: 13px;
    font-weight: 600;
    background: #fff3e8;
    padding: 4px 12px;
    border-radius: 20px;

    &::before {
      content: '';
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #e65c00;
      display: inline-block;
    }
  }
`

export const WrapperLabel = styled.div`
  color: #e53935;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;

  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(to right, #e5393530, transparent);
  }
`

export const WrapperContentInfo = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 16px 18px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  min-height: 100px;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 4px 16px rgba(229, 57, 53, 0.08);
  }
`

export const WrapperStyleContent = styled.div`
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 16px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  overflow: hidden;
`

export const WrapperProduct = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 24px;
  border-top: 1px solid #f5f5f5;
  transition: background 0.15s;

  &:hover {
    background: #fafafa;
  }
`

export const WrapperNameProduct = styled.div`
  display: flex;
  align-items: center;
  width: 670px;
  gap: 14px;

  img {
    border-radius: 10px;
    border: 1px solid #eee;
    object-fit: cover;
    box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  }
`

export const WrapperItem = styled.div`
  width: 200px;
  font-size: 14px;
  color: #1a1a2e;
  font-weight: 600;

  &:last-child {
    color: #e53935;
    font-weight: 700;
  }
`

export const WrapperItemLabel = styled.div`
  width: 200px;
  font-size: 12px;
  color: #888;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

export const WrapperAllPrice = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 10px 24px 0;

  &:last-child {
    padding-bottom: 20px;
    margin-top: 4px;

    ${WrapperItem} {
      font-size: 20px;
      color: #e53935;
    }

    ${WrapperItemLabel} {
      font-size: 13px;
      color: #555;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
  }
`