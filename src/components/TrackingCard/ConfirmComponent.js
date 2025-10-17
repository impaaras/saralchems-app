import {StyleSheet, Text, View, TouchableWithoutFeedback} from 'react-native';
import React from 'react';
import {
  isSmallScreen,
  moderateScale,
  scale,
  wp,
} from '../../utils/Responsive/responsive';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/FontAwesome5';
import {useAlert} from '../../context/CustomAlertContext';

const ConfirmComponent = ({
  handleReworkOrder,
  handleConfirmOrder,
  handleInvoiceConfirmOrder,
}) => {
  return (
    <View style={styles.confirmContainer}>
      <Text style={styles.confirmText}>Check Invoice and Confirm</Text>

      {/* Invoice Button */}
      <TouchableWithoutFeedback onPress={handleInvoiceConfirmOrder}>
        <View>
          <LinearGradient
            colors={['#FFF', '#FFF']}
            start={{x: 0, y: 0}}
            end={{x: 0, y: 1}}
            style={[
              styles.buttonContentConfirm,
              {
                borderWidth: 1,
                borderColor: '#E0E0E0',
                borderRadius: moderateScale(20),
                paddingVertical: moderateScale(10),
                marginBottom: moderateScale(10),
                paddingHorizontal: moderateScale(20),
              },
            ]}>
            <Icon2 name="file-pdf" size={16} color="#000" />
            <Text style={[styles.buttonText, {color: '#000'}]}>Invoice</Text>
          </LinearGradient>
        </View>
      </TouchableWithoutFeedback>

      {/* Confirmation Section */}
      <View style={styles.confirm}>
        <View style={styles.confirmButtonContainer}>
          {/* Confirm Button */}
          <TouchableWithoutFeedback onPress={handleConfirmOrder}>
            <View style={styles.confirmButton}>
              <LinearGradient
                colors={['#2D4565', '#2D4565', '#1B2B48', '#1B2B48']}
                start={{x: 0, y: 0}}
                end={{x: 0, y: 1}}
                style={styles.confirmWithLinear}>
                <Text style={styles.buttonText}>Confirm</Text>
              </LinearGradient>
            </View>
          </TouchableWithoutFeedback>

          {/* Rework Button */}
          <TouchableWithoutFeedback onPress={handleReworkOrder}>
            <View style={styles.confirmButton}>
              <LinearGradient
                colors={['#FFF', '#FFF']}
                start={{x: 0, y: 0}}
                end={{x: 0, y: 1}}
                style={[
                  styles.buttonContentConfirm,
                  {
                    borderWidth: 1,
                    borderColor: '#E0E0E0',
                    borderRadius: moderateScale(20),
                  },
                ]}>
                <Text style={[styles.buttonText, {color: '#000'}]}>Rework</Text>
              </LinearGradient>
            </View>
          </TouchableWithoutFeedback>
        </View>

        {/* Support Section */}
        <View style={styles.social}>
          <Text style={styles.supportText}>Need support?</Text>

          <View style={styles.socialMediaContainer}>
            {/* Call */}
            <TouchableWithoutFeedback>
              <View style={styles.socialMedia}>
                <LinearGradient
                  colors={['#2D4565', '#2D4565', '#1B2B48', '#1B2B48']}
                  start={{x: 0, y: 0}}
                  end={{x: 0, y: 1}}
                  style={styles.buttonContent}>
                  <Icon name="phone" size={16} color="#FFF" />
                  <Text style={styles.buttonText}>Call</Text>
                </LinearGradient>
              </View>
            </TouchableWithoutFeedback>

            {/* WhatsApp */}
            <TouchableWithoutFeedback>
              <View style={styles.socialMedia}>
                <LinearGradient
                  colors={['#2D4565', '#2D4565', '#1B2B48', '#1B2B48']}
                  start={{x: 0, y: 0}}
                  end={{x: 0, y: 1}}
                  style={styles.buttonContent}>
                  <Icon name="whatsapp" size={16} color="#FFF" />
                  <Text style={styles.buttonText}>Whatsapp</Text>
                </LinearGradient>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ConfirmComponent;

const styles = StyleSheet.create({
  confirmContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: moderateScale(5),
    marginHorizontal: scale(12),
  },
  confirmText: {
    fontSize: moderateScale(13),
    fontWeight: '500',
    color: '#333',
    marginBottom: moderateScale(5),
  },
  confirm: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: wp(3),
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: moderateScale(10),
  },
  confirmButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: moderateScale(10),
    width: '70%',
    marginBottom: moderateScale(20),
    marginTop: moderateScale(20),
  },
  confirmButton: {
    flex: 1,
    borderRadius: wp(25),
  },
  buttonContentConfirm: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: moderateScale(8),
    paddingHorizontal: moderateScale(8),
  },
  buttonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: moderateScale(6),
    paddingHorizontal: moderateScale(14),
    borderRadius: wp(25),
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: moderateScale(12),
    marginLeft: moderateScale(6),
  },
  social: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  supportText: {
    fontSize: moderateScale(14),
    color: '#444',
  },
  socialMediaContainer: {
    flexDirection: 'row',
    gap: moderateScale(10),
    width: '60%',
  },
  socialMedia: {
    borderRadius: wp(25),
  },
  confirmWithLinear: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp(25),
  },
});
