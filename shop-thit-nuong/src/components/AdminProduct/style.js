import { Upload } from "antd";
import styled from "styled-components";

export const WrapperContainer = styled.div`
  padding: 20px;
  background: #f5f5f5;
  min-height: 100vh;
`

export const WrapperHeader = styled.div`
  margin-bottom: 20px;
`

export const WrapperTable = styled.div`
  background: #fff;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
`

export const WrapperUploadFile = styled(Upload)`
  & .ant-upload {
    border-radius: 10px;
    overflow: hidden;
  }

  & .ant-upload-list {
    display: none;
  }
`