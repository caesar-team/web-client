import styled from 'styled-components';

const getPseudoStyles = ({ position = 'center', width = 2 }) => {
  if (position === 'left') {
    return `
      &::before {
        content: '';
        flex: 0;
      }

      &::after {
        content: '';
        border-top: ${width}px solid;
        margin: 0 16px 0 16px;
        flex: 1 0 20px;
      }
    `;
  }

  if (position === 'right') {
    return `
      &::before {
        content: '';
        border-top: ${width}px solid;
        margin: 0 16px 0 16px;
        flex: 1 0 20px;
      }
    
      &::after {
        content: '';
        flex: 0;
      }
    `;
  }

  return `
    &::before,
    &::after {
      content: '';
      border-top: ${width}px solid;
      margin: 0 16px 0 0;
      flex: 1 0 20px;
    }
  
    &::after {
      margin: 0 0 0 16px;
    }
  `;
};

const TextWithLines = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  font-size: ${({ theme }) => theme.font.size.small};
  color: ${({ theme }) => theme.color.gray};
  text-transform: uppercase;
  text-align: center;

  ${getPseudoStyles}
`;

export default TextWithLines;
