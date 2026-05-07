import { Upload } from "antd";
import styled from "styled-components";

export const WrapperContainer = styled.div`
  padding: 28px 32px;
  background: #f7f8fc;
  min-height: 100vh;
`

export const WrapperHeader = styled.div`
  margin-bottom: 24px;

  .ant-typography {
    color: #1a1a2e;
    font-weight: 700;
    letter-spacing: 0.3px;
  }
`

export const WrapperTable = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 16px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);

  /* Header bảng */
  .ant-table-thead > tr > th {
    background: #fafafa;
    color: #888;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    border-bottom: 2px solid #f0f0f0;
  }

  /* Row hover */
  .ant-table-tbody > tr:hover > td {
    background: #fff8f8 !important;
  }

  /* Row */
  .ant-table-tbody > tr > td {
    font-size: 14px;
    color: #1a1a2e;
    padding: 14px 16px;
    border-bottom: 1px solid #f9f9f9;
  }

  /* Nút xóa tất cả */
  .delete-all-btn {
    background: linear-gradient(135deg, #e53935, #ff7043);
    color: #fff;
    font-weight: 700;
    font-size: 13px;
    padding: 10px 20px;
    border-radius: 10px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    box-shadow: 0 4px 12px rgba(229,57,53,0.25);
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.9;
    }
  }
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