import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  ScrollView,
  Image,
  RefreshControl,
  Keyboard,
  AppState,
  Platform,
  ActivityIndicator,
  Linking,
} from 'react-native';
import {_BASE_URL} from '../../../../env';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import FilterForIndutry from './FilterForIndutry';
import {connect} from 'react-redux';
import {selectTab} from '../../../Redux/actions/ActionsSelectedTab';
import {getUnreadNotification} from '../../../Redux/actions/unreadNotifcationAction';
import axios from 'axios';
import {
  MAIN_BLUE,
  MAIN_WHITE,
  MAIN_YELLOW,
  SECONDARY_BLUE,
  TEXT_INPUT_COLOR,
  MAIN_FONT,
  MAIN_FONT_BOLD,
} from '../../../resources/colors/colors';
import {scale, verticalScale} from '../../helpers/Scaling';
import WebApi from '../../webApi/webApiCalls';
import {TouchableOpacity} from 'react-native';
import PureRow from '../../common/PureRow';
import _, {debounce, result} from 'lodash';
import {MyPushNotification} from '../../helpers/PushNotifs';
import MyStorage from '../../helpers/myStorage';
import {_INDUSTRY_ID} from '../../../../env';
class Search extends Component {
  constructor(props) {
    super(props);

    this.push_service = new MyPushNotification(this.props.user);
    this.state = {
      search_query: null,
      industryList: [],
      schoolsList: [],
      featured_prof: [],
      tech_prof: [],
      finance_prof: [],
      _is_rate_modal: false,
      revieweeName: '',
      booking_id: '',
      appState: AppState.currentState,
      show_search_section: false,
      search_list: [],
      search_loading: false,
      search_back_icon: false,
      refreshing_list: false,
      allProfessionals: [],
      placeholderarraylength: 0,
      filterforIndustry: [],
      placeholderarray: [
        {id: '2', text: 'Try "Oxford University"'},
        {id: '3', text: 'Try "Private Equity"'},
        {id: '1', text: 'Try "Goldman Sachs"'},
      ],
      placeholder: 'Try "Goldman Sachs"',
      filterchanger: false,
      catagorystates: [
        {
          radioSortBy: null,
          radioPrice: [0, 1000],
          industry: [],
          search: null,
        },
      ],
      industry: [],
    };
    this.onChangeTextDelayed = debounce(this.searchUser, 1000);
  }

  onRefresh = () => {
    this.setState({refreshing_list: true});
    this.getCompanyListing();
  };

  async componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
    this.interval = setInterval(() => this.changePlaceHolder(), 5000);
    this.handleDeepLink();
    setTimeout(() => {
      this.push_service.getInitialNotification(this.props.navigation);
      this.push_service.onComponentDidMount();
    }, 500);

    setTimeout(() => {
      this.push_service.initPushService({
        props: this.props,
        nav: this.props.navigation,
      });
    }, 200);
    const info = await new MyStorage().getUserInfo();

    const token = JSON.parse(info).token;
    const id = JSON.parse(info).id;

    this.getAllIndustries(token);
    this.getAllSchools(token);
    this.getFeaturedProfessionals(token);
    this.getListing(1, token);
    this.getListing(2, token);
    this.getAllProfessionals(token);
    this.getCompanyListing(token);
    this.localgetunreadnotifications(id, token);
    this.props.selectTab(0);
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      if (this.props.route.params?.data !== undefined) {
        this.setState({
          search_list: this.props.route.params.data,
          search_loading: false,
          filterchanger: true,
          show_search_section: true,
          search_back_icon: true,
          catagorystates: this.props.route.params.catagorystates,
          industry: this.props.route.params.Industry,
        });
      }

