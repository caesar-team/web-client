import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { useFormik } from 'formik';
import { teamSelector } from '@caesar/common/selectors/entities/team';
import { Modal, FormInput, Button, Label } from '@caesar/components';
import { checkError } from '@caesar/common/utils/formikUtils';
import { getTeamTitle } from '@caesar/common/utils/team';
import { TEAM_TYPE } from '@caesar/common/constants';
import { TextError as Error } from '../Error';
import { renderTeamAvatars } from './renderTeamAvatars';
import { getValidationSchema } from './schema';

const FormTitle = styled.div`
  padding-bottom: 24px;
  text-align: center;
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.color.black};
  text-transform: uppercase;
`;

const DefaultTeamTitle = styled.div`
  margin-top: 4px;
`;

const GroupAvatarsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`;

const GroupAvatarsTitle = styled.div`
  font-size: 18px;
  color: ${({ theme }) => theme.color.emperor};
`;

const GroupAvatarsTip = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.color.gray};
`;

const ButtonWrapper = styled.div`
  margin-top: 40px;
  display: flex;
  justify-content: center;
`;

const getInitialValues = team => ({
  title: team?.title || '',
  icon: { raw: team?.icon || null },
});

const TeamModal = ({
  teamId,
  teams,
  onCreateSubmit,
  onEditSubmit,
  onCancel = Function.prototype,
}) => {
  const team = useSelector(state => teamSelector(state, { teamId })) || null;
  const {
    dirty,
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldTouched,
  } = useFormik({
    initialValues: getInitialValues(team),
    onSubmit: ({ title, icon }, { setErrors, setSubmitting }) =>
      teamId
        ? onEditSubmit({
            teamId,
            title,
            icon: icon.raw,
            setSubmitting,
            setErrors,
          })
        : onCreateSubmit({ title, icon: icon.raw, setSubmitting, setErrors }),
    validationSchema: getValidationSchema(
      teams.filter(({ id }) => id !== teamId).map(item => item.title),
    ),
  });

  const handleChangeTitle = e => {
    setFieldValue('title', e.target.value, true);
    setFieldTouched('title');
  };

  return (
    <Modal
      isOpened
      shouldCloseOnEsc
      shouldCloseOnOverlayClick
      width="560"
      onRequestClose={onCancel}
    >
      <FormTitle>{teamId ? 'Edit' : 'Add'} team</FormTitle>
      <form onSubmit={handleSubmit}>
        <Label>Name</Label>
        {team.type === TEAM_TYPE.DEFAULT ? (
          <DefaultTeamTitle>{getTeamTitle(team)}</DefaultTeamTitle>
        ) : (
          <FormInput
            name="title"
            value={values.title}
            autoFocus
            withBorder
            error={checkError(touched, errors, 'title')}
            onChange={handleChangeTitle}
            onBlur={handleBlur}
          />
        )}
        <GroupAvatarsWrapper>
          <GroupAvatarsTitle>Avatar</GroupAvatarsTitle>
          <GroupAvatarsTip>
            Choose an avatar or upload (160x160 pixels, not more than 8 MB)
          </GroupAvatarsTip>
          {renderTeamAvatars({
            touched,
            values,
            errors,
            setFieldValue,
            setFieldTouched,
          })}
        </GroupAvatarsWrapper>
        {typeof errors?.form === 'string' ? (
          <Error>{errors?.form}</Error>
        ) : (
          errors?.form?.map(error => <Error key={error}>{error}</Error>)
        )}
        <ButtonWrapper>
          <Button
            disabled={!dirty || isSubmitting || !isValid}
            color="black"
            onClick={handleSubmit}
          >
            {teamId ? 'Edit' : 'Create'}
          </Button>
        </ButtonWrapper>
      </form>
    </Modal>
  );
};

export default TeamModal;
