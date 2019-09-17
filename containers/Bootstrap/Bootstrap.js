import React, { Component } from 'react';
import * as openpgp from 'openpgp';
import { withRouter } from 'next/router';
import { getUserBootstrap, getUserSelf } from 'common/api';
import { DEFAULT_IDLE_TIMEOUT } from 'common/constants';
import {
  SessionChecker,
  FullScreenLoader,
  BootstrapLayout,
  LoadingNotification,
} from 'components';
import { getBootstrapStates, getNavigationPanelSteps } from './utils';
import {
  TWO_FACTOR_CHECK,
  TWO_FACTOR_CREATE,
  PASSWORD_CHANGE,
  MASTER_PASSWORD_CHECK,
  MASTER_PASSWORD_CREATE,
  SHARED_ITEMS_CHECK,
  BOOTSTRAP_FINISH,
} from './constants';
import {
  TwoFactorStep,
  PasswordStep,
  MasterPasswordStep,
  SharedItemsStep,
} from './Steps';

const TWO_FACTOR_STEPS = [TWO_FACTOR_CREATE, TWO_FACTOR_CHECK];
const PASSWORD_STEPS = [PASSWORD_CHANGE];
const MASTER_PASSWORD_STEPS = [MASTER_PASSWORD_CREATE, MASTER_PASSWORD_CHECK];
const SHARED_ITEMS_STEPS = [SHARED_ITEMS_CHECK];

class Bootstrap extends Component {
  state = this.prepareInitialState();

  worker = null;

  bootstrap = null;

  async componentDidMount() {
    this.initOpenPGP();

    this.props.initCoresCount();

    const { data: bootstrap } = await getUserBootstrap();
    const { data: user } = await getUserSelf();

    this.bootstrap = getBootstrapStates(bootstrap);
    this.navigationPanelSteps = getNavigationPanelSteps(this.bootstrap);
    this.user = user;

    this.setState({
      currentStep: this.currentStepResolver(bootstrap),
    });
  }

  handleFinishTwoFactor = () => {
    const { passwordState, masterPasswordState } = this.bootstrap;

    this.setState({
      currentStep:
        passwordState === PASSWORD_CHANGE
          ? PASSWORD_CHANGE
          : masterPasswordState,
    });
  };

  handleFinishChangePassword = () => {
    const { masterPasswordState } = this.bootstrap;

    this.setState({
      currentStep: masterPasswordState,
    });
  };

  handleFinishMasterPassword = ({
    oldKeyPair,
    currentKeyPair,
    masterPassword,
  }) => {
    const { sharedItemsState } = this.bootstrap;

    this.props.setMasterPassword(masterPassword);

    this.setState({
      oldKeyPair,
      currentKeyPair,
      masterPassword,
      currentStep:
        sharedItemsState === SHARED_ITEMS_CHECK
          ? SHARED_ITEMS_CHECK
          : BOOTSTRAP_FINISH,
    });
  };

  handleFinishSharedItems = () => {
    this.setState({
      currentStep: BOOTSTRAP_FINISH,
    });
  };

  handleInactiveTimeout = () => {
    this.props.resetWorkflowStore();
    this.props.removeItemsData();

    this.setState({
      currentStep: MASTER_PASSWORD_CHECK,
    });
  };

  initOpenPGP() {
    openpgp.config.aead_protect = false;
  }

  currentStepResolver(bootstrap) {
    const {
      twoFactorAuthState,
      passwordState,
      masterPasswordState,
      sharedItemsState,
    } = getBootstrapStates(bootstrap);

    if (TWO_FACTOR_STEPS.includes(twoFactorAuthState)) {
      return twoFactorAuthState;
    }

    if (PASSWORD_STEPS.includes(passwordState)) {
      return passwordState;
    }

    if (MASTER_PASSWORD_STEPS.includes(masterPasswordState)) {
      return masterPasswordState;
    }

    if (SHARED_ITEMS_STEPS.includes(sharedItemsState)) {
      return sharedItemsState;
    }

    return MASTER_PASSWORD_CHECK;
  }

  prepareInitialState() {
    return {
      currentStep: null,
      masterPassword: null,
      oldKeyPair: {
        publicKey: null,
        encryptedPrivateKey: null,
      },
      currentKeyPair: {
        publicKey: null,
        encryptedPrivateKey: null,
      },
    };
  }

  render() {
    const {
      isLoadingGlobalNotification,
      component: PageComponent,
      router,
      shared = {},
      ...props
    } = this.props;
    const {
      currentStep,
      oldKeyPair,
      currentKeyPair,
      masterPassword,
    } = this.state;

    if (!currentStep) {
      return <FullScreenLoader />;
    }

    if (TWO_FACTOR_STEPS.includes(currentStep)) {
      return (
        <BootstrapLayout user={this.user}>
          <TwoFactorStep
            initialStep={currentStep}
            navigationSteps={this.navigationPanelSteps}
            onFinish={this.handleFinishTwoFactor}
          />
        </BootstrapLayout>
      );
    }

    if (PASSWORD_STEPS.includes(currentStep)) {
      return (
        <BootstrapLayout user={this.user}>
          <PasswordStep
            email={shared.e}
            navigationSteps={this.navigationPanelSteps}
            onFinish={this.handleFinishChangePassword}
          />
        </BootstrapLayout>
      );
    }

    if (MASTER_PASSWORD_STEPS.includes(currentStep)) {
      return (
        <MasterPasswordStep
          initialStep={currentStep}
          navigationSteps={this.navigationPanelSteps}
          user={this.user}
          sharedMasterPassword={shared.mp}
          onFinish={this.handleFinishMasterPassword}
        />
      );
    }

    if (SHARED_ITEMS_STEPS.includes(currentStep)) {
      return (
        <BootstrapLayout user={this.user}>
          <SharedItemsStep
            navigationSteps={this.navigationPanelSteps}
            oldKeyPair={oldKeyPair}
            currentKeyPair={currentKeyPair}
            oldMasterPassword={shared.mp}
            currentMasterPassword={masterPassword}
            onFinish={this.handleFinishSharedItems}
          />
        </BootstrapLayout>
      );
    }

    // if user is using sharing url and master password is included inside share
    // url we don't turn on LockScreen via SessionChecker(onFinishTimeout)
    if (currentStep === BOOTSTRAP_FINISH && shared.mp) {
      return (
        <PageComponent
          publicKey={currentKeyPair.publicKey}
          privateKey={currentKeyPair.encryptedPrivateKey}
          password={masterPassword}
          {...props}
        />
      );
    }

    // TODO: during refactoring to rename:
    // TODO: - password to masterPassword
    // TODO: - privateKey to encryptedPrivateKey
    return (
      currentStep === BOOTSTRAP_FINISH && (
        <SessionChecker
          timeout={DEFAULT_IDLE_TIMEOUT}
          onFinishTimeout={this.handleInactiveTimeout}
        >
          <PageComponent
            publicKey={currentKeyPair.publicKey}
            privateKey={currentKeyPair.encryptedPrivateKey}
            password={masterPassword}
            {...props}
          />
          {isLoadingGlobalNotification && <LoadingNotification />}
        </SessionChecker>
      )
    );
  }
}

export default withRouter(Bootstrap);
