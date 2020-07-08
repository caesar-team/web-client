import { APP_URI } from '@caesar/common/constants';
import { objectToBase64 } from '@caesar/common/utils/base64';
import {
  DAY,
  HALF_DAY,
  ONE_HOUR,
  ONE_MINUTE,
  ONE_SIXTH_HOUR,
} from './constants';

export const getSecureMessageText = (
  messageId,
  password,
  seconds,
  isPasswordLess = false,
) => `Please, follow the link and enter the password
- - - - - - - - - - - - - - - - - - - - - - - - - -
URL: <strong>${generateMessageLink(
  messageId,
  password,
  isPasswordLess,
)}</strong>${
  !isPasswordLess ? `\nPassword: <strong>${encodeURI(password)}</strong>` : ``
}
Expire within: <strong>${getExpireDate(seconds)}</strong>
- - - - - - - - - - - - - - - - - - - - - - - - - -
Securely created with ${APP_URI}`;

export const pluralizeWord = (count, noun, suffix = 's') =>
  `${count} ${noun}${count !== 1 ? suffix : ''}`;

export const stripHtml = html => {
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;

  return tmp.textContent || tmp.innerText || '';
};

export const makePasswordlessLink = (messageId, password) => {
  const encodedObject = objectToBase64({
    messageId,
    password,
  });

  return `${APP_URI}/message/${encodedObject}`;
};

export const makeMessageLink = messageId => {
  return `${APP_URI}/message/${messageId}`;
};

export const getExpireDate = seconds => {
  switch (seconds) {
    case ONE_SIXTH_HOUR:
      return pluralizeWord(seconds / ONE_MINUTE, 'minute', 's');
    case ONE_HOUR:
      return pluralizeWord(seconds / ONE_HOUR, 'hour', 's');
    case HALF_DAY:
      return pluralizeWord(seconds / ONE_HOUR, 'hour', 's');
    case DAY:
      return pluralizeWord(seconds / DAY, 'day', 's');
    default:
      return pluralizeWord(seconds / ONE_HOUR, 'hour');
  }
};
export const generateMessageLink = (
  messageId,
  password,
  isPasswordLess = false,
) =>
  isPasswordLess
    ? makePasswordlessLink(messageId, password)
    : makeMessageLink(messageId);