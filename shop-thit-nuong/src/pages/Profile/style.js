import { Upload } from "antd";
import styled from "styled-components";

export const WrapperHeader = styled.h1`
  font-size: 22px;
  text-align: center;
  margin: 20px 0;
`

export const WrapperContentProfile = styled.div`
  width: 500px;
  margin: 0 auto;
  padding: 30px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
`

export const WrapperAvatar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;

  img {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid #eee;
  }
`

export const WrapperLabel = styled.label`
  width: 80px;
  font-weight: 500;
`

export const WrapperInput = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;

  input {
    flex: 1;
    padding: 8px;
    border-radius: 6px;
    border: 1px solid #ddd;
  }
`

export const WrapperUploadFile = styled(Upload)`
  .ant-upload {
    border: none;
  }
`