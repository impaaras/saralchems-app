import {Platform, Vibration} from 'react-native';
import {setSelectedVariant} from '../../redux/slices/newCart';

export const triggerHaptic = type => {
  if (Platform.OS === 'ios') {
    // iOS Haptic Feedback
    const ReactNativeHapticFeedback = require('react-native-haptic-feedback');
    const options = {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    };

    switch (type) {
      case 'light':
        ReactNativeHapticFeedback?.trigger('impactLight', options);
        break;
      case 'medium':
        ReactNativeHapticFeedback?.trigger('impactMedium', options);
        break;
      case 'heavy':
        ReactNativeHapticFeedback?.trigger('impactHeavy', options);
        break;
      default:
        ReactNativeHapticFeedback?.trigger('selection', options);
    }
  } else {
    // Android Vibration fallback
    switch (type) {
      case 'light':
        Vibration.vibrate(10);
        break;
      case 'medium':
        Vibration.vibrate(20);
        break;
      case 'heavy':
        Vibration.vibrate(50);
        break;
      default:
        Vibration.vibrate(5);
    }
  }
};
export const selectVariant = (dispatch, variant, index, idx, childId) => {
  let newVariantName = '';
  if (index === undefined) {
    newVariantName = `${variant}`;
  } else if (idx === undefined) {
    newVariantName = `${variant}${index}`;
  } else {
    newVariantName = `${variant}AFTER${index}${idx}${childId}`;
  }
  dispatch(setSelectedVariant(newVariantName));
};

export const calculateTotal = (variant, quantity) => {
  const match = variant.match(/(\d+(\.\d+)?)\s*(kg|gm|ltr|ml)/i);
  if (!match) return `${quantity}`; // Fallback if no match

  const value = parseFloat(match[1]);
  const unit = match[3].toLowerCase();
  const total = value * quantity;

  if (unit === 'gm' && total >= 1000) {
    return `${total / 1000}kg`;
  }

  return `${parseFloat(total.toFixed(1))}${unit}`;
};
export const removeTrailingDigits = variant => {
  const match = variant?.match(/^\d+(\.\d+)?\s*(kg|gm|ml|ltr|ml)/i);
  return match ? match[0].replace(/\s+/, '') : '';
};
