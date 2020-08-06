import React, { useState, Fragment } from 'react';
import styled from 'styled-components';
import { media } from '@caesar/assets/styles/media';
import { match } from '@caesar/common/utils/match';
import { logger } from '@caesar/common/utils/logger';
import { postSecureMessage } from '@caesar/common/fetch';
import { encryptSecret } from '@caesar/common/utils/secret';
import {
  ENCRYPTING_ITEM_NOTIFICATION,
  SAVE_NOTIFICATION,
  DEFAULT_ERROR_MESSAGE,
} from '@caesar/common/constants';

import { passwordGenerator } from '@caesar/common/utils/passwordGenerator';
import { Scrollbar, withNotification } from '@caesar/components';
import { SecureMessageForm } from './SecureMessageForm';
import { SecureMessageLink } from './SecureMessageLink';
import {
  SECURE_MESSAGE_FORM_STEP,
  SECURE_MESSAGE_LINK_STEP,
} from './constants';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: calc(100vh - 150px);
  padding: 38px 0;

  ${media.desktop`
    padding: 22px 0;
  `}

  ${media.mobile`
    padding: 16px 0;
  `}
`;

const defaultState = {
  step: SECURE_MESSAGE_FORM_STEP,
  password: null,
  messageId: null,
  seconds: null,
  requests: null,
};

const SecureMessageComponent = ({
  notification,
  withScroll = false,
  className,
}) => {
  const [{ step, password, messageId, seconds, requests }, setState] = useState(
    defaultState,
  );

  const handleSubmitForm = (
    { secondsLimit, requestsLimit, password: passwordValue, ...secret },
    { setSubmitting, setFieldError },
  ) => {
    const submit = async () => {
      setFieldError('form', '');

      try {
        notification.show({
          text: ENCRYPTING_ITEM_NOTIFICATION,
          options: {
            position: 'bottom-right',
          },
        });
        const pwd = passwordValue || passwordGenerator();
        const encryptedData = await encryptSecret(secret);

        notification.show({
          text: SAVE_NOTIFICATION,
          options: {
            position: 'bottom-right',
          },
        });

        postSecureMessage({
          ...encryptedData,
          secondsLimit,
          requestsLimit,
        })
          .then(({ id }) => {
            setSubmitting(false);
            if (!id) {
              setFieldError('form', DEFAULT_ERROR_MESSAGE);
              notification.hide();

              return false;
            }
            setState({
              step: SECURE_MESSAGE_LINK_STEP,
              password: pwd,
              seconds: secondsLimit,
              requests: requestsLimit,
              messageId: id,
            });
          })
          .catch(error => {
            logger.error('Error: %o', error);
          });
      } catch (error) {
        logger.error(error);
        setFieldError('form', error.message);
        notification.hide();
        setSubmitting(false);
      }
    };

    submit().then();
  };

  const handleClickReturn = () => {
    setState({
      step: SECURE_MESSAGE_FORM_STEP,
      password: null,
      link: null,
      seconds: null,
      requests: null,
    });
  };

  const renderedStep = match(
    step,
    {
      SECURE_MESSAGE_FORM_STEP: (
        <SecureMessageForm onSubmit={handleSubmitForm} />
      ),
      SECURE_MESSAGE_LINK_STEP: (
        <SecureMessageLink
          messageId={messageId}
          password={password}
          seconds={seconds}
          requests={requests}
          onClickReturn={handleClickReturn}
        />
      ),
    },
    null,
  );

  const ContentWrapperComponent = withScroll ? Scrollbar : Fragment;

  return (
    <Wrapper className={className}>
      <ContentWrapperComponent>{renderedStep}</ContentWrapperComponent>
    </Wrapper>
  );
};

export const SecureMessage = withNotification(SecureMessageComponent);
