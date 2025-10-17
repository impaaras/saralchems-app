import React from 'react';
import {TouchableWithoutFeedback, View, Text, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {moderateScale, scale, wp} from '../../../utils/Responsive/responsive';

const sizeStyles = {
  sm: {
    buttonWidth: scale('30%'),
    fontSize: moderateScale(8),
    paddingV: moderateScale(4),
    paddingH: moderateScale(8),
  },
  md: {
    buttonWidth: scale('45%'),
    fontSize: moderateScale(10),
    paddingV: moderateScale(6),
    paddingH: moderateScale(10),
  },
  lg: {
    buttonWidth: scale('60%'),
    fontSize: moderateScale(12),
    paddingV: moderateScale(8),
    paddingH: moderateScale(12),
  },
  elg: {
    buttonWidth: scale('80%'),
    fontSize: moderateScale(14),
    paddingV: moderateScale(10),
    paddingH: moderateScale(14),
  },
};

const CustomGradientButton = ({onPress, title, size = 'md'}) => {
  const currentSize = sizeStyles[size] || sizeStyles['md'];

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={[styles.confirmButton, {width: currentSize.buttonWidth}]}>
        <LinearGradient
          colors={['#2D4565', '#2D4565', '#1B2B48', '#1B2B48']}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
          style={[styles.confirmWithLinear]}>
          <Text
            style={[
              styles.buttonText,
              {
                fontSize: currentSize.fontSize,
                paddingVertical: currentSize.paddingV,
                paddingHorizontal: currentSize.paddingH,
              },
            ]}>
            {title}
          </Text>
        </LinearGradient>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  confirmButton: {
    borderRadius: wp(25),
  },
  confirmWithLinear: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp(25),
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default CustomGradientButton;
