import React from 'react';
import styled from 'styled-components';

const Progress = styled.div`
  display: flex;
  height: 10px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.gallery};
  border-radius: 3px;
`;

const Line = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  white-space: nowrap;
  background-color: ${({ theme }) => theme.black};
  transition: width 0.6s ease;
  width: ${({ value }) => `calc(100% * ${value})`};
`;

const ProgressBar = ({ value, ...props }) => (
  <Progress {...props}>
    <Line value={value} />
  </Progress>
);

export default ProgressBar;
