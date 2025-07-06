import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Dimensions,
  Animated,
} from 'react-native';
import {InfoIcon} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import ScrollImage from '../ScrollImage/Index';
import Icon from 'react-native-vector-icons/Entypo';
import {
  scale,
  wp,
  hp,
  isTablet,
  isSmallScreen,
  formatDate,
  moderateScale,
} from '../../utils/Responsive/responsive';
import styles from './TrackingCard.styles';
import axios from 'axios';

import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {ROUTES} from '../../constants/routes';
import {useAlert} from '../../context/CustomAlertContext';
import {useLoader} from '../../context/LoaderContext';
import InvoiceModal from '../Invoice/Invoice';
import {storage} from '../../utils/storage';
import {API_URL} from '../../utils/ApiService';

const TrackingCard = ({index, order}) => {
  const [expandedOrders, setExpandedOrders] = useState([]);
  const [showInvoice, setShowInvoice] = useState(false);
  const [processing, setProcessing] = useState(false);
  const {setLoading} = useLoader();
  const [selectedInvoiceData, setSelectedInvoiceData] = useState(false);
  const [activeTab, setActiveTab] = useState('All Orders');
  const [orders, setOrders] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownAnimation] = useState(new Animated.Value(0));
  // const {orderInvoice, loading} = useSelector(
  //   state => state.invoiceSlice.history,
  // );

  const [error, setError] = useState(null);
  const [reworkModalVisible, setReworkModalVisible] = useState(false);
  const [reworkReason, setReworkReason] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const navigation = useNavigation();
  const {showAlert} = useAlert();
  const [invoiceData, setInvoiceData] = useState(null);

  const handleInvoiceConfirmOrder = orderInvoice => {
    setInvoiceData(orderInvoice);
    setShowInvoice(true);
  };

  const handleInvoiceReworkOrder = orderId => {
    setShowInvoice(true);
  };

  const getStatusColor = status => {
    switch (status) {
      case 'Delivered':
        return '#4CAF50';
      case 'Quote Sent':
        return '#FF9800';
      case 'Confirmed':
        return '#2196F3';
      case 'Processing':
        return '#FF9800';
      case 'Shipped':
        return '#2196F3';
      case 'Rework':
        return '#F44336';
      default:
        return '#757575';
    }
  };
  const toggleOrderExpand = orderId => {
    setExpandedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId],
    );
  };

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    const token = storage.getString(StorageKeys.AUTH_TOKEN);
    try {
      const response = await axios.get(`${API_URL}/order/user-orders`, {
        headers: {Authorization: `Bearer ${token}`},
      });
      setOrders(response.data);

      setLoading(false);
    } catch (error) {
      console.log(error, 'error message');
      setError('Failed to load orders. Please try again.');
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, []),
  );

  const updateOrderStatus = async (orderId, status, reason = null) => {
    setProcessing(true);
    const token = storage.getString(StorageKeys.AUTH_TOKEN);

    try {
      setLoading(true);
      const payload = {status};
      if (reason) {
        payload.reason = reason;
      }

      const response = await axios.patch(
        `${API_URL}/order/user-status/${orderId}`,
        payload,
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );

      // Show success message using custom alert instead of Alert.alert
      showAlert({
        title: status === 'Confirmed' ? 'Order Confirmed' : 'Rework Requested',
        message:
          status === 'Confirmed'
            ? 'Your order has been confirmed and is being processed.'
            : 'Your rework request has been submitted.',
        onAccept: () => {
          // Refresh orders after confirmation
          fetchOrders();
        },
        acceptText: 'OK',
        rejectText: '', // Hide cancel button by not providing rejectText
      });

      // Refresh orders
      fetchOrders();
    } catch (error) {
      console.log('Update status error:', error.response?.data || error);

      // Show error using custom alert instead of Alert.alert
      showAlert({
        title: 'Error',
        message:
          error.response?.data?.message || 'Failed to update order status.',
        acceptText: 'OK',
        rejectText: '', // Hide cancel button
      });
    } finally {
      setProcessing(false);
      setLoading(false);
      if (status === 'Rework') {
        setReworkModalVisible(false);
        setReworkReason('');
      }
    }
  };

  // Handle confirm button press
  const handleConfirmOrder = orderId => {
    // Using custom alert instead of Alert.alert
    showAlert({
      title: 'Confirm Order',
      message: 'Are you sure you want to confirm this order?',
      onConfirm: () => updateOrderStatus(orderId, 'Confirmed'),
      acceptText: 'Confirm',
      rejectText: 'Cancel',
    });
  };

  // Handle rework button press
  const handleReworkOrder = orderId => {
    setSelectedOrderId(orderId);
    setReworkModalVisible(true);
  };

  // Submit rework request with reason
  const submitReworkRequest = () => {
    if (!reworkReason.trim()) {
      // Using custom alert for validation error
      showAlert({
        title: 'Required',
        message: 'Please provide a reason for the rework request.',
        acceptText: 'OK',
        rejectText: '', // Hide cancel button
      });
      return;
    }
    updateOrderStatus(selectedOrderId, 'Rework', reworkReason);
  };
  const handleTrackingPress = order => {
    navigation.navigate(ROUTES.TRACKING, {orders: order});
  };

  return (
    <View key={index} style={[styles.orderCard]}>
      <View style={[styles.orderHeader]}>
        <View style={[styles.orderDetails]}>
          <View>
            <TouchableOpacity onPress={() => handleTrackingPress(order)}>
              <Text style={[styles.orderIdText]}>
                Order #{order?._id.slice(-9)}
              </Text>
            </TouchableOpacity>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor: getStatusColor(order.status),
                    borderRadius: wp(1.25),
                    marginRight: wp(2),
                  },
                ]}
              />
              <Text style={[styles.orderStatus, {flex: 1}]}>
                {order.status}
              </Text>
            </View>
          </View>

          <View>
            <Text style={[styles.orderDateText]}>
              Placed on {formatDate(order.createdAt)}
            </Text>
            {order.isPartialOrder && (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <InfoIcon
                  name="info-with-circle"
                  size={
                    isTablet ? scale(20) : isSmallScreen ? scale(16) : scale(18)
                  }
                  color="#101924"
                />
                <Text
                  style={{
                    fontSize: isTablet
                      ? moderateScale(15)
                      : isSmallScreen
                      ? moderateScale(10)
                      : moderateScale(12),
                    color: 'black',
                    flex: 1,
                    marginLeft: wp(0.8),
                  }}>
                  Partial Order
                </Text>
              </View>
            )}
          </View>
        </View>
        <View
          style={{
            backgroundColor: '#3C5D87',
            borderRadius: 10,
          }}>
          <View
            style={{
              backgroundColor: '#FFF',
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
            }}>
            {!expandedOrders.includes(order._id) && order.items.length > 0 && (
              <View>
                <View style={[styles.orderItem]}>
                  <ScrollImage
                    product={order.items[0]?.productId}
                    reffer="cart"
                  />
                  <View style={[styles.productDetails]}>
                    <View>
                      <Text style={[styles.productName]}>
                        {order.items[0].productId.name}
                      </Text>
                      <Text style={[styles.productSize]}>
                        <Text style={{fontWeight: '600'}}>Variant</Text>:{' '}
                        {order.items[0].variant}
                      </Text>
                    </View>
                    <View>
                      <Text style={[styles.productQuantity]}>
                        Quantity: {order.items[0].quantity}
                      </Text>
                    </View>
                  </View>
                  {order.items.length > 1 && (
                    <View>
                      <LinearGradient
                        colors={['#38587F', '#101924']}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 0}}
                        style={[styles.ratingContainer]}>
                        <Text style={[styles.ratingText]}>
                          +{order.items.length - 1}
                        </Text>
                      </LinearGradient>
                    </View>
                  )}
                </View>
              </View>
            )}

            {expandedOrders.includes(order._id) && (
              <View>
                {order.items.map((item, itemIndex) => (
                  <View key={itemIndex} style={[styles.orderItem]}>
                    <ScrollImage
                      product={order.items[itemIndex]?.productId}
                      reffer="cart"
                    />
                    <View style={[styles.productDetails]}>
                      <View>
                        <Text style={[styles.productName]}>
                          {order.items[itemIndex].productId.name}
                        </Text>
                        <Text style={[styles.productSize]}>
                          <Text style={{fontWeight: '600'}}>Variant</Text>:{' '}
                          {order.items[itemIndex].variant}
                        </Text>
                      </View>
                      <View>
                        <Text style={[styles.productQuantity]}>
                          Quantity: {order.items[itemIndex].quantity}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
          {order.items.length > 1 && (
            <TouchableOpacity
              onPress={() => toggleOrderExpand(order._id)}
              style={{
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
                marginTop: -10,
                paddingTop: hp(0.9),
              }}>
              <Icon
                name={
                  expandedOrders.includes(order._id)
                    ? 'chevron-up'
                    : 'chevron-down'
                }
                style={{alignSelf: 'center'}}
                size={isTablet ? 28 : isSmallScreen ? 20 : 24}
                color="#fff"
              />
            </TouchableOpacity>
          )}
        </View>
        <View style={{marginTop: hp(1.2)}}>
          {
            // order.status === 'Invoice Uploaded' ||
            order.status === 'Quote Sent' ||
            order.status === 'Partially Fulfilled' ? (
              <View
                style={{
                  flexDirection: isSmallScreen ? 'column' : 'row',
                  justifyContent: 'space-around',
                }}>
                <LinearGradient
                  colors={['#101924', '#38587F']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={[styles.confirmButton]}>
                  <TouchableOpacity
                    style={[styles.quoteButton]}
                    onPress={() => handleConfirmOrder(order._id)}
                    disabled={processing}>
                    <Text
                      style={[
                        styles.quoteButtonText,
                        {
                          color: '#FFF',
                        },
                      ]}>
                      {processing ? 'Processing...' : 'Confirm'}
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>
                <LinearGradient
                  colors={['#FFF', '#FFF']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={[
                    styles.confirmButton,
                    {
                      borderColor: '#101924',
                      borderWidth: 1,
                    },
                  ]}>
                  <TouchableOpacity
                    style={[styles.quoteButton]}
                    onPress={() => handleReworkOrder(order._id)}
                    disabled={processing}>
                    <Text
                      style={[
                        styles.quoteButtonText,
                        {
                          color: '#101924',
                        },
                      ]}>
                      {processing ? 'Processing...' : 'Rework'}
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            ) : null
          }
        </View>
        <View style={{flex: 1}}>
          {!showInvoice ? (
            <View style={{flex: 1}}>
              <View style={{marginTop: hp(1.2)}}>
                {order.status === 'Invoice Uploaded' ? (
                  <View
                    style={{
                      flexDirection: isSmallScreen ? 'column' : 'row',
                      justifyContent: 'space-around',
                      //   gap: isSmallScreen ? hp(1) : 0,
                    }}>
                    <LinearGradient
                      colors={['#101924', '#38587F']}
                      start={{x: 0, y: 0}}
                      end={{x: 1, y: 0}}
                      style={[styles.confirmButton]}>
                      <TouchableOpacity
                        style={[styles.quoteButton]}
                        onPress={() =>
                          handleInvoiceConfirmOrder(order?.invoice)
                        }
                        disabled={processing}>
                        <Text
                          style={[
                            styles.quoteButtonText,
                            {
                              color: '#FFF',
                            },
                          ]}>
                          {processing ? 'Processing...' : 'View the Invoice'}
                        </Text>
                      </TouchableOpacity>
                    </LinearGradient>
                    <LinearGradient
                      colors={['#FFF', '#FFF']}
                      start={{x: 0, y: 0}}
                      end={{x: 1, y: 0}}
                      style={[
                        styles.confirmButton,
                        {
                          borderColor: '#101924',
                          borderWidth: 1,
                        },
                      ]}>
                      <TouchableOpacity
                        style={[styles.quoteButton]}
                        onPress={() => handleInvoiceReworkOrder(order._id)}
                        disabled={processing}>
                        <Text
                          style={[
                            styles.quoteButtonText,
                            {
                              color: '#101924',
                            },
                          ]}>
                          {processing
                            ? 'Processing...'
                            : 'Download the Invoice'}
                        </Text>
                      </TouchableOpacity>
                    </LinearGradient>
                  </View>
                ) : null}
              </View>
            </View>
          ) : (
            <InvoiceModal
              visible={showInvoice}
              invoiceData={invoiceData}
              onClose={() => setShowInvoice(false)}
            />
          )}
        </View>
      </View>
      <Modal
        visible={reworkModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setReworkModalVisible(false);
          setReworkReason('');
        }}>
        <View style={[styles.modalContainer, {padding: wp(5)}]}>
          <View
            style={[
              styles.modalContent,
              {
                padding: wp(5),
                width: isTablet ? '80%' : '100%',
                maxWidth: isTablet ? 500 : 400,
              },
            ]}>
            <Text
              style={[
                styles.modalTitle,
                {
                  fontSize: isTablet ? 20 : 18,
                  marginBottom: hp(1.2),
                },
              ]}>
              Request Rework
            </Text>
            <Text
              style={[
                styles.modalSubtitle,
                {
                  fontSize: isTablet ? 16 : 14,
                  marginBottom: hp(1.8),
                },
              ]}>
              Please provide a reason for your rework request:
            </Text>
            <TextInput
              style={[
                styles.reasonInput,
                {
                  padding: wp(2.5),
                  marginBottom: hp(2.4),
                  height: hp(12),
                  fontSize: isTablet ? 16 : 14,
                },
              ]}
              placeholder="Enter reason for rework"
              multiline={true}
              numberOfLines={4}
              value={reworkReason}
              onChangeText={setReworkReason}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.cancelButton,
                  {
                    padding: hp(1.4),
                    marginHorizontal: wp(1.25),
                    width: isSmallScreen ? '100%' : '45%',
                  },
                ]}
                onPress={() => {
                  setReworkModalVisible(false);
                  setReworkReason('');
                }}>
                <Text
                  style={[
                    styles.cancelButtonText,
                    {
                      fontSize: isTablet ? 16 : 14,
                    },
                  ]}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <LinearGradient
                colors={['#101924', '#38587F']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={[
                  styles.confirmButton,
                  {
                    width: isSmallScreen ? '50%' : '45%',
                  },
                ]}>
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    styles.submitButton,
                    {
                      padding: hp(1.4),
                      marginHorizontal: wp(1.25),
                    },
                  ]}
                  onPress={submitReworkRequest}
                  disabled={processing}>
                  <Text
                    style={[
                      styles.submitButtonText,
                      {
                        fontSize: isTablet ? 16 : 14,
                      },
                    ]}>
                    {processing ? 'Submitting...' : 'Submit'}
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TrackingCard;
