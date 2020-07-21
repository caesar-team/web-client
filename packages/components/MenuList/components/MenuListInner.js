import React, { memo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import {
  DASHBOARD_MODE,
  PERMISSION,
  PERMISSION_ENTITY,
} from '@caesar/common/constants';
import {
  userDataSelector,
  currentTeamSelector,
} from '@caesar/common/selectors/user';
import {
  personalListsByTypeSelector,
  currentTeamListsSelector,
} from '@caesar/common/selectors/entities/list';
import { workInProgressListSelector } from '@caesar/common/selectors/workflow';
import {
  setWorkInProgressItem,
  setWorkInProgressListId,
  resetWorkInProgressItemIds,
} from '@caesar/common/actions/workflow';
import { sortListRequest } from '@caesar/common/actions/entities/list';
import { withNotification } from '@caesar/components/Notification';
import { Can } from '../../Ability';
import { Icon } from '../../Icon';
import { Scrollbar } from '../../Scrollbar';
import { ListItem } from './ListItem';
import { MenuItemInner } from './styledComponents';

const MenuItem = styled.div``;

const MenuItemTitle = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
  padding-left: 16px;
  margin-right: auto;
`;

const MenuItemCounter = styled.span`
  margin-left: auto;
`;

const ListAddIcon = styled(Icon)`
  margin-right: 16px;
  transform: ${({ isListsOpened }) =>
    isListsOpened ? 'scaleY(-1)' : 'scaleY(1)'};
  transition: transform 0.2s;
  opacity: 0;
  transition: opacity 0.2s, color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.color.black};
  }
`;

const StyledMenuItemInner = styled(MenuItemInner)`
  &:hover {
    background-color: ${({ withChildren, isEdit, theme }) =>
      !withChildren && !isEdit && theme.color.snow};
    border-top-color: ${({ withChildren, isEdit, theme }) =>
      !withChildren && !isEdit && theme.color.gallery};
    border-bottom-color: ${({ withChildren, isEdit, theme }) =>
      !withChildren && !isEdit && theme.color.gallery};

    ${ListAddIcon} {
      opacity: 1;
    }
  }
`;

const ListToggleIcon = styled(Icon)`
  transform: ${({ isListsOpened }) =>
    isListsOpened ? 'scaleY(-1)' : 'scaleY(1)'};
  transition: transform 0.2s;
`;

const SECURE_MESSAGE_MODE = 'SECURE_MESSAGE_MODE';

const MenuListInnerComponent = ({
  mode,
  setSearchedText,
  setMode,
  isListsOpened,
  setListsOpened,
  notification,
}) => {
  const dispatch = useDispatch();
  const user = useSelector(userDataSelector);
  const currentTeam = useSelector(currentTeamSelector);
  const isPersonal = !currentTeam;
  const personalLists = useSelector(personalListsByTypeSelector);
  const teamLists = useSelector(currentTeamListsSelector);
  const workInProgressList = useSelector(workInProgressListSelector);
  const activeListId = workInProgressList && workInProgressList.id;
  const [isCreatingMode, setCreatingMode] = useState(false);

  const handleClickMenuItem = id => {
    dispatch(setWorkInProgressListId(id));
    dispatch(setWorkInProgressItem(null));
    dispatch(resetWorkInProgressItemIds());

    setMode(DASHBOARD_MODE.DEFAULT);
    setSearchedText('');
  };

  const handleClickSecureMessage = () => {
    dispatch(setWorkInProgressListId(null));

    setMode(DASHBOARD_MODE.TOOL);
    setSearchedText('');
  };

  const handleClickAddList = event => {
    event.stopPropagation();
    setListsOpened(true);
    setCreatingMode(true);
  };

  const handleDragEnd = ({ draggableId, source, destination }) => {
    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    dispatch(sortListRequest(draggableId, source.index, destination.index));
  };

  const menuList = [
    {
      id: isPersonal ? personalLists.inbox?.id : null,
      title: 'Inbox',
      length: isPersonal ? personalLists.inbox?.children?.length : null,
      icon: 'inbox',
    },
    {
      id: isPersonal ? personalLists.favorites?.id : teamLists.favorites?.id,
      title: 'Favorites',
      length: isPersonal ? personalLists.favorites?.children?.length : null,
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
      length: isPersonal ? personalLists.trash?.children?.length : null,
      icon: 'trash',
    },
    {
      id: SECURE_MESSAGE_MODE,
      title: 'Secure Message',
      icon: 'lock-filled',
    },
  ];

  const listSubject = currentTeam
    ? {
        __typename: PERMISSION_ENTITY.TEAM_LIST,
        // eslint-disable-next-line camelcase
        team_create_list: !!currentTeam._links?.team_create_list,
      }
    : {
        __typename: PERMISSION_ENTITY.LIST,
        // eslint-disable-next-line camelcase
        create_list: !!user?._links?.create_list,
      };

  return (
    <Scrollbar>
      {menuList.map(({ id, icon, title, length, children }) => {
        const withChildren = id === 'lists';

        return (
          id && (
            <MenuItem key={id}>
              <StyledMenuItemInner
                isActive={
                  id === SECURE_MESSAGE_MODE
                    ? mode === SECURE_MESSAGE_MODE
                    : activeListId === id
                }
                fontWeight={id === SECURE_MESSAGE_MODE ? 600 : 400}
                withChildren={withChildren}
                onClick={() => {
                  if (id === SECURE_MESSAGE_MODE) {
                    return handleClickSecureMessage();
                  }

                  return withChildren
                    ? setListsOpened(!isListsOpened)
                    : handleClickMenuItem(id);
                }}
              >
                <Icon name={icon} width={16} height={16} />
                <MenuItemTitle>
                  {title}
                  {typeof length === 'number' && (
                    <MenuItemCounter>{length}</MenuItemCounter>
                  )}
                </MenuItemTitle>
                {withChildren && (
                  <>
                    <Can I={PERMISSION.CREATE} a={listSubject}>
                      <ListAddIcon
                        name="plus"
                        width={16}
                        height={16}
                        onClick={handleClickAddList}
                      />
                    </Can>
                    <ListToggleIcon
                      name="arrow-triangle"
                      width={16}
                      height={16}
                      isListsOpened={isListsOpened}
                    />
                  </>
                )}
              </StyledMenuItemInner>
              {isListsOpened && (
                <>
                  {id === 'lists' && isCreatingMode && (
                    <ListItem
                      isCreatingMode={isCreatingMode}
                      setCreatingMode={setCreatingMode}
                      notification={notification}
                    />
                  )}
                  {children &&
                    (children.length <= 1 ? (
                      children.map((list, index) => (
                        <ListItem
                          key={list.id}
                          list={list}
                          activeListId={activeListId}
                          index={index}
                          notification={notification}
                          onClickMenuItem={handleClickMenuItem}
                        />
                      ))
                    ) : (
                      <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable
                          droppableId="droppable"
                          type="lists"
                          key={children.length}
                        >
                          {provided => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                            >
                              {children.map((list, index) => (
                                <ListItem
                                  key={list.id}
                                  list={list}
                                  activeListId={activeListId}
                                  index={index}
                                  isDraggable
                                  notification={notification}
                                  onClickMenuItem={handleClickMenuItem}
                                />
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </DragDropContext>
                    ))}
                </>
              )}
            </MenuItem>
          )
        );
      })}
    </Scrollbar>
  );
};

export const MenuListInner = memo(withNotification(MenuListInnerComponent));
