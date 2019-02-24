import React, { Fragment } from 'react';
import { getList, getUserSelf, getUsers } from 'common/api';
import { isServer } from 'common/utils/isEnvironment';
import { getToken } from 'common/utils/token';
import { DashboardContainer } from '../containers';
import { Head } from '../components';

const DashboardPage = props => (
  <Fragment>
    <Head title="Dashboard" />
    <DashboardContainer {...props} />
  </Fragment>
);

DashboardPage.getInitialProps = async ({ req, query }) => {
  try {
    const token = isServer ? req.cookies.token : getToken();
    const { data: list } = await getList(token);
    const { data: user } = await getUserSelf(token);
    const { data: members } = await getUsers(token);

    console.log('list', list);

    return {
      list,
      user,
      members,
      predefinedListId: isServer
        ? req.query.listId
        : (query && query.listId) || null,
    };
  } catch (e) {
    // TODO: figure out about request errors
    // console.log(e.response);
  }

  return {};
};

export default DashboardPage;
