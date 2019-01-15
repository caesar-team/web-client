import React, { Component } from 'react';
import styled from 'styled-components';
import { Formik, FastField } from 'formik';
import { Modal, FormInput, Button, Label } from 'components';
import { checkError } from 'common/utils/formikUtils';
import { schema } from './schema';

const FormTitle = styled.div`
  padding-bottom: 25px;
  text-align: center;
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.black};
  text-transform: uppercase;
`;

const ButtonWrapper = styled.div`
  margin-top: 40px;
  display: flex;
  justify-content: center;
`;

class ListFormModal extends Component {
  createInitialValue = list => ({ label: list.label });

  render() {
    const {
      list,
      onCancel = Function.prototype,
      onCreate = Function.prototype,
    } = this.props;

    return (
      <Modal
        isOpen
        shouldCloseOnEsc
        shouldCloseOnOverlayClick
        minWidth="560"
        onRequestClose={onCancel}
      >
        <FormTitle>Add list </FormTitle>
        <Formik
          key="editListForm"
          initialValues={this.createInitialValue(list)}
          onSubmit={onCreate}
          isInitialValid={schema.isValidSync(this.createInitialValue(list))}
          validationSchema={schema}
          render={({
            errors,
            touched,
            handleSubmit,
            isSubmitting,
            isValid,
          }) => (
            <form onSubmit={handleSubmit}>
              <Label>Name</Label>
              <FastField
                name="label"
                render={({ field }) => (
                  <FormInput
                    {...field}
                    error={checkError(touched, errors, 'label')}
                  />
                )}
              />
              <ButtonWrapper>
                <Button
                  disabled={isSubmitting || !isValid}
                  color="black"
                  onClick={handleSubmit}
                >
                  CREATE
                </Button>
              </ButtonWrapper>
            </form>
          )}
        />
      </Modal>
    );
  }
}

export default ListFormModal;
