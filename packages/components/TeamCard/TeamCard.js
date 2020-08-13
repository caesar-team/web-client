import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import memoizeOne from 'memoize-one';
import { Button, AvatarsList, Can } from '@caesar/components';
import {
  ROUTES,
  PERMISSION,
  PERMISSION_ENTITY,
} from '@caesar/common/constants';
import { getTeamTitle } from '@caesar/common/utils/team';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-radius: 3px;
  background-color: ${({ theme }) => theme.color.white};
`;

const TeamWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.color.lightBlue};
`;

const TeamDetails = styled.div`
  display: flex;
  align-items: center;
`;

const TeamIcon = styled.img`
  object-fit: cover;
  width: 80px;
  height: 80px;
  border-radius: 50%;
`;

const TeamInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 20px;
`;

const TeamName = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 18px;
`;

const TeamMembers = styled.div`
  font-size: 18px;
  color: ${({ theme }) => theme.color.gray};
`;

const AvatarsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const getMembers = memoizeOne((users, members) =>
  users.reduce((accumulator, { id }) => {
    const member = members.find(user => user.id === id);

    return member ? [...accumulator, member] : accumulator;
  }, []),
);

const TeamCard = ({
  className,
  team,
  members,
  isRemoveButtonVisible = false,
  onClick = Function.prototype,
  onClickRemoveTeam = Function.prototype,
}) => {
  const { id, icon, users } = team;
  const areMembersAvailable = users && users.length > 0;

  const teamSubject = {
    __typename: PERMISSION_ENTITY.TEAM,
    // eslint-disable-next-line camelcase
    team_delete: !!team?._links?.team_delete,
  };

  return (
    <Wrapper className={className} onClick={onClick}>
      <Link
        key={id}
        href={`${ROUTES.SETTINGS}${ROUTES.TEAM}/[id]`}
        as={`${ROUTES.SETTINGS}${ROUTES.TEAM}/${id}`}
      >
        <TeamWrapper>
          <TeamDetails>
            <TeamIcon src={icon} />
            <TeamInfo>
              <TeamName>{getTeamTitle(team)}</TeamName>
              {areMembersAvailable && (
                <TeamMembers>{users.length} members</TeamMembers>
              )}
            </TeamInfo>
          </TeamDetails>
        </TeamWrapper>
      </Link>
      <AvatarsWrapper>
        {areMembersAvailable && (
          <AvatarsList
            size={32}
            fontSize="small"
            avatars={getMembers(users, members)}
            visibleCount={10}
          />
        )}
        {isRemoveButtonVisible && (
          <Can I={PERMISSION.DELETE} a={teamSubject}>
            <Button color="white" onClick={onClickRemoveTeam}>
              Remove
            </Button>
          </Can>
        )}
      </AvatarsWrapper>
    </Wrapper>
  );
};

export default TeamCard;
