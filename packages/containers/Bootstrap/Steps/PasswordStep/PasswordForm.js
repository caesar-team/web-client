import React from 'react';
import zxcvbn from 'zxcvbn';
import { Formik, FastField } from 'formik';
import styled from 'styled-components';
import {
  PasswordInput,
  Button,
  Icon,
  Tooltip,
  StrengthIndicator,
  PasswordIndicator,
  TextError,
} from '@caesar/components';
import { checkError } from '@caesar/common/utils/formikUtils';
import { GOOD_PASSWORD_RULES } from '@caesar/common/validation/constants';
import { INDICATOR_TYPE } from '@caesar/components/PasswordIndicator';
import { schema } from './schema';
import { initialValues } from './constants';

const Form = styled.form`
  width: 100%;
  margin-top: 50px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const FieldWrapper = styled.div`
  position: relative;
`;

const StyledPasswordInput = styled(PasswordInput)`
  display: flex;
  border: 1px solid ${({ theme }) => theme.color.lightGray};

  ${PasswordInput.Prefix} {
    position: relative;
    transform: inherit;
    left: inherit;
    top: inherit;
  }
`;

const Prefix = styled.div`
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid ${({ theme }) => theme.color.lightGray};
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 30px;
  margin-bottom: 60px;
`;

const NextButton = styled(Button)`
  width: 100%;
  height: 60px;
  font-size: 18px;
`;

const StyledPasswordIndicator = styled(PasswordIndicator)`
  justify-content: space-between;
  margin-top: 10px;
`;

const StyledStrengthIndicator = styled(StrengthIndicator)`
  font-size: ${({ theme }) => theme.font.size.small};
  color: ${({ theme }) => theme.color.gray};
  padding: 16px;

  ${StrengthIndicator.Text} {
    margin-bottom: 15px;
  }

  ${StrengthIndicator.HelperText} {
    font-size: ${({ theme }) => theme.font.size.small};
    color: ${({ theme }) => theme.color.gray};
    margin-bottom: 8px;

    &:last-of-type {
      margin-bottom: 0;
    }
  }
`;

const PasswordInputPrefix = (
  <Prefix>
    <Icon name="key-diagonal" width={18} height={18} />
  </Prefix>
);

const PasswordForm = ({ onSubmit }) => (
  <Formik
    key="newPassword"
    onSubmit={onSubmit}
    initialValues={initialValues}
    validationSchema={schema}
  >
    {({
      values,
      errors,
      touched,
      handleSubmit,
      handleBlur,
      isSubmitting,
      isValid,
    }) => {
      const showTooltip =
        (values.password && checkError(touched, errors, 'password')) || false;

      return (
        <Form onSubmit={handleSubmit}>
          <Row>
            <FieldWrapper>
              <FastField name="password">
                {({ field }) => (
                  <StyledPasswordInput
                    {...field}
                    onBlur={handleBlur}
                    placeholder="Password"
                    prefix={PasswordInputPrefix}
                  />
                )}
              </FastField>
              <Tooltip
                show={showTooltip}
                textBoxWidth="280px"
                arrowAlign="top"
                position="right center"
              >
                <StyledStrengthIndicator
                  text="Our recommendations for creating a good password:"
                  value={values.password}
                  rules={GOOD_PASSWORD_RULES}
                />
              </Tooltip>
            </FieldWrapper>
            {values.password && (
              <StyledPasswordIndicator
                type={INDICATOR_TYPE.LINE}
                score={zxcvbn(values.password).score}
                withFixWidth
              />
            )}
            {checkError(touched, errors, 'password') && (
              <TextError marginTop={8}>{errors.password}</TextError>
            )}
          </Row>
          <Row>
            <FastField name="confirmPassword">
              {({ field }) => (
                <StyledPasswordInput
                  {...field}
                  onBlur={handleBlur}
                  placeholder="Confirm password"
                  prefix={PasswordInputPrefix}
                />
              )}
            </FastField>
            {checkError(touched, errors, 'confirmPassword') && (
              <TextError marginTop={8}>{errors.confirmPassword}</TextError>
            )}
          </Row>
          <ButtonWrapper>
            <NextButton htmlType="submit" disabled={isSubmitting || !isValid}>
              Next
            </NextButton>
          </ButtonWrapper>
        </Form>
      );
    }}
  </Formik>
);

export default PasswordForm;
