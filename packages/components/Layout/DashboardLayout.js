import React, { memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import ScrollLock from 'react-scrolllock';
import { DASHBOARD_MODE } from '@caesar/common/constants';
import {
  currentUserDataSelector,
  currentTeamIdSelector,
} from '@caesar/common/selectors/currentUser';
import { teamKeyPairSelector } from '@caesar/common/selectors/keystore';
import {
  setWorkInProgressItem,
  resetWorkInProgressItemIds,
} from '@caesar/common/actions/workflow';
import LayoutConstructor from './LayoutConstructor';
import { PrimaryHeader } from './PrimaryHeader';

const LayoutConstructorStyled = styled(LayoutConstructor)`
  padding: 0;
  overflow: hidden;
`;

const DashboardLayoutComponent = ({
  searchedText,
  setSearchedText,
  setMode,
  children,
  ...props
}) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(currentUserDataSelector);
  const teamId = useSelector(currentTeamIdSelector);
  const keyPair = useSelector(state => teamKeyPairSelector(state, { teamId }));

  const handleSearch = event => {
    event.preventDefault();

    dispatch(resetWorkInProgressItemIds());
    dispatch(setWorkInProgressItem(null));

    setSearchedText(event.target.value);

    setMode(
      event.target.value ? DASHBOARD_MODE.SEARCH : DASHBOARD_MODE.DEFAULT,
    );
  };

  const handleClickResetSearch = () => {
    dispatch(resetWorkInProgressItemIds());
    dispatch(setWorkInProgressItem(null));

    setSearchedText('');
    setMode(DASHBOARD_MODE.DEFAULT);
  };

  return (
    <LayoutConstructorStyled
      headerComponent={
        <PrimaryHeader
          currentUser={currentUser}
          searchedText={searchedText}
          showAddItemButton={!!keyPair}
          onSearch={handleSearch}
          onClickReset={handleClickResetSearch}
        />
      }
      {...props}
    >
      <ScrollLock>{children}</ScrollLock>
    </LayoutConstructorStyled>
  );
};

export const DashboardLayout = memo(DashboardLayoutComponent);
