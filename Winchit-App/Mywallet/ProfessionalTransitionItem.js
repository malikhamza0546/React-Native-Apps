import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {Avatar} from 'react-native-elements';
import moment from 'moment';
const ProfessionalTransicationItem = ({Item, onClick}) => {
  console.log(Item, 'Item for testing');
  const {action} = Item;
  const {createdAt} = Item;
  const {amount} = Item;
  const avatar = Item?.customerId?.avatar;
  console.log(avatar, 'avatar');
  return (
    <TouchableOpacity
      style={styles.mainView}
      onPress={() => {
        onClick('abc123');
      }}>
      <View style={{flexDirection: 'row', width: '60%'}}>
        <Avatar
          size={60}
          source={{
            uri: avatar,
          }}
          rounded
          activeOpacity={0.7}
          containerStyle={{
            alignSelf: 'center',
            backgroundColor: '#E5E5E5',
            marginTop: 5,
            marginBottom: 5,
          }}
        />
        {action === 'Driver Earning' && (
          <View style={styles.titlesubtitleview}>
            <Text style={styles.titleText}>
              You have Recived{' '}
              {`£${parseFloat(Item?.bookingId?.selectedQuoteId?.price).toFixed(
                2,
              )}`}
            </Text>
            <Text style={styles.dateText}>
              {moment(createdAt).format('llll')}
            </Text>
          </View>
        )}

        {action === 'Tip' && (
          <View style={styles.titlesubtitleview}>
            <Text style={styles.titleText}>
              You have Recived Tip {`£${parseFloat(amount).toFixed(2)}`}
            </Text>
            <Text style={styles.dateText}>
              {moment(createdAt).format('llll')}
            </Text>
          </View>
        )}
        {action === 'Pending Withdrawal Request' && (
          <View style={styles.titlesubtitleview}>
            <Text style={styles.titleText}>
              You have Request payout of {`£${amount}`}{' '}
            </Text>
            <Text style={styles.dateText}>
              {moment(createdAt).format('llll')}
            </Text>
          </View>
        )}
        {action === 'PAYMENT IS DECLINE' && (
          <View style={styles.titlesubtitleview}>
            <Text style={styles.titleText}>
              Your Payment Request has been declined {`£${amount}`}
            </Text>
            <Text style={styles.dateText}>
              {moment(createdAt).format('llll')}
            </Text>
          </View>
        )}
        {action === 'Withdrawal' && (
          <View style={styles.titlesubtitleview}>
            <Text style={styles.titleText}>
              You have Withdrawal {`£${amount}`}
            </Text>
            <Text style={styles.dateText}>
              {moment(createdAt).format('llll')}
            </Text>
          </View>
        )}
        {action === 'PARTIAL AMOUNT PAID' && (
          <View style={styles.titlesubtitleview}>
            <Text style={styles.titleText}>
              Your PARTIAL AMOUNT PAID {`£${amount}`}
            </Text>
            <Text style={styles.dateText}>
              {moment(createdAt).format('llll')}
            </Text>
          </View>
        )}
      </View>
      <Text
        style={{
          ...styles.actionText,
          color:
            action === 'Driver Earning' || action === 'Tip' ? 'green' : 'red',
          fontWeight: 'bold',
        }}>
        {`£${parseFloat(amount).toFixed(2)}`}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    alignSelf: 'center',
    marginTop: 5,
    paddingHorizontal: 5,
    borderRadius: 10,
    width: '90%',
    justifyContent: 'space-between',
    paddingVertical: 0,
    flexDirection: 'row',
  },
  titlesubtitleview: {
    width: '100%',
    flexDirection: 'column',

    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  titleText: {
    fontFamily: 'RaleWay-Bold',
    fontSize: 15,
    color: '#1E2432',
  },
  subtitleText: {
    fontFamily: 'RaleWay-Medium',
    fontSize: 12,
    marginTop: 1.5,
    color: '#7D7D7D',
  },
  dateText: {
    fontFamily: 'RaleWay-Medium',
    fontSize: 11,
    marginTop: 3,
    color: '#ADADAD',
  },
  actionText: {
    alignSelf: 'center',
    textAlign: 'center',
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 13,
  },
});

export default ProfessionalTransicationItem;
