import styled from "styled-components"

export const WrapperContainer = styled.div`
  background: #f5f5f5;
  min-height: 100vh;
  padding: 20px 0;

  .container {
    width: 1200px;
    margin: 0 auto;
  }
`

export const WrapperProducts = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 👈 3 cột như hình */
  gap: 24px;
  margin-top: 20px;
`