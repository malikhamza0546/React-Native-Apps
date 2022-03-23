import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {Avatar} from 'react-native-elements';

const TransicationsHeader = props => {
  const {firstName} = props?.userinfo;
  const balance = props?.userinfo?.wallet?.balance;
  const {avatar} = props?.userinfo;

  return (
    <View style={styles.mainView}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 15,
        }}>
        <Avatar
          size={70}
          rounded
          source={{
            uri: avatar,
          }}
          activeOpacity={0.7}
          containerStyle={{
            height: 50,
            width: 50,
            alignSelf: 'center',
            backgroundColor: '#E5E5E5',
            marginLeft: 8,
          }}
        />
        <View style={{marginHorizontal: 10}}>
          <Text
            style={{fontFamily: 'UberMove-Medium', color: 'rgba(0,0,0,.6)'}}>
            Hello,
          </Text>
          <Text
            numberOfLines={1}
            ellipsizeMode={'middle'}
            style={{
              fontFamily: 'UberMove-Bold',
              fontSize: 16,
              width: '100%',
              color: 'rgba(0,0,0,0.6)',
              fontWeight: 'bold',
            }}>
            {firstName}
          </Text>
        </View>
      </View>
      <View style={{marginTop: 7}}>
        <Text
          style={{
            fontFamily: 'UberMove-Medium',
            textAlign: 'right',
            color: 'rgba(0,0,0,.6)',
          }}>
          Your Balance
        </Text>
        <Text
          style={{
            fontFamily: 'UberMove-Bold',
            textAlign: 'right',
            fontSize: 16,
            color: 'rgba(0,0,0,0.6)',
            fontWeight: 'bold',
          }}>
          {balance && `£${parseFloat(balance).toFixed(2)}`}
        </Text>
      </View>
    </View>
  );
};

export default TransicationsHeader;

const styles = StyleSheet.create({
  mainView: {
    height: 70,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0)',
    flexDirection: 'row',
  },
});
