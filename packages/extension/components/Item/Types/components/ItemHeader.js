import React from 'react';
import styled from 'styled-components';
import { formatDate } from '@caesar-utils/utils/dateUtils';
import { LIST_TYPE } from '@caesar-utils/constants';
import { upperFirst } from '@caesar-utils//utils/string';
import { Icon, Button, Avatar, AvatarsList, Dropdown } from '@caesar-ui';
import { Row } from './Row';

const StyledRow = styled(Row)`
  margin-top: 10px;
  margin-bottom: 35px;
`;

const ItemButton = styled(Button)`
  margin-left: 20px;
`;

const InviteRow = styled(Row)`
  margin-top: 10px;
`;

const UpdatedDate = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.color.emperor};
`;

const Owner = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 15px;
`;

const OwnerName = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.color.black};
`;

const OwnerStatus = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.color.gray};
`;

const StyledAvatarsList = styled(AvatarsList)`
  margin-right: 30px;

  &:last-child {
    margin-right: 0;
  }
`;

const InviteButton = styled.button`
  width: 40px;
  height: 40px;
  ${({ hasInvited }) => hasInvited && 'margin-right: -10px'};
  color: ${({ theme }) => theme.color.emperor};
  border: 1px dashed ${({ theme }) => theme.color.gallery};
  border-radius: 50%;
  outline: none;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: ${({ theme }) => theme.color.black};
    border-color: ${({ theme }) => theme.color.emperor};
  }
`;

const ShareButton = styled(Button)`
  text-transform: uppercase;
`;

const EditButton = styled(Button)`
  padding-right: 13px;
  padding-left: 13px;
  text-transform: uppercase;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.color.black};
`;

const FavoriteButton = styled.button`
  align-self: flex-start;
  margin-top: 20px;
  padding: 0;
  cursor: pointer;
  background: none;
  border: none;
  outline: none;
  transition: 0.2s;

  &:hover {
    opacity: 0.75;
  }
`;

const StyledDropdown = styled(Dropdown)`
  ${Dropdown.Button} {
    width: 100%;
  }
`;

const MoveTo = styled.a`
  cursor: pointer;
  height: 40px;
  font-size: 14px;
  border-radius: 3px;
  outline: none;
  padding: 10px 20px;
  transition: all 0.2s;
  border: 1px solid ${({ theme }) => theme.color.gallery};

  &:hover {
    border: 1px solid ${({ theme }) => theme.color.black};
  }
`;

export const ItemHeader = ({
  allLists,
  isReadOnly,
  hasWriteAccess,
  isTrashItem,
  isSharedItem,
  user,
  members,
  onClickCloseItem,
  onClickRemoveItem,
  onClickEditItem,
  onClickInvite,
  onClickShare,
  onClickRestoreItem,
  onClickMoveItem,
  onToggleFavorites,
  item: {
    id: itemId,
    listId,
    lastUpdated,
    invited,
    favorite,
    ownerId,
    data: { name },
  },
}) => {
  if (isSharedItem) {
    return (
      <>
        <StyledRow>
          <UpdatedDate>Last updated {formatDate(lastUpdated)}</UpdatedDate>
        </StyledRow>
        <Row>
          <Title>{name}</Title>
        </Row>
      </>
    );
  }

  const avatars = invited.reduce((accumulator, item) => {
    if (!members[item.userId]) {
      return accumulator;
    }

    if (user.id === item.userId && user.id !== ownerId) {
      accumulator.unshift(user);
    } else if (ownerId !== item.userId) {
      accumulator.push(members[item.userId]);
    }

    return accumulator;
  }, []);

  const hasInvited = invited.length > 0;
  const isOwner = user.id === ownerId;

  const options = allLists
    .filter(({ id, type }) => type !== LIST_TYPE.TRASH && id !== listId)
    .map(({ label, id }) => ({ value: id, label: upperFirst(label) }));

  return (
    <>
      <Row>
        <UpdatedDate>Last updated {formatDate(lastUpdated)}</UpdatedDate>
        <Row>
          {isReadOnly && (
            <StyledDropdown options={options} onClick={onClickMoveItem}>
              <MoveTo>MOVE TO</MoveTo>
            </StyledDropdown>
          )}
          {isTrashItem ? (
            <ButtonsWrapper>
              <Button color="white" onClick={onClickRestoreItem}>
                RESTORE
              </Button>
              <ItemButton
                color="white"
                icon="trash"
                onClick={onClickRemoveItem}
              >
                REMOVE
              </ItemButton>
            </ButtonsWrapper>
          ) : (
            hasWriteAccess && (
              <EditButton color="white" icon="pencil" onClick={onClickEditItem}>
                EDIT
              </EditButton>
            )
          )}
          <ItemButton color="white" icon="close" onClick={onClickCloseItem} />
        </Row>
      </Row>
      <Row>
        <Title>{name}</Title>
        <FavoriteButton onClick={onToggleFavorites(itemId)}>
          <Icon
            name={favorite ? 'favorite-active' : 'favorite'}
            width={20}
            height={20}
          />
        </FavoriteButton>
      </Row>
      <InviteRow>
        <Row>
          <Avatar
            name={owner ? owner.name : ''}
            avatar={owner ? owner.avatar : ''}
          />
          <Owner>
            <OwnerName>{owner ? owner.name : ''}</OwnerName>
            <OwnerStatus>owner</OwnerStatus>
          </Owner>
        </Row>
        <Row>
          {!isTrashItem && isOwner && (
            <InviteButton onClick={onClickInvite} hasInvited={hasInvited}>
              <Icon name="plus" width={14} height={14} />
            </InviteButton>
          )}
          <StyledAvatarsList avatars={avatars} />
          {!isTrashItem && isOwner && (
            <ShareButton icon="share" color="black" onClick={onClickShare}>
              Share
            </ShareButton>
          )}
        </Row>
      </InviteRow>
    </>
  );
};
