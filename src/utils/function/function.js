import {setSelectedVariant} from '../../redux/slices/productSlice';

export const selectVariant = (dispatch, variant, index, idx) => {
  let newVariantName = '';
  if (index === undefined) {
    newVariantName = `${variant}`;
  } else if (idx === undefined) {
    newVariantName = `${variant}${index}`;
  } else {
    newVariantName = `${variant}${index}${idx}`;
  }
  dispatch(setSelectedVariant(newVariantName));
};
