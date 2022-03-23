import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {WebView} from 'react-native-webview';
import {HeaderTitle} from '../../components/HeaderTitle';
class Webview extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    // console.log(
    //   this.props.route?.params?.value?.stripe_url,
    //   'this.props.route?.params?.stripeFunction?.stripe_url',
    // );
    console.log(
      this.props.route?.params,
      'this.props.route?.params?stripeConnection',
    );
    return (
      <>
        <HeaderTitle
          style={{backgroundColor: 'red'}}
          title="My bookings"
          onPress={() => {
            // this.props.route?.params?.stripeConnection("");

            this.props.navigation.goBack();
          }}
        />
        <WebView
          source={{
            uri: this.props.route?.params?.value?.stripe_url,
          }}
          onNavigationStateChange={event => {
            if (event.url.indexOf('/stripe/account_link/return') >= 0) {
              this.props.route?.params?.stripeFunction;
              this.props.navigation.goBack();
            }
          }}
        />
      </>
    );
  }
}

export default Webview;
