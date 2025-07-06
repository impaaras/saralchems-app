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
import emptyImage from '../../assets/empty.png';
import Invoice from '../../components/Invoice/Invoice';
import InvoicePDFGenerator from '../../components/Invoice/Invoice';
import InvoiceModal from '../../components/Invoice/Invoice';
import {ROUTES} from '../../constants/routes';
import {
  scale,
  wp,
  hp,
  isTablet,
  isSmallScreen,
  formatDate,
} from '../../utils/Responsive/responsive';
import TrackingCard from '../../components/TrackingCard/TrackingCard';

const OrderHistory = () => {
  const [activeTab, setActiveTab] = useState('All Orders');
  const [expandedOrders, setExpandedOrders] = useState([]);
  const [orders, setOrders] = useState([]);
  const [dropdownAnimation] = useState(new Animated.Value(0));
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

  // Define filter tabs based on available status values in your data
  const filterTabs = [
    'All Orders',
    'Quote Sent',
    'Invoice Uploaded',
    'Confirmed',
    'Rework',
    'Packing',
    'Dispatched',
    'Delivered',
  ];

  const [showInvoice, setShowInvoice] = useState(false);
  const [selectedInvoiceData, setSelectedInvoiceData] = useState(false);

  // Updated button handlers
  const handleInvoiceConfirmOrder = orderId => {
    // Find the order data
    setShowInvoice(true);
    // const orderData = orders.find(order => order._id === orderId);
    // if (orderData && orderData.invoice) {
    //   setSelectedInvoiceData(orderData);
    //   setShowInvoice(true);
    // } else {
    //   Alert.alert('Error', 'Invoice data not found');
    // }
  };

  const handleInvoiceReworkOrder = orderId => {
    setShowInvoice(true);

    // Same as handleConfirmOrder for now, but you can customize this
    // const orderData = orders.find(order => order._id === orderId);
    // if (orderData && orderData.invoice) {
    //   setSelectedInvoiceData(orderData);
    //   setShowInvoice(true);
    // } else {
    //   Alert.alert('Error', 'Invoice data not found');
    // }
  };

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

  const selectFilter = filter => {
    setActiveTab(filter);
  };

  return (
    <View style={styles.container}>
      <DashboardHeader />
      <View style={[styles.headerContainer, {marginTop: hp(-4)}]}>
        <View
          style={[
            styles.userInfoCard,
            {
              marginTop: scale(-40),
              margin: scale(15),
              padding: scale(15),
            },
          ]}>
          <Image
            source={{
              uri: fallbackImg(),
            }}
            style={[styles.userAvatar]}
          />
          <View style={[styles.userTextContainer]}>
            <Text style={[styles.userName]}>{user?.name}</Text>
            <Text style={[styles.userEmail]}>{user?.email}</Text>
          </View>
        </View>

        <View style={styles.filterTabsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabScrollContainer}>
            {filterTabs.map((filter, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => selectFilter(filter)}
                activeOpacity={0.8}
                style={[
                  styles.tabButton,
                  activeTab === filter && styles.activeTabButton,
                ]}>
                {activeTab === filter ? (
                  <LinearGradient
                    colors={['#38587F', '#101924']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={styles.activeGradient}>
                    <Text style={styles.activeTabText}>{filter}</Text>
                  </LinearGradient>
                ) : (
                  <Text style={styles.inactiveTabText}>{filter}</Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <ScrollView
          style={[styles.ordersContainer]}
          showsVerticalScrollIndicator={false}>
          {error ? (
            <Text style={[styles.errorText, {padding: wp(5)}]}>{error}</Text>
          ) : filteredOrders.length === 0 ? (
            <ScrollView contentContainerStyle={styles.emptyContainer}>
              <Image
                source={emptyImage} // replace with your relevant image
                style={styles.emptyImage}
                resizeMode="contain"
              />
              <Text style={styles.emptyTitle}>No Orders Yet</Text>
              <Text style={styles.emptySubtitle}>
                You haven't ordered any products yet. Start by exploring our dye
                & chemical range.
              </Text>
              <LinearGradient
                colors={['#38587F', '#101924']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 6,
                  borderRadius: 100,
                }}>
                <TouchableOpacity
                  style={styles.goBackButton}
                  onPress={() => navigation.goBack()}>
                  <Text style={styles.goBackText}>GO BACK</Text>
                </TouchableOpacity>
              </LinearGradient>
            </ScrollView>
          ) : (
            filteredOrders.map((order, index) => (
              <TrackingCard index={index} order={order} />
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

export default OrderHistory;
