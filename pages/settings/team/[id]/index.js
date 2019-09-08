import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { TeamContainer } from 'containers';
import {
  Head,
  SettingsLayout,
  SettingsSidebar,
  FullScreenLoader,
} from 'components';
import {
  fetchUserSelfRequest,
  fetchUserTeamsRequest,
} from 'common/actions/user';
import { userDataSelector, currentTeamSelector } from 'common/selectors/user';

class SettingsTeamPage extends Component {
  componentDidMount() {
    this.props.fetchUserSelfRequest();
    this.props.fetchUserTeamsRequest();
  }

  render() {
    const { userData, currentTeam } = this.props;

    const shouldShowLoader = !userData || !currentTeam;

    if (shouldShowLoader) {
      return <FullScreenLoader />;
    }

    return (
      <Fragment>
        <Head title="Team" />
        <SettingsLayout user={userData} team={currentTeam}>
          <Fragment>
            <SettingsSidebar />
            <TeamContainer />
          </Fragment>
        </SettingsLayout>
      </Fragment>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  userData: userDataSelector,
  currentTeam: currentTeamSelector,
});

const mapDispatchToProps = {
  fetchUserSelfRequest,
  fetchUserTeamsRequest,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SettingsTeamPage);
