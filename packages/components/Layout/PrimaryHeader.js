import React, { memo, useState } from 'react';
import { useDispatch } from 'react-redux';
import equal from 'fast-deep-equal';
import styled from 'styled-components';
import Link from 'next/link';
import { logout } from '@caesar/common/actions/currentUser';
import { ROUTES } from '@caesar/common/constants';
import { Icon } from '../Icon';
import { Dropdown } from '../Dropdown';
import { SearchInput } from '../Input';
import { AddItem } from '../AddItem';
import { Logo } from './Logo';

const Wrapper = styled.header`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.color.gallery};
  width: 100%;
  background-color: ${({ theme }) => theme.color.white};
  height: 56px;
`;

const LeftWrapper = styled.div`
  display: flex;
  align-items: center;
  flex: 0 0 287px;
  padding-left: 24px;
`;

const RightWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
  padding: 0 24px;
`;

const StyledSearchInput = styled(SearchInput)`
  margin-right: auto;
`;

const AddItemButton = styled(AddItem)`
  margin-left: auto;
  margin-right: 10px;
`;

const UserSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: auto;
`;

const UserName = styled.div`
  margin-left: 8px;
  margin-right: 8px;
  white-space: nowrap;
`;

const StyledDropdown = styled(Dropdown)`
  ${Dropdown.Button} {
    display: flex;
    color: ${({ theme }) => theme.color.black};
    flex-direction: row;
    align-items: center;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      color: ${({ theme }) => theme.color.emperor};
    }
  }
`;

const Option = styled.div`
  padding: 10px 30px;
  font-size: 16px;
  color: ${({ theme }) => theme.color.black};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.color.snow};
  }
`;

const Anchor = styled.a`
  color: inherit;
  white-space: nowrap;
  text-decoration: none;
`;

const ArrowIcon = styled(Icon)`
  transform: ${({ isDropdownOpened }) =>
    isDropdownOpened ? 'scaleY(-1)' : 'scaleY(1)'};
  transition: transform 0.2s;
`;

const Options = () => {
  const dispatch = useDispatch();

  return (
    <>
      <Option key="settings">
        <Link href={ROUTES.SETTINGS + ROUTES.TEAM}>
          <Anchor>Settings</Anchor>
        </Link>
      </Option>
      <Option key="logout" onClick={() => dispatch(logout())}>
        <Anchor>Logout</Anchor>
      </Option>
    </>
  );
};

const PrimaryHeaderComponent = ({
  currentUser,
  searchedText,
  showAddItemButton,
  onSearch,
  onClickReset,
}) => {
  const [isDropdownOpened, setDropdownOpened] = useState(false);
  const userName =
    (currentUser && (currentUser.name || currentUser.email)) || '';

  const handleToggleDropdown = () => {
    setDropdownOpened(!isDropdownOpened);
  };

  return (
    <>
      <Wrapper>
        <LeftWrapper>
          <Logo href="/" />
        </LeftWrapper>
        {!!currentUser && (
          <RightWrapper>
            {onSearch && (
              <StyledSearchInput
                name="search"
                autoComplete="nope"
                searchedText={searchedText}
                onChange={onSearch}
                onClickReset={onClickReset}
              />
            )}
            {showAddItemButton && <AddItemButton />}
            <UserSection>
              <StyledDropdown
                renderOverlay={Options}
                onToggle={handleToggleDropdown}
                withTriangleAtTop
              >
                <UserName>{userName}</UserName>
                <ArrowIcon
                  name="arrow-triangle"
                  width={16}
                  height={16}
                  color="black"
                  isDropdownOpened={isDropdownOpened}
                />
              </StyledDropdown>
            </UserSection>
            {/* TODO: Add notifications feature */}
          </RightWrapper>
        )}
      </Wrapper>
    </>
  );
};

export const PrimaryHeader = memo(
  PrimaryHeaderComponent,
  (prevProps, nextProps) => equal(prevProps, nextProps),
);
