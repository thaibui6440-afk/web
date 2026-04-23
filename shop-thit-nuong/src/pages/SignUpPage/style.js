import styled from "styled-components";

export const WrapperLoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #f5f7fa, #e4ecf7);
`

export const WrapperLoginBox = styled.div`
  width: 900px;
  height: 520px;
  display: flex;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0,0,0,0.1);
`

export const WrapperContainerLeft = styled.div`
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

export const WrapperContainerRight = styled.div`
  width: 350px;
  background: linear-gradient(135deg, #52c41a, #95de64);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #fff;
  gap: 10px;
`

export const WrapperTextLight = styled.span`
  color: #1890ff;
  font-size: 14px;
  cursor: pointer;
  margin-left: 5px;

  &:hover {
    text-decoration: underline;
  }
`