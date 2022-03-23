import React, {useState, useEffect} from 'react';
import {Text, View} from 'react-native';
import {HeaderTitle} from '../../components/HeaderTitle';
import {Avatar} from 'react-native-elements';
import {Value} from 'react-native-reanimated';
import {connect} from 'react-redux';
import {BASEURL} from '../../config/Config';
import moment from 'moment';
const ProfessionalTransicationDetails = props => {
  const [record, setRecord] = useState(null);
  const {_id} = props.route?.params?.value?.bookingId;
  const {token} = props?.value_token;
  console.log(_id, '_iddd');
  getTransctionInfo = async (_id, token) => {
    // console.log(_id, 'idd');
    // console.log(token, 'token');
    const response = await fetch(
      `${BASEURL}driver/transactions/bookingTransactionsDetail/${_id}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    )
      .then(response => response.json())
      .then(data => {
        console.log(data, 'data');
        setRecord(data);
      });
  };

  useEffect(() => {
    getTransctionInfo(_id, token);
  }, []);

  //   const address = record?.result[0]?.bookingId?.dropoff?.address;
  //   console.log(record, 'record');
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#f9f9f9',
        paddingBottom: 12,
      }}>
      <View
        style={{
          width: '100%',

          zIndex: 10,

          backgroundColor: '#f9f9f9',
          top: 0,
        }}>
        <HeaderTitle
          title="Transactions"
          onPress={() => {
            props.navigation.goBack();
          }}
        />
      </View>
      <View
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 180,
        }}>
        <View
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            zIndex: 5,
          }}>
          <Avatar
            size={60}
            rounded
            source={{
              uri: 'https://cdn.pixabay.com/photo/2020/09/18/05/58/lights-5580916__340.jpg',
            }}
            activeOpacity={0.7}
            // onPress={() => this.setState({show_Camera_modal: true})}
            containerStyle={{
              alignSelf: 'center',
              marginVertical: 1,
              position: 'relative',
              right: 20,
              zIndex: 5,
              backgroundColor: 'transparent',
            }}
          />
          <Avatar
            size={60}
            rounded
            source={{
              uri: 'https://cdn.pixabay.com/photo/2020/09/18/05/58/lights-5580916__340.jpg',
            }}
            activeOpacity={0.7}
            // onPress={() => this.setState({show_Camera_modal: true})}
            containerStyle={{
              alignSelf: 'center',
              marginVertical: 1,
              position: 'absolute',
              left: 25,

              backgroundColor: 'transparent',
            }}
          />
        </View>
        <Text
          style={{
            fontSize: 16,
            fontFamily: 'UberMove-Medium',
            color: ' #232323',
            opacity: 0.8,
          }}>
          Relocation ride from{' '}
          {/* {let x = record?.result[0]?.bookingId?.pickup?.address} */}
          {record?.result[0]?.bookingId?.pickup?.address &&
            `${record?.result[0]?.bookingId?.pickup?.address.split(',')[0]} `}
          to{' '}
          {record?.result[0]?.bookingId?.dropoff?.address &&
            `${record?.result[0]?.bookingId?.dropoff?.address.split(',')[0]}`}
        </Text>
        <Text
          style={{
            fontSize: 12.62,
            color: '#000000',
            opacity: 0.5,
            fontFamily: 'UberMove-Medium',
          }}>
          {moment(record?.result[0]?.bookingId?.createdAt).format('llll')}
        </Text>
      </View>
      <View
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 315,
          height: 151,
          marginHorizontal: 25,
          backgroundColor: '#4A90E2',
          borderRadius: 10,
        }}>
        <Text
          style={{
            fontSize: 16,
            color: 'white',
            fontFamily: 'UberMove-Medium',
          }}>
          Transaction
        </Text>
        <Text
          style={{
            fontSize: 32,
            color: 'white',
            fontFamily: 'UberMove-Medium',
          }}>
          {record?.result &&
            record?.result.map(obj => {
              if (obj.action === 'Booking Created') {
                return `£${parseFloat(obj.amount).toFixed(2)}`;
              }
            })}
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: 'white',
            fontFamily: 'UberMove-Medium',
          }}>
          You have recived{' '}
          {record?.result &&
            record?.result.map(obj => {
              if (obj.action === 'Driver Earning') {
                return `£${parseFloat(obj.amount).toFixed(2)}`;
              }
            })}{' '}
          form {record?.result[0]?.customerId?.firstName}
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: 'white',
            fontFamily: 'UberMove-Medium',
          }}>
          Ride
        </Text>
      </View>
      <View
        style={{
          display: 'flex',

          paddingTop: 20,
          paddingLeft: 20,
          paddingRight: 22,
          marginTop: 35,
          width: 315,
          height: 248,
          marginHorizontal: 25,
          backgroundColor: '#f9f9f9',
          borderRadius: 10,
          backgroundColor: '#E5E5E5',
        }}>
        <Text
          style={{
            fontSize: 20,
            fontFamily: 'UberMove-Medium',
            color: '#1D1D1D',
            opacity: 0.85,
          }}>
          Transaction Details
        </Text>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            fontSize: 16,
            marginTop: 15,
            justifyContent: 'space-between',
          }}>
          <Text style={{color: '#666666', fontFamily: 'UberMove-Medium'}}>
            Subtotal
          </Text>
          <Text style={{color: '#666666', fontFamily: 'UberMove-Medium'}}>
            {record?.result &&
              record?.result.map(obj => {
                if (obj.action === 'Booking Created') {
                  return `£${parseFloat(obj.amount).toFixed(2)}`;
                }
              })}
          </Text>
        </View>

        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            fontSize: 16,
            marginTop: 10,
            justifyContent: 'space-between',
          }}>
          <Text style={{color: '#666666', fontFamily: 'UberMove-Medium'}}>
            Winchit fee
          </Text>
          <Text style={{color: '#666666', fontFamily: 'UberMove-Medium'}}>
            {record?.result &&
              record?.result.map(obj => {
                if (obj.action === 'Admin Commission') {
                  return `-£${parseFloat(obj.amount).toFixed(2)}`;
                }
              })}
          </Text>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            fontSize: 16,
            marginTop: 10,
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              color: '#333333',
              fontSize: 18,
              fontFamily: 'UberMove-Medium',
            }}>
            Total Earnings
          </Text>
          <Text
            style={{
              color: '#353535',
              fontSize: 18,
              fontFamily: 'UberMove-Medium',
            }}>
            {record?.result &&
              record?.result.map(obj => {
                if (obj.action === 'Driver Earning') {
                  return `£${parseFloat(obj.amount).toFixed(2)}`;
                }
              })}
          </Text>
        </View>
      </View>
    </View>
  );
};
const mapStateToProps = state => {
  return {value_token: state.userReducer};
};

export default connect(mapStateToProps, null)(ProfessionalTransicationDetails);
