import Cookies from 'js-cookie';
import Fingerprint2 from 'fingerprintjs2';
import { isServer } from './isEnvironment';

export function setToken(token, path = '/') {
  return Cookies.set('token', token, { path });
}

export function getToken() {
  return Cookies.get('token', { path: '/' });
}

export function removeToken() {
  return Cookies.remove('token', { path: '/' });
}

const generateFingerPrint = () => {
  let token = '';
  if (window.requestIdleCallback) {
    return new Promise(resolve =>
      requestIdleCallback(() => {
        Fingerprint2.get(components => {
          const values = components.map(component => component.value);
          token = Fingerprint2.x64hash128(values.join(''), 99);
          resolve(token);
        });
      }),
    );
  }

  return new Promise(resolve =>
    setTimeout(() => {
      Fingerprint2.get(components => {
        const values = components.map(component => component.value);
        token = Fingerprint2.x64hash128(values.join(''), 99);
        resolve(token);
      });
    }, 500),
  );
};

export const getTrustedDeviceToken = generate => {
  if (isServer) return null;

  const token = window.localStorage.getItem('trustedDevice');

  if (!token && generate) {
    return new Promise(resolve => {
      generateFingerPrint().then(data => {
        window.localStorage.setItem('trustedDevice', data);
        resolve(data);
      });
    });
  }

  return token;
};
