import React, { PureComponent, Fragment } from 'react';
import styled from 'styled-components';
import { Formik, FastField } from 'formik';
import zxcvbn from 'zxcvbn';
import { checkError } from 'common/utils/formikUtils';
import {
  Head,
  AuthTitle,
  AuthDescription,
  MasterPasswordInput,
  Link,
  Button,
  PasswordIndicator,
  Icon,
  Tooltip,
  StrengthIndicator,
} from 'components';
import { passwordSchema } from './schema';
import { REGEXP_TEXT_MATCH } from '../../constants';
import { initialMasterPasswordValues } from './constants';
import { TooltipPasswordGenerator } from './components';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

const TipText = styled.div`
  font-size: 14px;
  line-height: 1.5;
  letter-spacing: 0.4px;
  text-align: center;
  margin-top: 20px;
`;

const PasswordGeneratorWrapper = styled.div`
  position: absolute;
  right: 60px;
  top: 18px;
  height: 20px;
`;

const PasswordGeneratorTooltipWrapper = styled.div`
  position: relative;
`;

const PasswordIndicatorStyled = styled(PasswordIndicator)`
  margin-top: 20px;
`;

const StrengthIndicatorStyled = styled(StrengthIndicator)`
  font-size: 14px;
  letter-spacing: 0.4px;
  color: ${({ theme }) => theme.gray};
  padding: 15px;

  ${StrengthIndicator.Text} {
    margin-bottom: 15px;
  }

  ${StrengthIndicator.HelperText} {
    font-size: 14px;
    letter-spacing: 0.4px;
    color: ${({ theme }) => theme.gray};
    margin-bottom: 8px;
  }
`;

const StyledButton = styled(Button)`
  width: 100%;
  height: 60px;
  font-size: 18px;
  margin-top: 45px;
`;

const BottomWrapper = styled.div`
  margin-top: 40px;
  text-align: center;
  font-size: 18px;
  letter-spacing: 0.6px;
  color: ${({ theme }) => theme.gray};
`;

const DiceIcon = styled(Icon)`
  cursor: pointer;
`;

class MasterPasswordCreateForm extends PureComponent {
  state = this.prepareInitialState();

  handleToggleVisibility = changedVisibility => () => {
    this.setState({
      isPasswordGeneratorTooltipVisible: changedVisibility,
    });
  };

  handleGeneratePassword = setFieldValue => password =>
    setFieldValue('password', password);

  prepareInitialState() {
    return {
      isPasswordGeneratorTooltipVisible: false,
    };
  }

  render() {
    const { onSubmit } = this.props;
    const { isPasswordGeneratorTooltipVisible } = this.state;

    return (
      <Formik
        key="password"
        initialValues={initialMasterPasswordValues}
        isInitialValid={passwordSchema.isValidSync(initialMasterPasswordValues)}
        validationSchema={passwordSchema}
        onSubmit={onSubmit}
        render={({
          errors,
          touched,
          handleSubmit,
          isSubmitting,
          isValid,
          dirty,
          setFieldValue,
        }) => (
          <Form onSubmit={handleSubmit}>
            <Head title="Create master password for Caesar" />
            <AuthTitle>Master Password</AuthTitle>
            <AuthDescription>Create master password for Caesar</AuthDescription>
            <FieldWrapper>
              <FastField
                name="password"
                render={({ field, form: { isValid: isFieldValid } }) => (
                  <Fragment>
                    <MasterPasswordInput
                      {...field}
                      isAlwaysVisibleIcon
                      placeholder="Type password…"
                      autoFocus
                      error={
                        dirty ? checkError(touched, errors, 'password') : null
                      }
                    />
                    {field.value && (
                      <PasswordIndicatorStyled
                        score={zxcvbn(field.value).score}
                      />
                    )}
                    <Tooltip
                      show={field.value && !isFieldValid}
                      arrowAlign="bottom"
                      position="right center"
                      textBoxWidth="280px"
                      moveUp="16px"
                    >
                      <StrengthIndicatorStyled
                        text="Our recommendations for creating a good master password:"
                        value={field.value}
                        rules={REGEXP_TEXT_MATCH}
                      />
                    </Tooltip>
                  </Fragment>
                )}
              />
              <PasswordGeneratorWrapper>
                <DiceIcon
                  name="dice"
                  width={20}
                  height={20}
                  onClick={this.handleToggleVisibility(true)}
                />
                <PasswordGeneratorTooltipWrapper>
                  <TooltipPasswordGenerator
                    isVisible={isPasswordGeneratorTooltipVisible}
                    onToggleVisibility={this.handleToggleVisibility(false)}
                    onGeneratePassword={this.handleGeneratePassword(
                      setFieldValue,
                    )}
                  />
                </PasswordGeneratorTooltipWrapper>
              </PasswordGeneratorWrapper>
            </FieldWrapper>
            <TipText>
              Please copy & save the master password in a safe place. Relogin
              will not be possible without this password.
            </TipText>
            <StyledButton htmlType="submit" disabled={isSubmitting || !isValid}>
              Continue
            </StyledButton>
            <BottomWrapper>
              or <Link to="/logout">log out</Link>
            </BottomWrapper>
          </Form>
        )}
      />
    );
  }
}

export default MasterPasswordCreateForm;
