import React, { memo, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { currentTeamSelector } from '@caesar/common/selectors/user';
import {
  personalListsByTypeSelector,
  currentTeamListsSelector,
} from '@caesar/common/selectors/entities/list';
import { Icon } from '../Icon';

const ListAddIcon = styled(Icon)`
  margin-right: 16px;
  margin-left: auto;
  transform: ${({ isListsOpened }) =>
    isListsOpened ? 'scaleY(-1)' : 'scaleY(1)'};
  transition: transform 0.2s;
  opacity: 0;
  transition: opacity 0.2s, color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.color.black};
  }
`;

const MenuItem = styled.div``;

const MenuItemInner = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 7px 24px;
  font-weight: ${({ fontWeight, isActive }) =>
    isActive ? 600 : fontWeight || 400};
  color: ${({ isActive, theme }) =>
    isActive ? theme.color.black : theme.color.emperor};
  background-color: ${({ isActive, theme }) =>
    isActive ? theme.color.snow : theme.color.white};
  cursor: pointer;
  transition: all 0.2s;
  border-top: 1px solid transparent;
  border-bottom: 1px solid transparent;
  ${({ isActive, theme }) =>
    isActive &&
    `
      border-top-color: ${theme.color.gallery};
      border-bottom-color: ${theme.color.gallery};
    `}

  &:hover {
    background-color: ${({ withChildren, theme }) =>
      !withChildren && theme.color.snow};
    border-top-color: ${({ withChildren, theme }) =>
      !withChildren && theme.color.gallery};
    border-bottom-color: ${({ withChildren, theme }) =>
      !withChildren && theme.color.gallery};

    ${ListAddIcon} {
      opacity: 1;
    }
  }
`;

const MenuItemTitle = styled.div`
  padding-left: ${({ withIcon }) => (withIcon ? '16px' : '0')};
`;

const ListToggleIcon = styled(Icon)`
  transform: ${({ isListsOpened }) =>
    isListsOpened ? 'scaleY(-1)' : 'scaleY(1)'};
  transition: transform 0.2s;
`;

const ListItem = styled(MenuItemInner)`
  padding: 7px 24px 7px 56px;
`;

const SECURE_MESSAGE_MODE = 'SECURE_MESSAGE_MODE';

const MenuListInnerComponent = ({
  activeListId,
  onClickMenuItem,
  mode,
  onClickSecureMessage,
}) => {
  const currentTeam = useSelector(currentTeamSelector);
  const isPersonal = !currentTeam;
  const personalLists = useSelector(personalListsByTypeSelector);
  const teamLists = useSelector(currentTeamListsSelector);
  const [isListsOpened, setIsListsOpened] = useState(false);

  const menuList = [
    {
      id: isPersonal ? personalLists.inbox?.id : '',
      title: 'Inbox',
      icon: 'inbox',
    },
    {
      id: isPersonal ? personalLists.favorites?.id : teamLists.favorites?.id,
      title: 'Favorites',
      icon: 'favorite',
    },
    {
      id: 'lists',
      title: 'Lists',
      icon: 'list',
      children: isPersonal ? personalLists.list : teamLists.list,
    },
    // TODO: Implement History feature
    // {
    //   id: 'history',
    //   title: 'History',
    //   icon: 'history',
    // },
    {
      id: isPersonal ? personalLists.trash?.id : teamLists.trash?.id,
      title: 'Trash',
      icon: 'trash',
    },
    {
      id: SECURE_MESSAGE_MODE,
      title: 'Secure Message',
      icon: 'lock-filled',
    },
  ];

  return menuList.map(
    ({ id, icon, title, children }) =>
      id && (
        <MenuItem key={id || title}>
          <MenuItemInner
            isActive={
              id === SECURE_MESSAGE_MODE
                ? mode === SECURE_MESSAGE_MODE
                : activeListId === id
            }
            fontWeight={id === SECURE_MESSAGE_MODE ? 600 : 400}
            withChildren={children}
            onClick={() => {
              if (id === SECURE_MESSAGE_MODE) {
                return onClickSecureMessage();
              }

              return children
                ? setIsListsOpened(!isListsOpened)
                : onClickMenuItem(id);
            }}
          >
            <Icon name={icon} width={16} height={16} />
            <MenuItemTitle withIcon>{title}</MenuItemTitle>
            {children && (
              <>
                <ListAddIcon name="plus" width={16} height={16} />
                <ListToggleIcon
                  name="arrow-triangle"
                  width={16}
                  height={16}
                  isListsOpened={isListsOpened}
                />
              </>
            )}
          </MenuItemInner>
          {isListsOpened &&
            children?.map(({ id: listId, label }) => (
              <ListItem key={listId} onClick={() => onClickMenuItem(listId)}>
                {label}
              </ListItem>
            ))}
        </MenuItem>
      ),
  );
};

export const MenuListInner = memo(MenuListInnerComponent);
