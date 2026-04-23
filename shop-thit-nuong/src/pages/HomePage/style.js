import styled from "styled-components";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";

export const WrapperTypeProduct = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 10px 0;
  overflow-x: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`

export const WrapperButtonMore = styled(ButtonComponent)`
  &:hover {
    color: #fff;
    background: #ff4d4f;
    span {
      color: #fff;
    }
  }

  width: 100%;
  text-align: center;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')}
`

export const WrapperProducts = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
`