import React from 'react';
import { SCHEMA } from '@caesar/common/validation';
import { Title, Note, Attachments } from '../../ItemFields/view';
import { Row } from '../../ItemFields/common';
import { OwnerAndInvitation } from '../components';

export const Document = ({
  item,
  itemSubject,
  onClickAcceptEdit,
  onClickShare,
  isSharedItem,
}) => {
  const {
    data: { name, note, attachments = [] },
  } = item;

  return (
    <>
      <Title
        value={name}
        itemSubject={itemSubject}
        schema={SCHEMA.REQUIRED_LIMITED_STRING()}
        onClickAcceptEdit={onClickAcceptEdit}
        marginBottom={isSharedItem ? 24 : 0}
      />
      {!isSharedItem && (
        <OwnerAndInvitation
          itemSubject={itemSubject}
          onClickShare={onClickShare}
        />
      )}
      <Row marginBottom={24}>
        <Note
          value={note}
          itemSubject={itemSubject}
          onClickAcceptEdit={onClickAcceptEdit}
        />
      </Row>
      <Row marginBottom={24}>
        <Attachments
          attachments={attachments}
          itemSubject={itemSubject}
          onClickAcceptEdit={onClickAcceptEdit}
        />
      </Row>
    </>
  );
};