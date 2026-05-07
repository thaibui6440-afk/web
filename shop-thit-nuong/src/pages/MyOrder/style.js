import styled from "styled-components";

export const WrapperStyleHeader = styled.div`
  background: rgb(255, 255, 255);
  padding: 9px 16px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  span {
    color: rgb(36, 36, 36);
    font-weight: 400;
    font-size: 13px;
  }
`

export const WrapperStyleHeaderDilivery = styled.div`
  background: rgb(255, 255, 255);
  padding: 9px 16px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  span {
    color: rgb(36, 36, 36);
    font-weight: 400;
    font-size: 13px;
  };
  margin-bottom: 4px;
`

export const WrapperContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #f7f8fc;
  padding: 32px 0;
`

export const WrapperLeft = styled.div`
  width: 910px;
`

export const WrapperListOrder = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: 20px;
  padding-bottom: 40px;
`

export const WrapperFooterItem = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #f0f0f0;
  width: 100%;
  padding-top: 14px;
  margin-top: 4px;
`

export const WrapperHeaderItem = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px 0;
  border-bottom: 1px solid #f9f9f9;

  &:last-of-type {
    border-bottom: none;
  }
`

export const WrapperItemOrder = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px 24px;
  background: #fff;
  border-radius: 16px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  width: 100%;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 6px 24px rgba(229, 57, 53, 0.08);
  }
`

export const WrapperStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  width: 100%;
  margin-bottom: 14px;
  padding-bottom: 14px;
  border-bottom: 1px solid #f0f0f0;
`