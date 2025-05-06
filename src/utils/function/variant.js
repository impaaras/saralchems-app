import {useDispatch} from 'react-redux';
import {selectVariant} from './function';

const dispatch = useDispatch();
export function variantSelection(variant, index, idx, childId) {
  selectVariant(dispatch, variant, index, idx);
}

export function showVariantSelection() {}
