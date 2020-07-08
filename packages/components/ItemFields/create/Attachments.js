import React from 'react';
import styled from 'styled-components';
import { downloadFile } from '@caesar/common/utils/file';
import { Uploader } from '../../Uploader';
import { File } from '../../File';
import { TexError } from '../../Error';

const Title = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-weight: 600;
`;

const FileRow = styled.div`
  &[disabled] {
    pointer-events: none;
  }
`;

const StyledUploader = styled(Uploader)`
  padding: 24px 5px;
`;

const AttachmentsRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr);
  grid-gap: 24px;
  padding-top: 8px;
`;

const handleClickDownloadFile = attachment => {
  const { raw, name } = attachment;

  downloadFile(raw, name);
};

const checkAttachmentsError = (errors, index) =>
  errors[index] && errors[index].raw;

const renderAttachments = (
  attachments = [],
  errors = [],
  setFieldValue,
  isSubmitting,
) =>
  attachments.map((attachment, index) => (
    <FileRow key={index} disabled={isSubmitting}>
      <File
        key={index}
        status={checkAttachmentsError(errors, index) ? 'error' : 'uploaded'}
        onClickDownload={() => handleClickDownloadFile(attachment)}
        onClickRemove={() =>
          setFieldValue(
            'attachments',
            attachments.filter((_, fileIndex) => index !== fileIndex),
          )
        }
        {...attachment}
      />
      {checkAttachmentsError(errors, index) && (
        <TexError>{errors[index].raw}</TexError>
      )}
    </FileRow>
  ));

export const Attachments = ({ value, error, setFieldValue }) => {
  return (
    <>
      <Title>Attachments</Title>
      <StyledUploader
        multiple
        asPreview
        name="attachments"
        files={value}
        error={typeof error === 'string' ? error : ''}
        onChange={setFieldValue}
        // disabled={isSubmitting}
      />
      <AttachmentsRow>
        {renderAttachments(
          value,
          error,
          setFieldValue,
          // isSubmitting,
        )}
      </AttachmentsRow>
    </>
  );
};
