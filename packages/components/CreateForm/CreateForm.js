import React from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import styled from 'styled-components';
import { createItemRequest } from '@caesar/common/actions/entities/item';
import { FormByType, FormHeader, FormFooter } from './components';
import { getInitialValues } from './utils';

const Form = styled.form`
  padding: 8px 0 88px;
`;

const StyledFormHeader = styled(FormHeader)`
  margin-bottom: 24px;
`;

export const CreateForm = () => {
  const dispatch = useDispatch();
  const { query } = useRouter();

  const handleCreate = (values, { setSubmitting }) => {
    dispatch(createItemRequest(values, setSubmitting));
  };

  const formik = useFormik({
    initialValues: getInitialValues(query.type, query.listId),
    onSubmit: handleCreate,
  });
  const { values, setFieldValue, handleSubmit } = formik;

  const handleChangePath = (teamId, listId) => {
    if (listId !== values.listId) {
      setFieldValue('listId', listId);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <StyledFormHeader
        teamId={query.teamId}
        listId={query.listId}
        onChangePath={handleChangePath}
      />
      <FormByType type={query.type} formik={formik} />
      <FormFooter onSubmit={handleSubmit} />
    </Form>
  );
};
