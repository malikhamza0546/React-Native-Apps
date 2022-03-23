import React, {Component} from 'react';
import {RefreshControl, FlatList, View} from 'react-native';
import {connect} from 'react-redux';
import { MAIN_WHITE} from '../../../resources/colors/colors';
import PureRow from '../../common/PureRow';
import CustomBackHeader from '../../headers/custom-header-back-button';
import {verticalScale} from '../../helpers/Scaling';
import WebApi from '../../webApi/webApiCalls';
class FeatureProfessionalListing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing_list: false,
      professionals: [],
      industry_name: '',
    };
  }
  componentDidMount() {
    const {id, name} = this.props.route.params;
    this.setState({
      industry_name: name,
    });
    const {token} = this.props.user;
    if (name == 'Featured') {
      new WebApi()
        .getFeaturedProfessionals(token)
        .then(result => {
          if (result && result.data)
            this.setState({
              professionals: result.data,
            });
        })
        .catch(error => console.log('Error: ', error));
    } 
  }
  drawline = (width, height, color) => {
    return (
      <View
        style={{
          width: width,
          height: height,
          backgroundColor: color,
        }}
      />
    );
  };
  onRefresh = () => {};
  _renderRowItem = ({item, index}) => {
    const navigate = this.props.navigation;

    return (
      <PureRow item={item} index={index} nav={navigate} title="Professionals" />
    );
  };
  render() {
    const navigate = this.props.navigation;
    return (
      <View style={{flex: 1, backgroundColor: MAIN_WHITE}}>
        <CustomBackHeader nav={navigate} title={this.state.industry_name} />
        <FlatList
          ref={ref => {
            this.flatList = ref;
          }}
          disableVirtualization={false}
          showsVerticalScrollIndicator={false}
          data={this.state.professionals}
          numColumns={2}
          renderItem={this._renderRowItem}
          keyExtractor={item => item.id + ''}
          style={{
            marginBottom: verticalScale(18),
          }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing_list}
              onRefresh={this.onRefresh}
              tintColor="#fff"
              titleColor="#fff"
            />
          }
        />
      </View>
    );
  }
}
const mapStateToProps = state => {
  const {user_data} = state;
  return {
    user: user_data?.user_info?.user_info,
  };
};
const actions = {};
export default connect(mapStateToProps, actions)(FeatureProfessionalListing);
