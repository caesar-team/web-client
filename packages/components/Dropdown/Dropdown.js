import React, { cloneElement, memo, useState, useRef } from 'react';
import { useUpdateEffect, useClickAway } from 'react-use';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Box = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  top: ${({ withTriangleAtTop }) =>
    withTriangleAtTop ? 'calc(100% + 19px)' : 'calc(100% - 1px)'};
  right: 0;
  z-index: ${({ theme }) => theme.zIndex.dropdown};
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ theme }) => theme.color.white};
  border: 1px solid ${({ theme }) => theme.color.gallery};

  &::before {
    position: absolute;
    display: ${({ withTriangleAtTop }) =>
      withTriangleAtTop ? 'block' : 'none'};
    width: 15px;
    height: 15px;
    right: 10px;
    top: -7px;
    content: '';
    transform: rotate(45deg);
    background-color: ${({ theme }) => theme.color.white};
    border: 1px solid ${({ theme }) => theme.color.gallery};
  }
`;

const EmptyList = styled.div`
  padding: 8px 16px;
`;

const OptionsList = styled.div`
  position: relative;
  background-color: ${({ theme }) => theme.color.white};
  border-radius: ${({ theme }) => theme.borderRadius};
  overflow: hidden;
`;

const Option = styled.button`
  padding: 0;
  font-size: ${({ theme }) => theme.font.size.main};
  border: none;
  background: none;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.color.snow};
  }
`;

const Button = styled.button`
  padding: 0;
  font-size: ${({ theme }) => theme.font.size.main};
  border: none;
  background-color: transparent;
  outline: none;
  cursor: pointer;
`;

const DropdownComponent = ({
  withTriangleAtTop,
  ButtonElement,
  name,
  renderOverlay = Function.prototype,
  options,
  optionRender,
  children,
  onClick,
  onToggle,
  className,
}) => {
  const [isOpened, setOpened] = useState(false);

  const handleToggle = () => {
    setOpened(!isOpened);
  };

  const handleClick = value => () => {
    handleToggle();

    if (onClick) onClick(name, value);
  };

  const renderOptions = () =>
    options.length ? (
      options.map(({ label, value }, index) =>
        optionRender ? (
          cloneElement(optionRender(value, label), {
            key: index,
            onClick: handleClick(value),
          })
        ) : (
          <Option key={index} onClick={handleClick(value)}>
            {label}
          </Option>
        ),
      )
    ) : (
      <EmptyList>No options</EmptyList>
    );

  useUpdateEffect(() => {
    if (onToggle) {
      onToggle(isOpened);
    }
  }, [isOpened]);

  const renderedOptions = options
    ? renderOptions()
    : renderOverlay(handleToggle);

  const dropdownRef = useRef(null);
  useClickAway(dropdownRef, () => {
    if (isOpened) {
      setOpened(false);
    }
  });

  return (
    <Wrapper ref={dropdownRef} className={className}>
      {ButtonElement ? (
        <ButtonElement handleToggle={handleToggle} />
      ) : (
        <Button type="button" onClick={handleToggle}>
          {children}
        </Button>
      )}
      {isOpened && (
        <Box withTriangleAtTop={withTriangleAtTop}>
          <OptionsList>{renderedOptions}</OptionsList>
        </Box>
      )}
    </Wrapper>
  );
};

const Dropdown = memo(DropdownComponent);

Dropdown.Button = Button;
Dropdown.Box = Box;
Dropdown.OptionsList = OptionsList;
Dropdown.Option = Option;

export { Dropdown };
