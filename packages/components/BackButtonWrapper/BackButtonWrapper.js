import styled from 'styled-components';

const BackButtonWrapper = styled.div`
  position: absolute;
  top: 120px;
  left: 55px;
  font-size: 14px;
  color: ${({ theme }) => theme.color.black};
`;

export default BackButtonWrapper;
