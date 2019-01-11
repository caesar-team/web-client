import React from 'react';
import styled from 'styled-components';
import Input from './Input';
import { Icon } from '../Icon';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const InnerWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 60px;
  border-radius: 3px;
  background-color: ${({ theme }) => theme.darkGray};
  min-width: 400px;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-width: 60px;
`;

const StyledIcon = styled(Icon)`
  fill: ${({ isError, theme }) => (isError ? theme.red : theme.white)};
`;

const StyledArrowIcon = styled(Icon)`
  fill: ${({ theme }) => theme.lightGray};
  margin-right: 24px;
  cursor: pointer;

  &:hover {
    fill: ${({ theme }) => theme.white};
  }
`;

const StyledInput = styled(Input)`
  ${Input.InputField} {
    color: ${({ theme, isError }) => (isError ? theme.red : theme.white)};
    background-color: ${({ theme }) => theme.darkGray};
    height: 58px;
    width: 100%;
    padding-right: 20px;
    padding-left: 8px;
  }
`;

const LockInput = ({ error, onClick, ...props }) => {
  const isError = !!error;

  return (
    <Wrapper>
      <InnerWrapper isError={isError}>
        <IconWrapper isError={isError}>
          <StyledIcon name="lock" width={20} height={24} isError={isError} />
        </IconWrapper>
        <StyledInput {...props} isError={isError} type="password" />
        <StyledArrowIcon
          name="arrow-next"
          width={16}
          height={16}
          onClick={onClick}
        />
      </InnerWrapper>
    </Wrapper>
  );
};

export default LockInput;
