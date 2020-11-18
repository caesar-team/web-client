/* eslint-disable camelcase */
import React, { useState, useCallback, useMemo } from 'react';
import { useUpdateEffect } from 'react-use';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { isLoadingSelector } from '@caesar/common/selectors/workflow';
import { isLoadingTeamsSelector } from '@caesar/common/selectors/entities/team';
import { removeTeamRequest } from '@caesar/common/actions/entities/team';
import { leaveTeamRequest } from '@caesar/common/actions/currentUser';
import {
  addTeamMembersBatchRequest,
  grantAccessTeamMemberRequest,
  removeTeamMemberRequest,
  updateTeamMemberRoleRequest,
} from '@caesar/common/actions/entities/member';
import {
  Button,
  SettingsWrapper,
  Can,
  DataTable,
  TableStyles as Table,
  InviteModal,
  ConfirmModal,
  ConfirmLeaveTeamModal,
} from '@caesar/components';
import {
  PERMISSION,
  PERMISSION_ENTITY,
  ROUTES,
  TEAM_ROLES,
  TEAM_TYPE,
} from '@caesar/common/constants';
import { getTeamTitle } from '@caesar/common/utils/team';

import {
  INVITE_MEMBER_MODAL,
  LEAVE_TEAM_MODAL,
  REMOVE_TEAM_MODAL,
} from './constants';
import { createColumns } from './createColumns';

const ButtonStyled = styled(Button)`
  margin-right: 24px;
`;

const AddMemberButton = styled(ButtonStyled)`
  margin-right: 0;
`;

export const TeamContainer = ({ currentUser, team, members }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [modalVisibilities, setModalVisibilities] = useState({
    [INVITE_MEMBER_MODAL]: false,
    [LEAVE_TEAM_MODAL]: false,
    [REMOVE_TEAM_MODAL]: false,
  });

  const isLoading = useSelector(isLoadingSelector);
  const isLoadingTeams = useSelector(isLoadingTeamsSelector);

  // Window height minus stuff that takes vertical place (including table headers)
  const tableVisibleDataHeight = window?.innerHeight - 275;
  const [tableRowGroupNode, setTableRowGroupNode] = useState(null);
  const [tableWidth, setTableWidth] = useState(0);

  const measuredRef = useCallback(node => {
    if (node !== null) {
      setTableWidth(node.getBoundingClientRect().width);
      // To calculate where roleDropdown must be opened
      setTableRowGroupNode(node.children[0]?.children[1].children[0]);
    }
  }, []);

  const tableHeight = tableRowGroupNode?.offsetHeight;
  const [tableScrollTop, setTableScrollTop] = useState(0);

  useUpdateEffect(() => {
    if (!tableRowGroupNode) {
      return false;
    }

    const handler = () => {
      setTableScrollTop(tableRowGroupNode.scrollTop);
    };

    tableRowGroupNode.addEventListener('scroll', handler);

    return () => tableRowGroupNode.removeEventListener('scroll', handler);
  }, [tableRowGroupNode]);

  const tableData = useMemo(() => members, [members]);

  const handleChangeRole = memberId => (_, value) => {
    dispatch(updateTeamMemberRoleRequest(memberId, value));
  };

  const handleRemoveMember = memberId => () => {
    dispatch(removeTeamMemberRequest(memberId));
  };

  const handleGrantAccessMember = memberId => () => {
    dispatch(grantAccessTeamMemberRequest(memberId));
  };

  const columns = useMemo(
    () =>
      createColumns({
        tableWidth,
        tableHeight,
        tableScrollTop,
        handleChangeRole,
        handleRemoveMember,
        handleGrantAccessMember,
      }),
    [tableWidth, tableHeight, tableScrollTop],
  );

  const handleOpenModal = modal => () => {
    setModalVisibilities({
      ...modalVisibilities,
      [modal]: true,
    });
  };

  const handleCloseModal = modal => () => {
    setModalVisibilities({
      ...modalVisibilities,
      [modal]: false,
    });
  };

  const handleInvite = invitedUsers => {
    dispatch(addTeamMembersBatchRequest(team.id, invitedUsers));
    handleCloseModal(INVITE_MEMBER_MODAL)();
  };

  const handleLeaveTeam = () => {
    dispatch(leaveTeamRequest(team.id));
  };

  const handleRemoveTeam = () => {
    dispatch(removeTeamRequest(team.id));
  };

  if (!team.id && !isLoadingTeams) {
    router.push(ROUTES.SETTINGS + ROUTES.TEAM);

    return null;
  }

  const teamSubject = {
    __typename: PERMISSION_ENTITY.TEAM,
    ...team._permissions,
  };

  const teamMemberSubject = {
    __typename: PERMISSION_ENTITY.TEAM_MEMBER,
    team_member_add:
      team._permissions?.team_member_add ||
      team.teamRole === TEAM_ROLES.ROLE_ADMIN ||
      false,
  };

  const mayAddMember = !team.locked;
  const isDomainTeam =
    team.type === TEAM_TYPE.DEFAULT ||
    team.title?.toLowerCase() === TEAM_TYPE.DEFAULT;

  return (
    <SettingsWrapper
      isLoading={isLoading || isLoadingTeams}
      title={`${getTeamTitle(team)} (${members.length})`}
      addonTopComponent={
        <>
          <Can I={PERMISSION.DELETE} a={teamSubject}>
            <ButtonStyled
              withOfflineCheck
              icon="trash"
              color="white"
              onClick={handleOpenModal(REMOVE_TEAM_MODAL)}
            />
          </Can>
          <Can I={PERMISSION.LEAVE} a={teamSubject}>
            {!isDomainTeam && (
              <ButtonStyled
                withOfflineCheck
                icon="leave"
                color="white"
                onClick={handleOpenModal(LEAVE_TEAM_MODAL)}
              />
            )}
          </Can>
          {mayAddMember && (
            <Can I={PERMISSION.ADD} a={teamMemberSubject}>
              <AddMemberButton
                withOfflineCheck
                onClick={handleOpenModal(INVITE_MEMBER_MODAL)}
                icon="plus"
                color="black"
              >
                Add a member
              </AddMemberButton>
            </Can>
          )}
        </>
      }
    >
      <Table.Main ref={measuredRef}>
        <DataTable
          columns={columns}
          data={tableData}
          initialState={{
            sortBy: [
              {
                id: 'name',
                desc: false,
              },
            ],
          }}
          tableVisibleDataHeight={tableVisibleDataHeight}
        />
      </Table.Main>
      {modalVisibilities[INVITE_MEMBER_MODAL] && (
        <InviteModal
          currentUser={currentUser}
          teamId={team.id}
          members={members}
          onRemoveMember={handleRemoveMember}
          onCancel={handleCloseModal(INVITE_MEMBER_MODAL)}
          onSubmit={handleInvite}
        />
      )}
      {modalVisibilities[REMOVE_TEAM_MODAL] && (
        <ConfirmModal
          isOpened
          description="Are you sure you want to remove team?"
          onClickConfirm={handleRemoveTeam}
          onClickCancel={handleCloseModal(REMOVE_TEAM_MODAL)}
        />
      )}
      {modalVisibilities[LEAVE_TEAM_MODAL] && (
        <ConfirmLeaveTeamModal
          isOpened
          teamTitle={team.title}
          onClickConfirm={handleLeaveTeam}
          onClickCancel={handleCloseModal(LEAVE_TEAM_MODAL)}
        />
      )}
    </SettingsWrapper>
  );
};
