import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  TextInput,
} from 'react-native';
import {
  MAIN_BLUE,
  MAIN_WHITE,
  MAIN_YELLOW,
  SECONDARY_BLUE,
  TEXT_INPUT_COLOR,
  MAIN_FONT,
  MAIN_FONT_BOLD,
} from '../../../resources/colors/colors';
import Slider from 'rn-range-slider';
import {scale} from '../../helpers/Scaling';
import {colors} from 'react-native-elements';
const THUMB_RADIUS = 12;
import {connect} from 'react-redux';
const Notch = props => {
  return <View style={styles.notch} {...props} />;
};

const Label = ({text}) => {
  return (
    <View style={styles.label}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const RailSelected = () => {
  return <View style={styles.railSelected} />;
};

const Thumb = () => {
  return <View style={styles.root} />;
};

const Rail = () => {
  return <View style={styles.rail} />;
};

const RangeSlider = props => {
  console.log(props.value, 'hamza');
  const renderThumb = useCallback(() => <Thumb />, []);
  const renderRail = useCallback(() => <Rail />, []);
  const renderRailSelected = useCallback(() => <RailSelected />, []);
  const renderLabel = useCallback(high => <Label text={high} />, []);
  const renderNotch = useCallback(() => <Notch />, []);
  const [number] = React.useState(`${props.value[0].radioPrice[0]}`);
  const [numberHigh] = React.useState(`${props.value[0].radioPrice[1]}`);
  const handleValueChange = useCallback((low, high) => {
    console.log(props.value[0].radioPrice[0], 'props.value[0].radioPrice[0]');
    console.log(props.value[0].radioPrice[1], 'props.value[0].radioPrice[1]');
    props.PriceIndustryHandler(`${low},${high}`);
  }, []);

  return (
    <View style={{marginTop: scale(10)}}>
      <Slider
        style={styles.slider}
        low={parseInt(props.value[0].radioPrice[0])}
        high={parseInt(props.value[0].radioPrice[1])}
        min={0}
        max={1000}
        step={1}
        floatingLabel
        renderThumb={renderThumb}
        renderRail={renderRail}
        renderRailSelected={renderRailSelected}
        renderLabel={renderLabel}
        renderNotch={renderNotch}
        onValueChanged={handleValueChange}
      />
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            flexDirection: 'row',
          }}>
          <Text
            style={{
              fontSize: scale(20),
              fontFamily: MAIN_FONT,
              color: '#6A6A6A',
            }}>
            Price
          </Text>
          <TextInput
            style={styles.input}
            value={`${parseInt(props.value[0].radioPrice[0])}`}
            placeholder="useless placeholder"
            keyboardType="numeric"
            onChangeText={text => {
              onChangeNumber(text);
            }}
          />
        </View>
        <View
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
          }}>
          <Text
            style={{
              fontSize: scale(15),
              fontFamily: MAIN_FONT,
              color: '#CBCBCB',
            }}>
            to{' '}
          </Text>
          <TextInput
            style={styles.input}
            value={`${parseInt(props.value[0].radioPrice[1])}`}
            placeholder="useless placeholder"
            keyboardType="numeric"
            onChangeText={text => {
              onChangeNumber_(text);
            }}
          />
        </View>
      </View>
    </View>
  );
};
const mapStateToProps = state => {
  console.log(state.catagorystatesReducer, 'mapStateToProps');
  return {value: state.catagorystatesReducer};
};

const mapDispatchToProps = dispatch => {
  console.log('mapDispatchToProps');
  console.log(dispatch);
  return {
    // dispatching plain actions
    PriceIndustryHandler: value =>
      dispatch({type: 'PriceIndustry', resLabel: value}),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(RangeSlider);
const styles = StyleSheet.create({
  input: {
    marginVertical: scale(12),
    marginHorizontal: scale(5),
    width: scale(90),
    borderWidth: 1,
    paddingVertical: scale(5),
    paddingLeft: scale(10),
    borderRadius: scale(4),
    borderColor: '#CBCBCB',
    fontSize: scale(15),
    fontFamily: MAIN_FONT,
    color: '#7A7A7A',
    backgroundColor: '#ffffff',
  },
  root: {
    width: THUMB_RADIUS * 2,
    height: THUMB_RADIUS * 2,
    borderRadius: THUMB_RADIUS,

    borderColor: 'red',

    backgroundColor: '#B6B6B6',
  },
  rail: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'white',
  },
  railSelected: {
    height: 4,
    backgroundColor: '#B6B6B6',
    borderRadius: 2,
  },
  label: {
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#4499ff',
    borderRadius: 4,
  },
  text: {
    fontSize: 16,
    color: '#fff',
  },
  notch: {
    width: 8,
    height: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#4499ff',
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 8,
  },
});
