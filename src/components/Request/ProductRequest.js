import {StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import React from 'react';
import {moderateScale, scale} from '../../utils/Responsive/responsive';
import {MessagesSquare} from 'lucide-react-native';
import {useRequest} from '../../context/RequestContext';
import RequestICon from '../../assets/icons/svg/request.svg';

const ProductRequest = () => {
  const {showAlert} = useRequest();

  const handleConfirmOrder = () => {
    // Using custom alert instead of Alert.alert
    showAlert({
      title: 'Confirm Order',
      message: 'Are you sure you want to confirm this order?',
      onConfirm: () => updateOrderStatus(order?._id, 'Confirmed'),
      acceptText: 'Confirm',
      rejectText: 'Cancel',
    });
  };

  return (
    <View style={styles.requestContainer}>
      <View>
        <Text style={styles.frqtxt}>Frequently ordered</Text>
      </View>
      <TouchableWithoutFeedback onPress={handleConfirmOrder}>
        <View style={styles.requestBtn}>
          <View style={styles.btnIcon}>
            <RequestICon width={14} height={14} style={{color: '#FFF'}} />
          </View>
          <Text style={styles.requestText}>Product request</Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default ProductRequest;

const styles = StyleSheet.create({
  requestContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: scale(20),
    marginRight: scale(10),
    marginBottom: scale(10),
  },
  frqtxt: {
    color: '#FFF',
    fontSize: scale(14),
    fontWeight: '600',
  },
  btnIcon: {
    backgroundColor: '#3D5E86',
    borderRadius: scale(30),
    padding: scale(6),
  },
  requestText: {
    fontSize: moderateScale(12),
    marginHorizontal: scale(5),
    fontWeight: '400',
  },
  requestBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    justifyContent: 'center',
    paddingHorizontal: scale(5),
    paddingVertical: scale(5),
    borderRadius: scale(30),
  },
});
