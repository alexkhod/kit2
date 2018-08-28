import React from 'react';
import Loadable from 'react-loadable';
import path from 'path';
import { graphql } from 'react-apollo';

// import ZverAddView from '../components/ZverAddView';
import Loading from '../components/Loading';
import { AddZver } from './Zver';

import ADD_ZVER from '../graphql/AddZver.graphql';

const AsyncZverAddView = Loadable({
  loader: () => import(/* webpackChunkName: "ZverAddView" */ '../components/ZverAddView'),
  loading: Loading,
  delay: 300,
  serverSideRequirePath: path.join(__dirname, '../components/ZverAddView')
});

class ZverAdd extends React.Component {
  constructor(props) {
    super(props);
    this.subscription = null;
  }

  render() {
    return <AsyncZverAddView {...this.props} />;
  }
}

export default graphql(ADD_ZVER, {
  props: ({ ownProps: { history, navigation }, mutate }) => ({
    addZver: async (inv, isWork = false) => {
      let zverData = await mutate({
        variables: { input: { inv: inv.trim(), isWork: isWork } },
        optimisticResponse: {
          __typename: 'Mutation',
          addZver: {
            __typename: 'Zver',
            id: null,
            inv: inv,
            isWork: isWork,
            blocks: [],
            notes: []
          }
        },
        updateQueries: {
          zvers: (
            prev,
            {
              mutationResult: {
                data: { addZver }
              }
            }
          ) => {
            return AddZver(prev, addZver);
          }
        }
      });

      if (history) {
        return history.push('/zver/' + zverData.data.addZver.id, {
          zver: zverData.data.addZver
        });
      } else if (navigation) {
        return navigation.navigate('ZverEdit', { id: zverData.data.addZver.id });
      }
    }
  })
})(ZverAdd);
