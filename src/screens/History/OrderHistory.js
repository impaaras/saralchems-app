import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Entypo';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import axios from 'axios';
import DashboardHeader from '../../components/Header/DashBoardHeader';
import {fallbackImg} from '../../utils/images';
import styles from './History.styles';
import {StorageKeys, storage} from '../../utils/storage';
import {API_URL} from '../../utils/ApiService';

import {useDispatch, useSelector} from 'react-redux';
import {useLoader} from '../../context/LoaderContext';
import {useAlert} from '../../context/CustomAlertContext';
import InfoIcon from 'react-native-vector-icons/Entypo';
import {openModal} from '../../redux/slices/modalSlice';
import ScrollImage from '../../components/ScrollImage/Index';

// Helper to format the date
const formatDate = dateString => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const OrderHistory = () => {
  const [activeTab, setActiveTab] = useState('All Orders');
  const [expandedOrders, setExpandedOrders] = useState([]);
  const [orders, setOrders] = useState([]);
  const {setLoading} = useLoader();

  const [error, setError] = useState(null);
  const [reworkModalVisible, setReworkModalVisible] = useState(false);
  const [reworkReason, setReworkReason] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [processing, setProcessing] = useState(false);
  const navigation = useNavigation();
  const {showAlert} = useAlert();

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

  const toggleOrderExpand = orderId => {
    setExpandedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId],
    );
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

  // Define filter tabs based on available status values in your data
  const filterTabs = ['All Orders', 'Quote Sent', 'Confirmed', 'Delivered'];

  // Filter orders based on active tab
  const filteredOrders = orders.filter(
    order => activeTab === 'All Orders' || order.status === activeTab,
  );

  const user = useSelector(state => state.auth.user);

  const dispatch = useDispatch();

  const handleImageZoom = imageUri => {
    dispatch(
      openModal({
        modalType: 'ImageZoomModal',
        modalProps: {
          visible: true,
          imageUri,
        },
      }),
    );
  };

  return (
    <View style={styles.container}>
      <DashboardHeader />
      <View style={styles.headerContainer}>
        <View style={styles.userInfoCard}>
          <Image
            source={{
              uri: fallbackImg(),
            }}
            style={styles.userAvatar}
          />
          <View style={styles.userTextContainer}>
            <Text style={styles.userName}>{user?.name}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>
        </View>

        <View
          style={{
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}>
          <View style={styles.tabsContainer}>
            {filterTabs.map(tab => (
              <LinearGradient
                key={tab}
                colors={
                  activeTab === tab ? ['#38587F', '#101924'] : ['#FFF', '#FFF']
                }
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={[
                  styles.tabButton,
                  activeTab === tab && styles.activeTabButton,
                ]}>
                <TouchableOpacity onPress={() => setActiveTab(tab)}>
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === tab && styles.activeTabText,
                    ]}>
                    {tab}
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
            ))}
          </View>
        </View>

        <ScrollView
          style={styles.ordersContainer}
          showsVerticalScrollIndicator={false}>
          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : filteredOrders.length === 0 ? (
            <Text style={styles.messageText}>No orders found</Text>
          ) : (
            filteredOrders.map((order, index) => (
              <View key={index} style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <View style={styles.orderDetails}>
                    <View>
                      <Text style={styles.orderIdText}>
                        Order #{order?._id.slice(-9)}
                      </Text>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View
                          style={[
                            styles.statusDot,
                            {backgroundColor: getStatusColor(order.status)},
                          ]}
                        />
                        <Text style={styles.orderStatus}>{order.status}</Text>
                      </View>
                    </View>
                    <View>
                      <Text style={styles.orderDateText}>
                        Placed on {formatDate(order.createdAt)}
                      </Text>
                      {!order.isPartialOrder && (
                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          <InfoIcon
                            name="info-with-circle"
                            size={18}
                            color="#101924"
                          />
                          <Text
                            style={{
                              fontSize: 13,
                              color: 'black',
                              marginLeft: 3,
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
                      marginTop: 10,
                      borderRadius: 10,
                    }}>
                    <View
                      style={{
                        backgroundColor: '#FFF',
                        borderBottomLeftRadius: 10,
                      }}>
                      {!expandedOrders.includes(order._id) &&
                        order.items.length > 0 && (
                          <View style={styles.orderItemsContainer}>
                            <View style={styles.orderItem}>
                              <ScrollImage
                                product={order.items[0]?.productId}
                                reffer="cart"
                              />
                              <View style={styles.productDetails}>
                                <Text style={styles.productName}>
                                  {order.items[0].productId.name}
                                </Text>
                                <Text style={styles.productSize}>
                                  <Text style={{fontWeight: '700'}}>
                                    Variant
                                  </Text>
                                  : {order.items[0].variant}
                                </Text>
                                <Text style={styles.productQuantity}>
                                  Quantity: {order.items[0].quantity}
                                </Text>
                              </View>
                              {order.items.length > 1 && (
                                <View>
                                  <LinearGradient
                                    colors={['#38587F', '#101924']}
                                    start={{x: 0, y: 0}}
                                    end={{x: 1, y: 0}}
                                    style={styles.ratingContainer}>
                                    <Text style={styles.ratingText}>
                                      +{order.items.length - 1}
                                    </Text>
                                  </LinearGradient>
                                </View>
                              )}
                            </View>
                          </View>
                        )}

                      {expandedOrders.includes(order._id) && (
                        <View style={styles.orderItemsContainer}>
                          {order.items.map((item, itemIndex) => (
                            <View key={itemIndex} style={styles.orderItem}>
                              <ScrollImage
                                product={order.items[itemIndex]?.productId}
                                reffer="cart"
                              />
                              <View style={styles.productDetails}>
                                <Text style={styles.productName}>
                                  {item.productId.name}
                                </Text>
                                <Text style={styles.productSize}>
                                  Variant: {item.variant}
                                </Text>
                                <Text style={styles.productQuantity}>
                                  Quantity: {item.quantity}
                                </Text>
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
                          paddingTop: 7,
                        }}>
                        <Icon
                          name={
                            expandedOrders.includes(order._id)
                              ? 'chevron-up'
                              : 'chevron-down'
                          }
                          style={{alignSelf: 'center'}}
                          size={24}
                          color="#fff"
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                  <View style={{marginTop: 10}}>
                    {order.status === 'Invoice Uploaded' ||
                    order.status === 'Quote Sent' ||
                    order.status === 'Partially Fulfilled' ? (
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <LinearGradient
                          colors={['#101924', '#38587F']}
                          start={{x: 0, y: 0}}
                          end={{x: 1, y: 0}}
                          style={styles.confirmButton}>
                          <TouchableOpacity
                            style={styles.quoteButton}
                            onPress={() => handleConfirmOrder(order._id)}
                            disabled={processing}>
                            <Text style={styles.quoteButtonText}>
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
                            {borderColor: '#101924', borderWidth: 2},
                          ]}>
                          <TouchableOpacity
                            style={[styles.quoteButton]}
                            onPress={() => handleReworkOrder(order._id)}
                            disabled={processing}>
                            <Text
                              style={[
                                styles.quoteButtonText,
                                {color: '#101924'},
                              ]}>
                              {processing ? 'Processing...' : 'Rework'}
                            </Text>
                          </TouchableOpacity>
                        </LinearGradient>
                      </View>
                    ) : null}
                  </View>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>

      {/* Rework Modal */}
      <Modal
        visible={reworkModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setReworkModalVisible(false);
          setReworkReason('');
        }}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Request Rework</Text>
            <Text style={styles.modalSubtitle}>
              Please provide a reason for your rework request:
            </Text>
            <TextInput
              style={styles.reasonInput}
              placeholder="Enter reason for rework"
              multiline={true}
              numberOfLines={4}
              value={reworkReason}
              onChangeText={setReworkReason}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setReworkModalVisible(false);
                  setReworkReason('');
                }}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={submitReworkRequest}
                disabled={processing}>
                <Text style={styles.submitButtonText}>
                  {processing ? 'Submitting...' : 'Submit'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default OrderHistory;
