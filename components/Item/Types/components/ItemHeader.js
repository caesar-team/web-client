import React, { Fragment } from 'react';
import styled from 'styled-components';
import { formatDate } from 'common/utils/dateUtils';
import { Icon } from 'components/Icon';
import { Button } from 'components/Button';
import { Avatar, AvatarsList } from 'components/Avatar';
import { Row } from './Row';

const ItemButton = styled(Button)`
  margin-left: 20px;
`;

const InviteRow = styled(Row)`
  margin-top: 10px;
`;

const UpdatedDate = styled.div`
  font-size: 14px;
  letter-spacing: 0.4px;
  color: ${({ theme }) => theme.emperor};
`;

const Owner = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 15px;
`;

const OwnerName = styled.div`
  font-size: 16px;
  letter-spacing: 0.5px;
  color: ${({ theme }) => theme.black};
`;

const OwnerStatus = styled.div`
  font-size: 14px;
  letter-spacing: 0.4px;
  color: ${({ theme }) => theme.gray};
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
  color: ${({ theme }) => theme.emperor};
  border: 1px dashed ${({ theme }) => theme.gallery};
  border-radius: 50%;
  outline: none;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: ${({ theme }) => theme.black};
    border-color: ${({ theme }) => theme.emperor};
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
  padding: 4px 0;
  font-size: 36px;
  letter-spacing: 1px;
  color: ${({ theme }) => theme.black};
`;

const FavoriteButton = styled.button`
  align-self: flex-start;
  margin-top: 20px;
  padding: 0;
  cursor: pointer;
  background: none;
  border: none;
  outline: none;
  transition: 0.3s;

  &:hover {
    opacity: 0.75;
  }
`;

export const ItemHeader = ({
  hasWriteAccess,
  isTrashItem,
  user,
  members,
  onClickCloseItem,
  onClickRemoveItem,
  onClickEditItem,
  onClickInvite,
  onClickShare,
  onClickRestoreItem,
  onToggleFavorites,
  item: {
    id: itemId,
    lastUpdated,
    invited,
    favorite,
    owner,
    secret: { name },
  },
}) => {
  const avatars = invited.reduce((accumulator, item) => {
    if (!members[item.userId]) {
      return accumulator;
    }

    if (user.id === item.userId && user.id !== owner.id) {
      accumulator.unshift(user);
    } else if (owner.id !== item.userId) {
      accumulator.push(members[item.userId]);
    }

    return accumulator;
  }, []);
  const hasInvited = invited.length > 0;
  const isOwner = user.id === owner.id;

  return (
    <Fragment>
      <Row>
        <UpdatedDate>Last updated {formatDate(lastUpdated)}</UpdatedDate>
        <Row>
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
                REMOTE
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
          {!isTrashItem &&
            isOwner && (
              <InviteButton onClick={onClickInvite} hasInvited={hasInvited}>
                <Icon name="plus" width={14} height={14} isInButton />
              </InviteButton>
            )}
          <StyledAvatarsList avatars={avatars} />
          {!isTrashItem &&
            isOwner && (
              <ShareButton icon="share" color="black" onClick={onClickShare}>
                Share
              </ShareButton>
            )}
        </Row>
      </InviteRow>
    </Fragment>
  );
};
