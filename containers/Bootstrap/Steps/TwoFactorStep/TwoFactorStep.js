import React, { Component } from 'react';
import {
  getQrCode,
  postActivateTwoFactor,
  postCheckTwoFactor,
} from 'common/api';
import { getTrustedDeviceToken, setToken } from 'common/utils/token';
import { matchStrict } from 'common/utils/match';
import {
  TWO_FACTOR_BACKUPS,
  TWO_FACTOR_CHECK,
  TWO_FACTOR_CREATE,
} from '../../constants';
import TwoFactorCreateForm from './TwoFactorCreateForm';
import TwoFactorCheckForm from './TwoFactorCheckForm';
import TwoFactorBackupForm from './TwoFactorBackupForm';

class TwoFactorStep extends Component {
  state = this.prepareInitialState();

  async componentDidMount() {
    const { initialStep } = this.props;

    if (initialStep === TWO_FACTOR_CREATE) {
      const {
        data: { qr, code },
      } = await getQrCode();

      this.setState({
        qr,
        code,
      });
    }
  }

  handleClickReturn = () => {
    this.setState({
      step: TWO_FACTOR_CREATE,
    });
  };

  handleClickNext = () => {
    this.setState({
      step: TWO_FACTOR_CHECK,
    });
  };

  handleSubmit = async ({ code, fpCheck }, { setSubmitting, setErrors }) => {
    const { initialStep, onFinish } = this.props;

    const isCreateFlow = initialStep === TWO_FACTOR_CREATE;

    const post = { authCode: code };

    if (fpCheck) {
      post.fingerprint = await getTrustedDeviceToken(true);
    }

    if (isCreateFlow) {
      post.secret = this.state.code;
    }

    const action = isCreateFlow ? postActivateTwoFactor : postCheckTwoFactor;

    try {
      const {
        data: { token },
      } = await action(post);

      if (token) {
        setToken(token);
      }

      // eslint-disable-next-line
      isCreateFlow
        ? this.setState({
            step: TWO_FACTOR_BACKUPS,
          })
        : onFinish();
    } catch (error) {
      setErrors({ code: 'Wrong code' });
      setSubmitting(false);
    }
  };

  handleClickSaveBackups = () => {
    const { onFinish } = this.props;

    onFinish();
  };

  prepareInitialState() {
    const { initialStep } = this.props;

    return {
      step: initialStep,
      code: '',
      qr: '',
    };
  }

  render() {
    const { qr, code, step } = this.state;
    const { initialStep } = this.props;

    const allowReturn = initialStep === TWO_FACTOR_CREATE;

    const CODES = [
      '534684',
      '987984',
      '123123',
      '123123',
      '123123',
      '123123',
      '123123',
      '123123',
      '123123',
      '123123',
      '123123',
      '123123',
      '123123',
      '123123',
      '123123',
      '123123',
      '123123',
      '123123',
      '123123',
    ];

    return matchStrict(
      step,
      {
        [TWO_FACTOR_CREATE]: (
          <TwoFactorCreateForm
            qr={qr}
            code={code}
            onClickNext={this.handleClickNext}
          />
        ),
        [TWO_FACTOR_CHECK]: (
          <TwoFactorCheckForm
            allowReturn={allowReturn}
            onClickReturn={this.handleClickReturn}
            onSubmit={this.handleSubmit}
          />
        ),
        [TWO_FACTOR_BACKUPS]: (
          <TwoFactorBackupForm
            codes={CODES}
            onSubmit={this.handleClickSaveBackups}
          />
        ),
      },
      null,
    );
  }
}

export default TwoFactorStep;
