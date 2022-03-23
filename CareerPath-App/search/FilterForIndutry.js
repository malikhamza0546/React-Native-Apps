import React, {useState, useEffect, useCallback} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
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
import CustomBackHeader from '../../headers/custom-header-back-button';
import Accordion from './Accordion';
import RangeSlider from './RangeSlider';
import {ScrollView} from 'react-native-gesture-handler';
import axios from 'axios';
import {_BASE_URL} from '../../../../env';
import {navigationRef} from '../../../Rootnavigator';
const FilterForIndutry = ({navigation, route}) => {
  const [catagorystates, setCatagorystates] = useState([
    {
      radioSortBy: null,
      radioPrice: [],
      industry: [],
      search: null,
    },
  ]);

  const [industry, setIndustry] = useState([]);

  const SortByHandler = resLabel => {
    var arrayCopy = [...catagorystates];
    var objCopy = {...arrayCopy[0]};
    var objCopy1 = {...objCopy, radioSortBy: resLabel};
    setCatagorystates([objCopy1]);
  };

  const PriceHandler = resLabel => {
    var value = resLabel;
    value = value.split(',');

    var arrayCopy = [...catagorystates];
    var objCopy = {...arrayCopy[0]};
    var objCopy1 = {...objCopy, radioPrice: value};
    setCatagorystates([objCopy1]);
  };

  const handleChangeForIndustry = (id, indexer) => {
    //for handling value of our actual state
    var arrayCopy = [];
    var tempIndustryCopy = [];
    var objCopy = {};
    arrayCopy = [...catagorystates];
    var objCopy = {...arrayCopy[0]};
    tempIndustryCopy = [...objCopy.industry];
    if (!catagorystates[0].industry.includes(String(id))) {
      objCopy = {
        ...objCopy,
        industry: [...tempIndustryCopy, id],
      };
    }
    arrayCopy = [{...objCopy}];
    setCatagorystates(arrayCopy);
    // for hanling checkbox status value
    var industryCopy = [...industry];
    const new_industry = industryCopy.map(obj => {
      if (obj.id === id) {
        const new_status = obj.status ? false : true;
        const new_id = obj.id;
        if (!new_status) {
          let values = [...catagorystates];
          let objCopy = {...values[0]};
          let tempIndustryCopy = [...objCopy.industry];
          const element_index = tempIndustryCopy.indexOf(id);
          tempIndustryCopy.splice(element_index, 1);
          objCopy = {...objCopy, industry: [...tempIndustryCopy]};
          values = [{...objCopy}];
          setCatagorystates(values);
        }
        return {id: new_id, status: new_status};
      } else {
        return {id: obj.id, status: obj.status};
      }
    });
    setIndustry(new_industry);
  };

  // const setIndustriesData = data => {
  //   const dataArr = [];
  //   data.forEach(item => {
  //     dataArr.push({
  //       id: item.id,
  //       status: catagorystates[0].industry.includes(String(item.id))
  //         ? true
  //         : false,
  //     });
  //   });
  //   setIndustry(dataArr);
  // };

  const getResults = () => {
    let searchData = null;
    let industryId = null;
    let startPrice = null;
    let endPrice = null;
    let sort = null;
    if (catagorystates[0].search === null) {
      searchData = null;
    }
    if (catagorystates[0].search !== null) {
      searchData = catagorystates[0].search;
    }
    if (catagorystates[0].radioSortBy === null) {
      sort = null;
    }
    if (catagorystates[0].radioSortBy !== null) {
      sort = catagorystates[0].radioSortBy;
    }
    if (catagorystates[0].radioPrice.length < 1) {
      startPrice = null;
      endPrice = null;
    }
    if (catagorystates[0].radioPrice.length > 0) {
      startPrice = catagorystates[0].radioPrice[0];
      endPrice = catagorystates[0].radioPrice[1];
    }
    if (catagorystates[0].industry.length < 1) {
      console.log('error block');
      industryId = null;
    }
    if (catagorystates[0].industry.length > 0) {
      industryId = '';
      for (let i = 0; i < catagorystates[0].industry.length; i++) {
        industryId = industryId + catagorystates[0].industry[i] + ',';
      }
      if (industryId[industryId.length - 1] === ',') {
        industryId = industryId.substring(0, industryId.length - 1);
      }
    }

    axios
      .get(
        `${_BASE_URL}/professionals/?industry_id=${industryId}&end_price=${endPrice}&start_price=${startPrice}&sortby=${sort}&search=${searchData}`,
      )
      .then(response => {
        navigation.navigate('SearchScreen', {
          data: response.data,
          catagorystates: catagorystates,
          Industry: industry,
        });
      })
      .catch(e => {
        console.log('catch block is runing');
      });
  };
  const setIndustriesData = data => {
    const dataArr = [];

    data.forEach(item => {
      dataArr.push({
        id: item.id,
        status: array[0].industry.includes(String(item.id)) ? true : false,
      });
    });
    setIndustry(dataArr);
    console.log(industry, 'array sort industry');
  };
  useEffect(() => {
    axios
      .get(`${_BASE_URL}/Industry`)
      .then(response => {
        setIndustriesData(response.data);
      })
      .catch(e => {
        console.log('Error is identified');
      });
  }, []);

  return (
    <View>
      {console.log(industry, 'industry')}
      <View
        style={{
          marginHorizontal: scale(14),
        }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Accordion
            SortByHandler={SortByHandler}
            handleChangeForIndustry={handleChangeForIndustry}
            catagorystates={catagorystates}
            industry={industry}
          />
          <RangeSlider />
          <TouchableOpacity
            onPress={() => getResults()}
            style={{
              ...styles.button,
              width: '88%',
              marginRight: scale(7),
              backgroundColor: '#00C1FF',
            }}>
            <Text
              style={{
                fontSize: scale(16),
                fontFamily: MAIN_FONT,
                fontSize: 17,
                color: '#ffffff',
                fontWeight: '700',
              }}>
              Submit
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#00B3FF',
    alignSelf: 'center',
    height: scale(45),
    justifyContent: 'center',
    borderRadius: 5,
  },
});

export default FilterForIndutry;
