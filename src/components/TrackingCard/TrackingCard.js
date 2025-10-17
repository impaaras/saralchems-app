import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import {InfoIcon, Receipt} from 'lucide-react-native';
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
  verticalScale,
} from '../../utils/Responsive/responsive';
import styles from './TrackingCard.styles';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import {ROUTES} from '../../constants/routes';
import {useAlert} from '../../context/CustomAlertContext';
import {useLoader} from '../../context/LoaderContext';
import InvoiceModal from '../Invoice/Invoice';

import {storage, StorageKeys} from '../../utils/storage';
import {API_URL} from '../../utils/ApiService';
import ReworkModal from '../Rework/ReworkModal';
import ConfirmComponent from './ConfirmComponent';
import Colors from '../../assets/color';
import ReceiptIcon from '../../assets/icons/svg/bill.svg';
import BottomModal from './BottomModal';
import {addToCart} from '../../redux/slices/addToCartSlice';
import {useDispatch} from 'react-redux';

const TrackingCard = ({index, order, fetchOrders}) => {
  const [expandedOrders, setExpandedOrders] = useState([]);
  const [showInvoice, setShowInvoice] = useState(false);
  const [processing, setProcessing] = useState(false);
  const {setLoading} = useLoader();
  const [selectedInvoiceData, setSelectedInvoiceData] = useState(false);
  const [activeTab, setActiveTab] = useState('All Orders');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownAnimation] = useState(new Animated.Value(0));
  const [error, setError] = useState(null);
  const [reworkModalVisible, setReworkModalVisible] = useState(false);
  const [reworkReason, setReworkReason] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const navigation = useNavigation();
  const {showAlert} = useAlert();
  const [invoiceData, setInvoiceData] = useState(null);
  const [bottomModalVisible, setBottomModalVisible] = useState(false);

  const handleInvoiceConfirmOrder = orderInvoice => {
    setShowInvoice(true);
    setInvoiceData(orderInvoice);
  };

  const dispatch = useDispatch();

  const onEditOrderClick = () => {
    setBottomModalVisible(true);
  };

  const getStatusStyles = status => {
    switch (status) {
      case 'Confirmed':
        return {backgroundColor: '#193A64', color: '#FFFFFF'}; // Dark blue bg, white text
      case 'Quote Sent':
        return {backgroundColor: '#D9E9FF', color: '#4B6489'}; // Light blue bg, muted blue text
      case 'Invoice Uploaded':
        return {backgroundColor: '#E2E2E2', color: '#000000'}; // Light grey bg, black text
      case 'Delivered':
        return {backgroundColor: '#009F08', color: '#FFFFFF'}; // Green bg, white text
      case 'Shipped':
        return {backgroundColor: '#3D5E84', color: '#FFFFFF'}; // Muted blue bg, white text
      case 'Completed':
        return {backgroundColor: '#11335A', color: '#FFFFFF'}; // Deep navy bg, white text
      default:
        return {backgroundColor: '#722323', color: '#FFFFFF'}; // Default deep red, white text
    }
  };

  const toggleOrderExpand = orderId => {
    setExpandedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId],
    );
  };

  const updateOrderStatus = async (orderId, status, reason = null) => {
    setProcessing(true);
    const token = storage.getString(StorageKeys.AUTH_TOKEN);

    console.log('confirmed why');

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

  const handleConfirmOrder = () => {
    showAlert({
      title: 'Confirm Order',
      message: 'Are you sure you want to confirm this order?',
      onAccept: async () => {
        await updateOrderStatus(order?._id, 'Confirmed');
      },
      acceptText: 'Confirm',
      rejectText: 'Cancel',
    });
  };

  // Handle rework button press
  const handleReworkOrder = () => {
    console.log('Rework order clicked', order);
    setSelectedOrderId(order._id);
    setReworkModalVisible(!reworkModalVisible);
  };

  const handleTrackingPress = order => {
    navigation.navigate(ROUTES.TRACKING, {orders: order});
  };

  // Handle adding single item to cart
  const handleAddToCart = async (productId, variant, quantity) => {
    console.log('12', productId, variant, quantity);
    try {
      await dispatch(addToCart({productId, variant, quantity})).unwrap();
    } catch (err) {
      console.log('Error adding item to cart:', err.message);
      throw err;
    }
  };

  const handleRepeatOrder = async order => {
    if (!order || order.length === 0) {
      showAlert({
        title: 'No Previous Order',
        message: 'No previous order found to repeat.',
        acceptText: 'OK',
      });
      return;
    }

    showAlert({
      title: 'Repeat Last Order',
      message: `Do you want to add all ${order.length} items from your last order to cart?`,
      onConfirm: async () => {
        setLoading(true);
        try {
          const addToCartPromises = order.map(item =>
            handleAddToCart(item.productId._id, item.variant, item.quantity),
          );

          await Promise.all(addToCartPromises);

          // dispatch(
          //   openModal({
          //     modalType: 'ViewCart',
          //     callbackId: '123',
          //   }),
          // );

          showAlert({
            title: 'Success',
            message: 'All items have been added to cart!',
            acceptText: 'OK',
            onConfirm: () => {
              navigation.navigate(ROUTES.CART);
            },
          });
        } catch (error) {
          showAlert({
            title: 'Error',
            message:
              error.message || 'Failed to repeat order. Please try again.',
            acceptText: 'OK',
          });
        } finally {
          setLoading(false);
        }
      },
      acceptText: 'Yes, Add to Cart',
      rejectText: 'Cancel',
    });
  };

  return (
    <View key={index} style={[styles.orderCard]}>
      <BottomModal
        visible={bottomModalVisible}
        onClose={() => {
          console.log('Modal closing');
          setBottomModalVisible(false);
        }}
      />
      <View style={[styles.orderHeader]}>
        <TouchableOpacity
          onPress={() => handleTrackingPress(order)}
          style={[
            styles.orderDetails,
            {backgroundColor: getStatusStyles(order.status).backgroundColor},
          ]}>
          <View>
            <TouchableOpacity>
              <Text
                style={[
                  styles.orderIdText,
                  {color: getStatusStyles(order.status).color},
                ]}>
                Order #{order?.orderId}
              </Text>
            </TouchableOpacity>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor: getStatusStyles(order.status).color,
                    borderRadius: wp(1.25),
                    marginRight: wp(1),
                  },
                ]}
              />
              <Text
                style={[
                  styles.orderStatus,
                  {
                    flex: 1,
                    color: getStatusStyles(order.status).color,
                    fontWeight: '500',
                  },
                ]}>
                {order.status === 'Warehouse Processing' ||
                order.status === 'Admin Stock Review' ||
                order.status === 'Approval Pending' ||
                order.status === 'Awaiting Invoice' ||
                order.status === 'Invoice Verification'
                  ? 'In processing'
                  : order.status}
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            {(order.status === 'Invoice Uploaded' ||
              order.status === 'Confirmed' ||
              order.status === 'Packing' ||
              order.status === 'Dispatched' ||
              order.status === 'Delivered') && (
              <TouchableOpacity
                onPress={() => handleInvoiceConfirmOrder(order?.invoice)}
                style={{
                  backgroundColor: '#FFF',
                  borderRadius: 50,
                  marginRight: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 7,
                  paddingHorizontal: 8,
                }}>
                <ReceiptIcon width={18} height={18} style={{color: '#FFF'}} />
              </TouchableOpacity>
            )}
            <View style={{alignItems: 'flex-end'}}>
              <Text
                style={[
                  styles.orderDateText,
                  {
                    color: getStatusStyles(order.status).color,
                  },
                ]}>
                {formatDate(order.createdAt)}
              </Text>
              {order.isPartialOrder && order?.originalOrder === null && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    flex: 1,
                  }}>
                  <InfoIcon
                    name="info-with-circle"
                    size={
                      isTablet
                        ? scale(20)
                        : isSmallScreen
                        ? scale(16)
                        : scale(18)
                    }
                    color={getStatusStyles(order.status).color}
                  />
                  <Text
                    style={{
                      fontSize: isTablet
                        ? moderateScale(15)
                        : isSmallScreen
                        ? moderateScale(10)
                        : moderateScale(12),
                      color: getStatusStyles(order.status).color,
                      marginLeft: wp(0.8),
                    }}>
                    Partial Order
                  </Text>
                </View>
              )}
              {!order.isPartialOrder && order?.originalOrder && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    flex: 1,
                  }}>
                  <InfoIcon
                    name="info-with-circle"
                    size={
                      isTablet
                        ? scale(20)
                        : isSmallScreen
                        ? scale(16)
                        : scale(18)
                    }
                    color={getStatusStyles(order.status).color}
                  />
                  <Text
                    style={{
                      fontSize: isTablet
                        ? moderateScale(15)
                        : isSmallScreen
                        ? moderateScale(10)
                        : moderateScale(12),
                      color: getStatusStyles(order.status).color,
                      marginLeft: wp(0.8),
                    }}>
                    Back order
                  </Text>
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>

        {(order.status === 'Invoice Uploaded' ||
          order.status === 'Partially Fulfilled') && (
          <ConfirmComponent
            handleReworkOrder={handleReworkOrder}
            handleConfirmOrder={handleConfirmOrder}
            handleInvoiceConfirmOrder={() =>
              handleInvoiceConfirmOrder(order?.invoice)
            }
          />
        )}
        <View
          style={{
            backgroundColor: '#3C5D87',
            borderRadius: 10,
            marginHorizontal: scale(12),
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
                    image={order.items[0]?.productId.image}
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
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: moderateScale(6),
                      }}>
                      <Text style={[styles.productQuantity]}>
                        Quantity: {order.items[0].quantity}
                      </Text>
                      {/* <View>
                        <TouchableOpacity
                          style={{
                            borderWidth: 1,
                            borderColor: Colors.PRIMARY_DARK,
                            paddingVertical: moderateScale(4),
                            paddingHorizontal: moderateScale(8),
                            borderRadius: 50,
                          }}
                          onPress={() => onEditOrderClick()}>
                          <Text style={{textAlign: 'center'}}>Edit Order</Text>
                        </TouchableOpacity>
                      </View> */}
                    </View>
                  </View>
                  {order?.status === 'Delivered' && (
                    <View style={styles.repeatOrder}>
                      <TouchableWithoutFeedback
                        onPress={() => handleRepeatOrder(order.items)}>
                        <View style={styles.confirmButton}>
                          <LinearGradient
                            colors={[
                              '#2D4565',
                              '#2D4565',
                              '#1B2B48',
                              '#1B2B48',
                            ]}
                            start={{x: 0, y: 0}}
                            end={{x: 0, y: 1}}
                            style={styles.confirmWithLinear}>
                            <Text style={styles.buttonText}>Repeat Order</Text>
                          </LinearGradient>
                        </View>
                      </TouchableWithoutFeedback>
                    </View>
                  )}
                  {order?.items?.length > 1 && (
                    <View style={{position: 'absolute', right: 10, top: 10}}>
                      <LinearGradient
                        colors={['#38587F', '#101924']}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 0}}
                        style={[styles.ratingContainer]}>
                        <Text style={[styles.ratingText]}>
                          {order?.items?.length - 1}+
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
                      image={order.items[itemIndex]?.productId.image}
                      reffer="cart"
                    />
                    <View style={[styles.productDetails]}>
                      <View>
                        <Text style={[styles.productName]}>
                          {order?.items[itemIndex].productId.name}
                        </Text>
                        <Text style={[styles.productSize]}>
                          <Text style={{fontWeight: '600'}}>Variant</Text>:{' '}
                          {order?.items[itemIndex].variant}
                        </Text>
                      </View>
                      <View>
                        <Text style={[styles.productQuantity]}>
                          Quantity: {order?.items[itemIndex].quantity}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
          {order.items.length > 1 && (
            <TouchableWithoutFeedback
              onPress={() => toggleOrderExpand(order._id)}>
              <View
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
              </View>
            </TouchableWithoutFeedback>
          )}
        </View>
        {/* <View style={{marginTop: hp(1.2)}}>
          {order.status === 'Quote Sent' ||
          order.status === 'Partially Fulfilled' ? (
            <View
              style={{
                flexDirection: isSmallScreen ? 'column' : 'row',
                justifyContent: 'space-around',
              }}>
              <LinearGradient
                colors={['#2D4565', '#2D4565', '#1B2B48', '#1B2B48']}
                start={{x: 0, y: 0}} // Top
                end={{x: 0, y: 1}} // Bottom
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
          ) : null}
        </View> */}
        <View style={{flex: 1}}>
          {!showInvoice ? (
            <View style={{flex: 1}}>
              {/* <View style={{marginTop: hp(1.2)}}>
                {(order.status !== 'Quote Sent' ||
                  order.status !== 'Rework') && (
                  <View
                    style={{
                      flexDirection: isSmallScreen ? 'column' : 'row',
                      justifyContent: 'space-around',
                    }}>
                    <LinearGradient
                      colors={['#2D4565', '#2D4565', '#1B2B48', '#1B2B48']}
                      start={{x: 0, y: 0}} // Top
                      end={{x: 0, y: 1}} // Bottom
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
                )}
              </View> */}
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

      <ReworkModal
        visible={reworkModalVisible}
        onClose={() => {
          setReworkModalVisible(!reworkModalVisible);
          setSelectedOrderId(null);
        }}
        selectedOrderId={selectedOrderId}
        updateOrderStatus={updateOrderStatus}
        processing={processing}
      />
    </View>
  );
};

export default TrackingCard;
