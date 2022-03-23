import React, {useState, useEffect, useCallback} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {List} from 'react-native-paper';
import CheckBox from 'react-native-check-box';
import Icon from 'react-native-vector-icons/Ionicons';
import Slider from 'rn-range-slider';
import {scale} from '../../helpers/Scaling';
import {colors} from 'react-native-elements';
import {_BASE_URL} from '../../../../env';
import {
  MAIN_ORANGE,
  MAIN_WHITE,
  SECONDARY_COOL_GRAY,
  MAIN_BLUE,
  SECONDARY_BLUE,
  SECONDARY_BLACK,
  SECONDARY_COOL_GRAY_2,
  MAIN_BLACK,
  MAIN_FONT,
  MAIN_FONT_BOLD,
} from '../../../resources/colors/colors';
import {connect} from 'react-redux';
const Accordion = props => {
  console.log(
    props.RadioSortByHandler,
    'redux props.state props.RadioSortByHandler',
  );
  const [accordStatus, setAccordStatus] = useState({
    SortAccord: false,
    industryAccord: false,
  });

  const [filters, setFilters] = useState([
    {
      label: 'Sort By',
      boxes: [
        {
          label: 'Recommended',
          actualValue: 'recommended',
        },
        {
          label: 'Price:High-Low',
          actualValue: 'highToLow',
        },
        {
          label: 'Price:Low-High',
          actualValue: 'lowToHigh',
        },
        {
          label: 'Newest',
          actualValue: 'newest',
        },
      ],
    },
    {
      label: 'Price',
      boxes: [
        {
          label: '$0-$100',
          actualValue: '0,100',
        },
        {
          label: '$100-$200',
          actualValue: '100,200',
        },
        {
          label: '$300-$400',
          actualValue: '300,400',
        },
        {
          label: '$500+',
          actualValue: '500,50000',
        },
      ],
    },
    {
      label: 'Industry',
      boxes: [],
    },
  ]);
  const SortAccrodionHandler = () => {
    let sortAccordCopy = accordStatus.SortAccord;
    setAccordStatus({
      SortAccord: !sortAccordCopy,
      industryAccord: false,
    });
  };
  const IndustryAccrodionHandler = () => {
    let industryAccordCopy = accordStatus.industryAccord;
    setAccordStatus({
      SortAccord: false,
      industryAccord: !industryAccordCopy,
    });
  };

  useEffect(() => {
    fetch(`${_BASE_URL}/industry`)
      .then(response => {
        return response.json();
      })
      .then(response => {
        var arrayCopyoffilters = [];
        var arrayCopyofboxes = [];
        var objCopyoffilterindex2 = {};
        var objCopyoffilterindexofall = {};
        var objCopy = {};
        arrayCopyoffilters = [...filters];
        objCopyoffilterindexofall = {...arrayCopyoffilters};
        objCopyoffilterindex2 = {...arrayCopyoffilters[2]};
        arrayCopyofboxes = [...response];
        objCopyoffilterindex2 = {
          ...objCopyoffilterindex2,
          boxes: arrayCopyofboxes,
        };
        arrayCopyoffilters = [
          arrayCopyoffilters[0],
          arrayCopyoffilters[1],
          objCopyoffilterindex2,
        ];
        setFilters(arrayCopyoffilters);
      });
  }, []);
  return (
    <List.Section>
      <View
        style={{
          marginVertical: scale(5),
        }}>
        <List.Accordion
          style={{
            backgroundColor: '#ffffff',
            borderRadius: scale(7.7),
          }}
          titleStyle={{
            fontSize: scale(17),
            paddingLeft: scale(15),
            fontFamily: MAIN_FONT,
            color: '#6A6A6A',
          }}
          expanded={accordStatus.SortAccord}
          onPress={SortAccrodionHandler}
          title="Sort By">
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                width: '100%',
                marginTop: scale(5),
              }}>
              {filters[0].boxes.map(res => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      props.RadioSortByHandler(res.actualValue);
                    }}>
                    <View key={res.label} style={styles.container}>
                      <TouchableOpacity
                        onPress={() => {
                          props.RadioSortByHandler(res.actualValue);
                        }}
                        style={styles.radioCircle}>
                        {props.value[0]?.radioSortBy === res.actualValue && (
                          <View style={styles.selectedRb} />
                        )}
                      </TouchableOpacity>
                      <Text style={styles.radioText}>{res.label}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </List.Accordion>
      </View>

      <View
        style={{
          marginVertical: scale(5),
        }}>
        <List.Accordion
          style={{backgroundColor: '#ffffff', borderRadius: scale(7.7)}}
          titleStyle={{
            fontSize: scale(17),
            paddingLeft: scale(15),
            fontFamily: MAIN_FONT,
            color: '#6A6A6A',
          }}
          expanded={accordStatus.industryAccord}
          onPress={IndustryAccrodionHandler}
          title="Industry">
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                width: '100%',
                marginTop: scale(5),
              }}>
              {filters[2].boxes.map((res, i) => {
                {
                  console.log(res.id, 'res id');
                }
                return (
                  <TouchableOpacity
                    onPress={() => props.RadioIndustryByHandler(res.id)}>
                    <View key={res.name} style={styles.container1}>
                      <CheckBox
                        key="1"
                        isChecked={
                          props.industry === []
                            ? false
                            : props.industry[i]?.status
                        }
                        checkBoxColor={SECONDARY_COOL_GRAY_2}
                        onClick={() => props.handleChangeForIndustry(res.id)}
                        checkedImage={
                          <Icon color={'#00C1FF'} name="checkbox" size={30} />
                        }
                        unCheckedImage={
                          <Icon
                            color={SECONDARY_COOL_GRAY_2}
                            name="md-square-outline"
                            size={30}
                          />
                        }
                      />
                      <Text style={styles.checkText}>{res.name}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </List.Accordion>
      </View>
    </List.Section>
  );
};
const styles = StyleSheet.create({
  container: {
    marginBottom: scale(10),
    alignItems: 'center',
    flexDirection: 'row',
  },
  container1: {
    marginBottom: scale(5),
    alignItems: 'center',
    flexDirection: 'row',
  },
  radioText: {
    marginLeft: scale(10),
    fontSize: 17,
    color: '#4B4B4B',
    fontFamily: MAIN_FONT,
    fontWeight: '700',
    // paddingLeft: scale(15),
    // marginLeft: scale(15),
  },
  checkText: {
    marginLeft: scale(10),
    fontSize: 17,

    color: '#4B4B4B',
    fontWeight: '700',
    fontFamily: MAIN_FONT,
    // paddingLeft: scale(15),
  },
  radioCircle: {
    height: 30,
    width: 30,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#00C1FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRb: {
    width: 15,
    height: 15,
    borderRadius: 50,
    backgroundColor: '#00C1FF',
  },
  result: {
    marginTop: 20,
    color: 'white',
    fontWeight: '600',
    backgroundColor: '#F3FBFE',
  },
});
const mapStateToProps = state => {
  console.log('mapStateToProps');
  return {value: state.catagorystatesReducer};
};

const mapDispatchToProps = dispatch => {
  console.log('mapDispatchToProps');
  console.log(dispatch);
  return {
    // dispatching plain actions
    RadioSortByHandler: value =>
      dispatch({type: 'RadioSortBy', resLabel: value}),
    RadioIndustryByHandler: value =>
      dispatch({type: 'RadioIndustry', resLabel: value}),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Accordion);
