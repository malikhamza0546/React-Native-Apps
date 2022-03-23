const Catagorystates = [
  {
    radioSortBy: null,
    radioPrice: ['0', '1000'],
    industry: [],
    search: null,
  },
];

export default function CatagorystatesReducer(
  catagorystates = Catagorystates,
  action,
) {
  // Check to see if the reducer cares about this action
  console.log('2nd');
  if (action.type === 'RadioSortBy') {
    // If so, make a copy of `state`
    var arrayCopy = [...catagorystates];
    var objCopy = {...arrayCopy[0]};
    var objCopy1 = [{...objCopy, radioSortBy: action.resLabel}];
    return objCopy1;
  }

  if (action.type === 'RadioIndustry') {
    // const handleChangeForIndustry = (id, indexer) => {
    //for handling value of our actual state
    var arrayCopy = [];
    var tempIndustryCopy = [];
    var objCopy = {};
    arrayCopy = [...catagorystates];
    var objCopy = {...arrayCopy[0]};
    tempIndustryCopy = [...objCopy.industry];
    if (!catagorystates[0].industry.includes(String(action.resLabel))) {
      objCopy = {
        ...objCopy,
        industry: [...tempIndustryCopy, action.resLabel],
      };
    }
    arrayCopy = [{...objCopy}];
    return arrayCopy;
  }

  if (action.type === 'PriceIndustry') {
    var value = action.resLabel;
    value = value.split(',');
    console.log('action type Price Industry');
    var arrayCopy = [...catagorystates];
    var objCopy = {...arrayCopy[0]};
    var objCopy1 = {...objCopy, radioPrice: value};
    return [objCopy1];
  }
  // otherwise return the existing state unchanged
  return catagorystates;
}
