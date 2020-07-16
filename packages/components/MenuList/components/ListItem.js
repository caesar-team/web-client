/* eslint-disable camelcase */
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { upperFirst } from '@caesar/common/utils/string';
import { LIST_TYPES_ARRAY } from '@caesar/common/constants';
import {
  createListRequest,
  editListRequest,
} from '@caesar/common/actions/entities/list';
import { Can } from '../../Ability';
import { Icon } from '../../Icon';
import { ListItemInput } from './ListItemInput';
import { ConfirmRemoveListModal } from './ConfirmRemoveListModal';
import { MenuItemInner } from './styledComponents';

const Title = styled.div`
  margin-right: auto;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const Counter = styled.div``;

const StyledIcon = styled(Icon)`
  flex: 0 0 16px;
  margin-left: 16px;
  transition: color 0.2s, opacity 0.2s;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.color.black};
  }
`;

const ItemIcon = styled(StyledIcon)`
  display: none;
`;

const DnDIcon = styled(ItemIcon)`
  position: absolute;
  top: 50%;
  left: 24px;
  margin-left: 0;
  transform: translateY(-50%);
  cursor: grab;
`;

const Wrapper = styled(MenuItemInner)`
  position: relative;
  padding: ${({ isEdit }) => (isEdit ? '0 24px 0 40px' : '7px 24px 7px 56px')};
  color: ${({ isActive, theme }) =>
    isActive ? theme.color.black : theme.color.gray};

  &:hover {
    color: ${({ theme }) => theme.color.black};

    ${Counter} {
      ${({ isDefault }) => !isDefault && `display: none;`}
    }
    ${ItemIcon} {
      display: block;
    }
    ${DnDIcon} {
      display: ${({ isEdit }) => (isEdit ? 'none' : 'block')};
    }
  }
`;

export const ListItem = ({
  item = {},
  activeListId,
  index,
  handleClickMenuItem = Function.prototype,
  isCreatingMode,
  notification,
  setCreatingMode,
}) => {
  const dispatch = useDispatch();
  const { id, label, children = [] } = item;
  console.log('item: ', item);
  const isDefault = label === 'default';
  const [isEditMode, setEditMode] = useState(isCreatingMode);
  const [isOpenedPopup, setOpenedPopup] = useState(false);
  const [value, setValue] = useState(label);

  const handleClickEdit = () => {
    setEditMode(true);
  };

  const handleClickRemove = () => {
    setOpenedPopup(true);
  };

  const handleClickAcceptEdit = () => {
    if (isCreatingMode) {
      dispatch(
        createListRequest({ label: value }, { notification, setCreatingMode }),
      );
    } else {
      dispatch(
        editListRequest(
          { ...item, label: value },
          { notification, setEditMode },
        ),
      );
    }
  };

  const handleClickClose = () => {
    if (isCreatingMode) {
      setCreatingMode(false);
    }

    setEditMode(false);
    setValue(label);
  };

  const itemTitle = LIST_TYPES_ARRAY.includes(label)
    ? upperFirst(label)
    : label;

  const caslSubject = {
    __typename: 'list',
    edit_list: !!item?._links?.edit_list,
    sort_list: !!item?._links?.sort_list,
    delete_list: !!item?._links?.delete_list,
  };

  const renderInner = () => (
    <>
      {isEditMode ? (
        <ListItemInput
          isEditMode={isEditMode}
          setEditMode={setEditMode}
          isCreatingMode={isCreatingMode}
          setCreatingMode={setCreatingMode}
          value={value}
          setValue={setValue}
          label={label}
          onClickAcceptEdit={handleClickAcceptEdit}
          onClickClose={handleClickClose}
        />
      ) : (
        <>
          <Can I="sort" a={caslSubject}>
            <DnDIcon name="drag-n-drop" width={16} height={16} color="gray" />
          </Can>
          <Title>{itemTitle}</Title>
          <Counter>{children.length}</Counter>
          <Can I="edit" a={caslSubject}>
            <ItemIcon
              name="pencil"
              width={16}
              height={16}
              color="gray"
              onClick={handleClickEdit}
            />
          </Can>
          <Can I="delete" a={caslSubject}>
            <ItemIcon
              name="trash"
              width={16}
              height={16}
              color="gray"
              onClick={handleClickRemove}
            />
          </Can>
        </>
      )}
      <DnDIcon name="drag-n-drop" width={16} height={16} color="gray" />
    </>
  );

  return isCreatingMode ? (
    <Wrapper
      isActive={activeListId === id && !isEditMode}
      onClick={() => handleClickMenuItem(id)}
      isEdit={isEditMode}
      isDefault={isDefault}
    >
      {renderInner()}
    </Wrapper>
  ) : (
    <>
      <Draggable
        key={id}
        draggableId={id}
        index={index}
        isDragDisabled={isEditMode}
      >
        {provided => (
          <Wrapper
            isActive={activeListId === id && !isEditMode}
            onClick={() => handleClickMenuItem(id)}
            isEdit={isEditMode}
            isDefault={isDefault}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            {renderInner()}
          </Wrapper>
        )}
      </Draggable>
      <ConfirmRemoveListModal
        item={item}
        isOpenedPopup={isOpenedPopup}
        setOpenedPopup={setOpenedPopup}
      />
    </>
  );
};
