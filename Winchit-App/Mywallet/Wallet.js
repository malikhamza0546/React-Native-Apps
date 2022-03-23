import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
  FlatList,
} from 'react-native';
import {HeaderTitle} from '../../components/HeaderTitle';
import TransicationsHeader from './HeaderComponent';
import ProfessionalTransicationItem from './ProfessionalTransitionItem';
import {BASEURL} from '../../config/Config';
import {connect} from 'react-redux';

const Wallet = props => {
  const [record, setRecord] = useState([]);
  const [userinfo, setUserinfo] = useState([]);
  const [forrendering, setForrendering] = useState(null);

  const onClickEv = item => {
    if (item.action === 'Driver Earning') {
      props.navigation.navigate('ProfessionalTransicationDetails', {
        value: item,
      });
    }
  };
  const renderList = ({item}) => {
    return (
      <ProfessionalTransicationItem
        Item={item}
        onClick={() => onClickEv(item)}
      />
    );
  };

  useEffect(() => {
    const token = props?.value?.token;
    const {_id} = props?.value?.user;

    getCustomers(token);
    getUserInfo(_id, token);
  }, [forrendering]);

  getCustomers = async token => {
    const response = await fetch(
      `${BASEURL}driver/transactions/transactionsForDriver/`,
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
        console.log(data, 'for testing');
        setRecord(data);
      });
  };

  getUserInfo = async (_id, token) => {
    const response = await fetch(`${BASEURL}users/${_id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        setUserinfo(data);
      });
  };

  stripeConnection = async token => {
    var myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${token}`);
    const {_id} = props?.value?.user;
    var raw = '';
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    fetch(`${BASEURL}driver/stripe/registerAccount`, requestOptions)
      .then(response => response.json())
      .then(data => {
        props.navigation.navigate('Webview', {
          value: data,
          stripeFunction: () => {
            getUserInfo(_id, token);
          },
        });
      })
      .catch(err => {
        console.log('errrrr', err);
      });
  };

  const WithDrawalRequestHandler = async () => {
    const token = props?.value?.token;
    const balance = userinfo?.wallet?.balance;
    const {_id} = props?.value?.user;

    console.log(
      `${BASEURL}driver/transactions/initiate-Funds-Withdrawal/${_id}`,
    );
    console.log(balance, 'balance');
    const response = await fetch(
      `${BASEURL}driver/transactions/initiate-Funds-Withdrawal/${_id}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: balance,
          notes: 'this is a test request',
        }),
      },
    )
      .then(response => response.json())
      .then(data => {
        console.log(data, 'data');
        setForrendering('hamza');
      })
      .catch(err => {
        console.log(err, 'catch body ');
      });
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <HeaderTitle
        title="My bookings"
        onPress={() => {
          props.navigation.goBack();
        }}
      />

      <TransicationsHeader userinfo={userinfo} />
      <View
        style={{
          width: '100%',
          marginVertical: 10,
          borderBottomColor: 'rgba(0,0,0,.2)',
          borderBottomWidth: 1,
          alignSelf: 'center',
        }}
      />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={record?.result}
        renderItem={renderList}
        keyExtractor={index => index}
      />
      {userinfo.registeredWithStripe === false && (
        <TouchableHighlight
          style={styles.submit}
          onPress={() => {
            stripeConnection(props?.value?.token);
          }}>
          <Text style={styles.submitText}>Connect to Stripe</Text>
        </TouchableHighlight>
      )}
      {console.log(
        record?.alreadyRequestedPayout,
        'record?alreadyRequestedPayout',
      )}
      {record?.alreadyRequestedPayout === false && (
        <TouchableHighlight
          style={styles.submit}
          underlayColor="#fff"
          onPress={WithDrawalRequestHandler}>
          <Text style={styles.submitText}>Request Withdrawal</Text>
        </TouchableHighlight>
      )}
      <Text
        style={{
          textAlign: 'center',
          marginBottom: 16,
          marginTop: 5,
          color: '#737373',
          fontFamily: 'UberMove-Medium',
          fontSize: 12,
          marginHorizontal: 30,
        }}>
        We have received your request and we are working on it. You should
        receive your payout within 5-7 working days.
      </Text>
    </View>
  );
};
const mapStateToProps = state => {
  return {value: state.userReducer};
};

export default connect(mapStateToProps, null)(Wallet);
const styles = StyleSheet.create({
  submit: {
    marginRight: 40,
    marginLeft: 40,
    marginTop: 10,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: '#4A90E2',
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#fff',
  },
  submitText: {
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'UberMove-Medium',
  },
});