      setTimeout(() => {
        this.props.selectTab(0);
        this.getAllIndustries(token);
        this.getAllSchools(token);
        this.localgetunreadnotifications(id, token);
        this.getFeaturedProfessionals(token);
        this.getListing(1, token);
        this.getListing(2, token);
        this.getAllProfessionals(token);
        this.getCompanyListing(token);
      }, 1000);
    });
  }

  handleAppStateChange = nextAppState => {
    if (
      this.state.appState.match(/background|inactive/) &&
      nextAppState === 'active'
    ) {
      setTimeout(() => {
        this.handleDeepLink();
      }, 500);
    }
  };
  changePlaceHolder = () => {
    if (
      this.state.placeholderarraylength < this.state.placeholderarray.length
    ) {
      this.setState(
        {
          placeholder:
            this.state.placeholderarray[this.state.placeholderarraylength].text,
        },
        function ss() {
          this.setState({
            placeholderarraylength: this.state.placeholderarraylength + 1,
          });
        },
      );
    } else {
      this.setState({placeholderarraylength: 0}, function setpalceholder() {
        this.setState({
          placeholder:
            this.state.placeholderarray[this.state.placeholderarraylength].text,
        });
      });
    }
  };

  localgetunreadnotifications(id, token) {
    new WebApi().getunReadNotification(id, token).then(result => {
      if (result.status == '200') {
        this.props.getUnreadNotification(result.data.Unread_Notifications);
      } else {
        this.props.getUnreadNotification(null);
      }
    });
  }

  handleDeepLink() {
    if (Platform.OS === 'android') {
      Linking.getInitialURL().then(url => {
        this.navigate(url);
      });
    } else {
      Linking.addEventListener('url', this.handleOpenURL);
    }
  }
  componentWillUnmount() {
    clearInterval(this.interval);
    this._unsubscribe && this._unsubscribe();
    this.push_service.onComponentWillUnmount();
    Linking.removeAllListeners('url', this.handleOpenURL);
  }
  handleOpenURL = event => {
    this.navigate(event.url);
  };

  navigate = async url => {
    const {} = this.props.navigation;
    if (url != null) {
      const route = url.replace(/.*?:\/\//g, '');

      const info = await new MyStorage().getUserInfo();

      const s_route = route.toString();
      const simpleroute = s_route.split('/');
      if (simpleroute.length == 3) {
        const id = simpleroute[2];
        if (simpleroute[1] == 'booking') {
          this.props.navigation.push('BookingDetailsID', {id: id});
        } else if (simpleroute[1] == 'professional') {
          this.props.navigation.push('ProfessionalDetails', {id: id});
        }
      }
    } else {
    }
  };
  searchUser = async () => {
    const info = await new MyStorage().getUserInfo();
    const token = JSON.parse(info).token;
    new WebApi()
      .filterUserWithSearch(this.state.search_query, token)
      .then(result => {
        console.log(result.data);
        if (result?.data) {
          console.log(result.data, 'resu;lt of Saad');
          // console.log(result.data, 'result data in screen');
          this.setState({
            search_list: result.data,
            search_loading: false,
          });
        } else {
          this.setState({search_loading: false});
        }
      })
      .catch(error => {
        this.setState({search_loading: false});
      });
  };

  _handleAppStateChange = nextAppState => {
    if (this.state.appState.match(/background/) && nextAppState === 'active') {
      this.push_service.getInitialNotification();
      this.push_service.onComponentDidMount();
      if (Platform.OS === 'android') {
        Linking.getInitialURL().then(url => {
          this.navigate(url);
        });
      } else {
        Linking.addEventListener('url', this.handleOpenURL);
      }
    }
    this.setState({appState: nextAppState});
  };

  getCompanyListing = () => {
    const {token} = this.props.user;
    new WebApi()
      .getCompanyListing(token)
      .then(result => {
        this.setState({
          companyList: result.data,
        });
      })
      .catch(error => console.log('error ', error))
      .finally(() =>
        this.setState({
          refreshing_list: false,
        }),
      );
  };
  getAllIndustries = token => {
    new WebApi()
      .getAllIndustries(token)
      .then(result => {
        if (result && result.data) {
          this.setState({
            industryList: result.data,
          });
        }
      })
      .catch(error => console.log('Error: ', error));
  };

  getAllSchools = token => {
    new WebApi()
      .getAllSchools(token)
      .then(result => {
        if (result && result.data) {
          this.setState({
            schoolsList: result.data,
          });
        }
      })
      .catch(error => console.log('Error: ', error));
  };

  getFeaturedProfessionals = token => {
    new WebApi().getFeaturedProfessionals(token).then(result => {
      this.setState({
        featured_prof: result.data,
      });
    });
  };
  getListing = (id, token) => {
    new WebApi()
      .filterUserWithIndID(id, token)
      .then(result => {
        if (result && result.data) {
          if (id == 1) {
            this.setState({
              tech_prof: result.data,
            });
          } else if (id == 3) {
            this.setState({
              finance_prof: result.data,
            });
          }
        }
      })
      .catch(error => console.log('Error: ', error));
  };
  getAllProfessionals = token => {
    new WebApi().getAllProfessionals(token).then(res => {
      this.setState({
        allProfessionals: res.data,
      });
    });
  };

  createSearchSection = () => {
    return (
      <View
        style={{
          borderWidth: 1,
          borderRadius: scale(28),
          borderColor: '#DDDDDD',
          alignItems: 'center',
          flexDirection: 'row',
          marginTop: verticalScale(8),
          paddingHorizontal: scale(12),
        }}>
        {this.state.search_back_icon ? (
          <Icon
            color={'#8B8B8B'}
            onPress={() => {
              let copyArray = [...this.state.industry];
              let settingAraay = copyArray.map(obj => {
                return {...obj, status: false};
              });
              Keyboard.dismiss();
              this.setState({
                show_search_section: false,
                search_back_icon: false,
                search_query: '',
                search_list: [],
                filterchanger: false,
                catagorystates: [
                  {
                    radioSortBy: null,
                    radioPrice: [],
                    industry: [],
                    search: null,
                  },
                ],
                industry: settingAraay,
              });
            }}
            name="arrowleft"
            type="ant-design"
            size={25}
          />
        ) : (
          <Icon
            color={'#8B8B8B'}
            onPress={() => this.setState({show_search_section: false})}
            name="search1"
            type="ant-design"
            size={25}
          />
        )}
        <TextInput
          onTouchStart={() =>
            this.setState({show_search_section: true, search_back_icon: true})
          }
          // onFocus={()=> this.setState({search_back_icon: true})}
          keyboardType={'default'}
          returnKeyType="search"
          underlineColorAndroid="transparent"
          // autoCapitalize="none"
          autoCorrect={false}
          placeholder={`${this.state.placeholder}`}
          placeholderTextColor="#bbb"
          value={this.state.search_query}
          onChangeText={text => {
            this.onChangeTextDelayed();
            this.setState({search_query: text, search_loading: true});
          }}
          style={{
            flex: 1,
            paddingVertical: verticalScale(8),
            marginLeft: scale(8),
            color: TEXT_INPUT_COLOR,
            fontSize: scale(14),
            fontFamily: MAIN_FONT,
          }}
          ref={'search'}
        />
        {this.state.search_loading && (
          <ActivityIndicator
            size="small"
            animating={this.state.search_loading}
            color={MAIN_BLUE}
          />
        )}
        {/* {
                    (this.state.search_query.trim() != '' && !this.state.search_loading)
                    &&
                    <Icon color={'#8B8B8B'} name="close" type="ant-design" size={28} />
                } */}
      </View>
    );
  };
  createListingSection = (id, title, _data) => {
    return (
      <View
        style={{
          marginTop: verticalScale(8),
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: verticalScale(5),
          }}>
          <Text
            style={{
              fontFamily: MAIN_FONT_BOLD, //Semibold
              fontSize: scale(16),
              color: '#343434',
              textAlign: 'center',
            }}>
            {title}
          </Text>
          <TouchableOpacity
            onPress={() => {
              if (title == 'Featured') {
                this.props.navigation.navigate('featureProfessionalListing', {
                  id: id,
                  name: title,
                });
              } else {
                this.props.navigation.navigate('ProfessionalListing', {
                  id: id,
                  name: title,
                });
              }
            }}>
            <Text
              style={{
                fontFamily: MAIN_FONT, //medium
                fontSize: scale(12),
                color: '#0087FF',
                paddingTop: verticalScale(4),
                textAlign: 'center',
                // textDecorationLine: 'underline',
              }}>
              See all
            </Text>
          </TouchableOpacity>
        </View>
        {_data && (
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => String(index)}
            data={_data}
            renderItem={this.renderListing}
          />
        )}
      </View>
    );
  };
  renderListing = ({item, index}) => {
    return (
      <PureRow
        item={item}
        index={index}
        nav={this.props.navigation}
        horizontal={true}
      />
    );
  };
  createSchoolsSection = title => {
    return (
      <View
        style={{
          marginTop: verticalScale(18),
        }}>
        <Text
          style={{
            fontFamily: MAIN_FONT_BOLD,
            fontSize: scale(16),
            color: '#343434',
          }}>
          {title}
        </Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => String(index)}
          data={this.state.schoolsList}
          renderItem={this.createCompanyItem}
        />
      </View>
    );
  };
  createCompanySection = title => {
    return (
      <View
        style={{
          marginTop: verticalScale(18),
        }}>
        <Text
          style={{
            fontFamily: MAIN_FONT_BOLD,
            fontSize: scale(16),
            color: '#343434',
          }}>
          {title}
        </Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => String(index)}
          data={this.state.companyList}
          renderItem={this.createCompanyItem}
        />
      </View>
    );
  };

  createIndustrySection = title => {
    const {industryList} = this.state;

    return (
      <View
        style={{
          marginTop: verticalScale(18),
        }}>
        <Text
          style={{
            fontFamily: MAIN_FONT_BOLD,
            fontSize: scale(16),
            color: '#343434',
          }}>
          {title}
        </Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => String(index)}
          data={industryList.sort((a, b) => b.is_featured - a.is_featured)}
          renderItem={this.createIndustryItem}
        />
      </View>
    );
  };

  createIndustryItem = ({item, index}) => {
    if (item.is_featured == 1) {
      return (
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate('ProfessionalListing', {
              id: item.id,
              name: item?.name,
            });
          }}
          style={{
            height: scale(80),
            width: scale(80),
            margin: scale(5),
            borderRadius: scale(15),
            overflow: 'hidden',
          }}>
          <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 5, y: 0}}
            colors={['#1BD5FF', '#1290FF']}
            style={{
              width: scale(80),
              height: scale(80),
            }}>
            <Image
              style={{
                opacity: 0.3,
                width: scale(80),
                height: scale(80),
              }}
              resizeMode="cover"
              source={{uri: item?.profile_photo}}
            />
            <View
              style={{
                position: 'absolute',
                justifyContent: 'center',
                alignItems: 'center',
                left: scale(5),
                right: scale(5),
                bottom: 0,
                top: 0,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  alignSelf: 'center',
                  fontSize: scale(12),
                  fontFamily: 'Raleway-Bold',
                  color: 'white',
                }}>
                {item?.name}
              </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      );
    } else {
      if (item.id == _INDUSTRY_ID) {
        return null;
      }
      return (
        <TouchableOpacity
          style={{
            height: scale(80),
            width: scale(80),
            margin: scale(5),
            borderRadius: scale(15),
            overflow: 'hidden',
          }}>
          <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 5, y: 0}}
            colors={['#d3d3d3', '#d3d3d3']}
            style={{
              width: scale(80),
              height: scale(80),
            }}>
            <Image
              style={{
                opacity: 0.3,
                width: scale(80),
                height: scale(80),
              }}
              resizeMode="cover"
              source={{uri: item?.profile_photo}}
            />
            <View
              style={{
                position: 'absolute',
                justifyContent: 'center',
                alignItems: 'center',
                left: scale(5),
                right: scale(5),
                bottom: 0,
                top: 0,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  alignSelf: 'center',
                  fontSize: scale(10),
                  fontFamily: 'Raleway-Bold',
                  color: 'rgba(0,0,0,.6)',
                }}>
                {item.name}
                {'\n'}
                <Text
                  style={{
                    textAlign: 'center',
                    alignSelf: 'center',
                    fontSize: scale(6),
                    fontFamily: 'Raleway-Regular',
                    color: 'rgba(0,0,0,.5)',
                  }}>
                  coming soon
                </Text>
              </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      );
    }
  };
  createCompanyItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.onChangeTextDelayed();
          this.setState({
            show_search_section: true,
            search_query: item.name,
            search_loading: true,
            search_back_icon: true,
          });
        }}
        style={{marginRight: scale(8)}}>
        <View
          style={{
            alignItems: 'center',
            marginVertical: verticalScale(2),
            marginRight: scale(28),
          }}>
          <View
            style={{
              borderWidth: 0,
              padding: 0,
              borderColor: 'blue',
            }}>
            <Image
              style={{
                width: scale(60),
                height: verticalScale(60),
              }}
              resizeMode="contain"
              source={{uri: item?.profile_photo}}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  screenChanger = () => {
    this.props.navigation.navigate('FilterForIndutry');
  };

  render() {
    return (
      <View style={{flex: 1, backgroundColor: MAIN_WHITE}}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-end',
          }}>
          <View
            style={{
              marginTop: verticalScale(20),
              marginHorizontal: scale(12),
              width: scale(235),
            }}>
            {this.createSearchSection()}
          </View>
          <TouchableOpacity
            style={{
              borderWidth: 1,
              width: scale(40),
              borderRadius: 5,
              borderColor: '#E5E5E5',
              height: scale(44),
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => this.screenChanger()}>
            {!this.state.filterchanger && (
              <Image source={require('../../../resources/images/filter.png')} />
            )}
            {this.state.filterchanger && (
              <Image
                source={require('../../../resources/images/filledfilter.png')}
              />
            )}
          </TouchableOpacity>
        </View>
        {this.state.show_search_section ? (
          <>
            {this.state.search_loading ? (
              <Text
                style={{
                  fontFamily: MAIN_FONT_BOLD, //Semibold
                  fontSize: scale(12),
                  color: '#343434',
                  marginTop: verticalScale(12),
                  alignSelf: 'center',
                  textAlign: 'center',
                }}>
                Looking for {this.state.search_query}
              </Text>
            ) : (
              <>
                {this.state.search_list?.length < 1 ? (
                  <Text
                    style={{
                      fontFamily: MAIN_FONT_BOLD, //Semibold
                      fontSize: scale(12),
                      color: '#343434',
                      marginTop: verticalScale(12),
                      alignSelf: 'center',
                      textAlign: 'center',
                    }}>
                    No professionals found.
                  </Text>
                ) : (
                  <FlatList
                    ref={ref => {
                      this.flatList = ref;
                    }}
                    disableVirtualization={false}
                    showsVerticalScrollIndicator={false}
                    data={this.state.search_list}
                    numColumns={2}
                    renderItem={this.renderListing}
                    keyExtractor={(item, index) => String(index)}
                    style={{
                      marginBottom: verticalScale(18),
                    }}
                    refreshControl={
                      <RefreshControl
                        refreshing={this.state.refreshing_list}
                        tintColor="#fff"
                        titleColor="#fff"
                      />
                    }
                  />
                )}
              </>
            )}
          </>
        ) : (
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing_list}
                onRefresh={this.onRefresh}
                tintColor="#000"
                titleColor="#000"
              />
            }
            style={{
              flex: 1,
              marginHorizontal: scale(12),
            }}
            showsVerticalScrollIndicator={false}>
            {this.state.featured_prof?.length > 0 &&
              this.createListingSection(
                4,
                'Featured',
                this.state.featured_prof,
              )}

            {this.state.industryList?.length > 0 &&
              this.createIndustrySection('Industries')}

            {this.state.companyList?.length > 0 &&
              this.createCompanySection('Companies')}
            {this.state.schoolsList?.length > 0 &&
              this.createSchoolsSection('Schools')}
            {this.state.allProfessionals?.length > 0 &&
              this.createListingSection(
                0,
                'All Professionals',
                this.state.allProfessionals,
              )}
          </ScrollView>
        )}
      </View>
    );
  }
}
const mapStateToProps = state => {
  const {user_data} = state;
  return {
    user: user_data?.user_info?.user_info,
    jwt: user_data?.user_info?.jwt_info,
  };
};
const actions = {
  selectTab,
  getUnreadNotification,
};
export default connect(mapStateToProps, actions)(Search);
