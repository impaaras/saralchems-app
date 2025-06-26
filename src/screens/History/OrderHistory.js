// import React, {useCallback, useEffect, useState} from 'react';
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   ScrollView,
//   TextInput,
//   Modal,
//   Dimensions,
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import Icon from 'react-native-vector-icons/Entypo';
// import {useFocusEffect, useNavigation} from '@react-navigation/native';
// import axios from 'axios';
// import DashboardHeader from '../../components/Header/DashBoardHeader';
// import {fallbackImg} from '../../utils/images';
// import styles from './History.styles';
// import {StorageKeys, storage} from '../../utils/storage';
// import {API_URL} from '../../utils/ApiService';

// import {useDispatch, useSelector} from 'react-redux';
// import {useLoader} from '../../context/LoaderContext';
// import {useAlert} from '../../context/CustomAlertContext';
// import InfoIcon from 'react-native-vector-icons/Entypo';
// import {openModal} from '../../redux/slices/modalSlice';
// import ScrollImage from '../../components/ScrollImage/Index';
// import emptyImage from '../../assets/empty.png';

// // Get screen dimensions
// const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

// // Responsive helper functions
// const wp = percentage => {
//   return (percentage * screenWidth) / 100;
// };

// const hp = percentage => {
//   return (percentage * screenHeight) / 100;
// };

// const isTablet = screenWidth >= 768;
// const isSmallScreen = screenWidth < 380;

// // Helper to format the date
// const formatDate = dateString => {
//   const date = new Date(dateString);
//   return date.toLocaleDateString('en-US', {
//     year: 'numeric',
//     month: 'short',
//     day: 'numeric',
//   });
// };

// const OrderHistory = () => {
//   const [activeTab, setActiveTab] = useState('All Orders');
//   const [expandedOrders, setExpandedOrders] = useState([]);
//   const [orders, setOrders] = useState([]);
//   const {setLoading} = useLoader();

//   const [error, setError] = useState(null);
//   const [reworkModalVisible, setReworkModalVisible] = useState(false);
//   const [reworkReason, setReworkReason] = useState('');
//   const [selectedOrderId, setSelectedOrderId] = useState(null);
//   const [processing, setProcessing] = useState(false);
//   const navigation = useNavigation();
//   const {showAlert} = useAlert();

//   const fetchOrders = async () => {
//     setLoading(true);
//     setError(null);
//     const token = storage.getString(StorageKeys.AUTH_TOKEN);
//     try {
//       const response = await axios.get(`${API_URL}/order/user-orders`, {
//         headers: {Authorization: `Bearer ${token}`},
//       });
//       setOrders(response.data);

//       setLoading(false);
//     } catch (error) {
//       console.log(error, 'error message');
//       setError('Failed to load orders. Please try again.');
//       setLoading(false);
//     }
//   };

//   useFocusEffect(
//     useCallback(() => {
//       fetchOrders();
//     }, []),
//   );

//   const updateOrderStatus = async (orderId, status, reason = null) => {
//     setProcessing(true);
//     const token = storage.getString(StorageKeys.AUTH_TOKEN);

//     try {
//       setLoading(true);
//       const payload = {status};
//       if (reason) {
//         payload.reason = reason;
//       }

//       const response = await axios.patch(
//         `${API_URL}/order/user-status/${orderId}`,
//         payload,
//         {
//           headers: {Authorization: `Bearer ${token}`},
//         },
//       );

//       // Show success message using custom alert instead of Alert.alert
//       showAlert({
//         title: status === 'Confirmed' ? 'Order Confirmed' : 'Rework Requested',
//         message:
//           status === 'Confirmed'
//             ? 'Your order has been confirmed and is being processed.'
//             : 'Your rework request has been submitted.',
//         onAccept: () => {
//           // Refresh orders after confirmation
//           fetchOrders();
//         },
//         acceptText: 'OK',
//         rejectText: '', // Hide cancel button by not providing rejectText
//       });

//       // Refresh orders
//       fetchOrders();
//     } catch (error) {
//       console.log('Update status error:', error.response?.data || error);

//       // Show error using custom alert instead of Alert.alert
//       showAlert({
//         title: 'Error',
//         message:
//           error.response?.data?.message || 'Failed to update order status.',
//         acceptText: 'OK',
//         rejectText: '', // Hide cancel button
//       });
//     } finally {
//       setProcessing(false);
//       setLoading(false);
//       if (status === 'Rework') {
//         setReworkModalVisible(false);
//         setReworkReason('');
//       }
//     }
//   };

//   // Handle confirm button press
//   const handleConfirmOrder = orderId => {
//     // Using custom alert instead of Alert.alert
//     showAlert({
//       title: 'Confirm Order',
//       message: 'Are you sure you want to confirm this order?',
//       onConfirm: () => updateOrderStatus(orderId, 'Confirmed'),
//       acceptText: 'Confirm',
//       rejectText: 'Cancel',
//     });
//   };

//   // Handle rework button press
//   const handleReworkOrder = orderId => {
//     setSelectedOrderId(orderId);
//     setReworkModalVisible(true);
//   };

//   // Submit rework request with reason
//   const submitReworkRequest = () => {
//     if (!reworkReason.trim()) {
//       // Using custom alert for validation error
//       showAlert({
//         title: 'Required',
//         message: 'Please provide a reason for the rework request.',
//         acceptText: 'OK',
//         rejectText: '', // Hide cancel button
//       });
//       return;
//     }
//     updateOrderStatus(selectedOrderId, 'Rework', reworkReason);
//   };

//   const toggleOrderExpand = orderId => {
//     setExpandedOrders(prev =>
//       prev.includes(orderId)
//         ? prev.filter(id => id !== orderId)
//         : [...prev, orderId],
//     );
//   };

//   const getStatusColor = status => {
//     switch (status) {
//       case 'Delivered':
//         return '#4CAF50';
//       case 'Quote Sent':
//         return '#FF9800';
//       case 'Confirmed':
//         return '#2196F3';
//       case 'Processing':
//         return '#FF9800';
//       case 'Shipped':
//         return '#2196F3';
//       case 'Rework':
//         return '#F44336';
//       default:
//         return '#757575';
//     }
//   };

//   // "Quote Sent",
//   // "Invoice Uploaded",
//   // "Confirmed",
//   // "Rework",
//   // "Packing",
//   // "Dispatched",
//   // "Delivered",

//   // Define filter tabs based on available status values in your data
//   const filterTabs = [
//     'All Orders',
//     'Quote Sent',
//     'Invoice Uploaded',
//     'Rework',
//     'Packing',
//     'Dispatched',
//     'Delivered',
//   ];

//   // Filter orders based on active tab
//   const filteredOrders = orders.filter(
//     order => activeTab === 'All Orders' || order.status === activeTab,
//   );

//   const user = useSelector(state => state.auth.user);

//   const dispatch = useDispatch();

//   const handleImageZoom = imageUri => {
//     dispatch(
//       openModal({
//         modalType: 'ImageZoomModal',
//         modalProps: {
//           visible: true,
//           imageUri,
//         },
//       }),
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <DashboardHeader />
//       <View style={[styles.headerContainer, {marginTop: hp(-4)}]}>
//         <View
//           style={[
//             styles.userInfoCard,
//             {
//               marginTop: hp(-6),
//               margin: wp(4),
//               padding: wp(4),
//             },
//           ]}>
//           <Image
//             source={{
//               uri: fallbackImg(),
//             }}
//             style={[styles.userAvatar]}
//           />
//           <View style={[styles.userTextContainer, {marginLeft: wp(4)}]}>
//             <Text
//               style={[
//                 styles.userName,
//                 // {
//                 //   fontSize: isTablet ? 18 : isSmallScreen ? 14 : 16,
//                 // },
//               ]}>
//               {user?.name}
//             </Text>
//             <Text
//               style={[
//                 styles.userEmail,
//                 // {
//                 //   fontSize: isTablet ? 16 : isSmallScreen ? 12 : 14,
//                 // },
//               ]}>
//               {user?.email}
//             </Text>
//           </View>
//         </View>

//         <View
//           style={{
//             borderTopLeftRadius: 20,
//             borderTopRightRadius: 20,
//           }}>
//           <View style={[styles.tabsContainer]}>
//             {filterTabs.map(tab => (
//               <LinearGradient
//                 key={tab}
//                 colors={
//                   activeTab === tab ? ['#38587F', '#101924'] : ['#FFF', '#FFF']
//                 }
//                 start={{x: 0, y: 0}}
//                 end={{x: 1, y: 0}}
//                 style={[
//                   styles.tabButton,
//                   activeTab === tab && [styles.activeTabButton],
//                 ]}>
//                 <TouchableOpacity
//                   onPress={() => setActiveTab(tab)}
//                   style={{
//                     paddingVertical: wp(0.4),
//                   }}>
//                   <Text
//                     style={[
//                       styles.tabText,
//                       {fontSize: isTablet ? 15 : isSmallScreen ? 11 : 10},
//                       activeTab === tab && styles.activeTabText,
//                     ]}>
//                     {tab}
//                   </Text>
//                 </TouchableOpacity>
//               </LinearGradient>
//             ))}
//           </View>
//         </View>

//         <ScrollView
//           style={[styles.ordersContainer]}
//           showsVerticalScrollIndicator={false}>
//           {error ? (
//             <Text style={[styles.errorText, {padding: wp(5)}]}>{error}</Text>
//           ) : filteredOrders.length === 0 ? (
//             <ScrollView contentContainerStyle={styles.emptyContainer}>
//               <Image
//                 source={emptyImage} // replace with your relevant image
//                 style={styles.emptyImage}
//                 resizeMode="contain"
//               />
//               <Text style={styles.emptyTitle}>No Orders Yet</Text>
//               <Text style={styles.emptySubtitle}>
//                 You haven't ordered any products yet. Start by exploring our dye
//                 & chemical range.
//               </Text>
//               <LinearGradient
//                 colors={['#38587F', '#101924']}
//                 start={{x: 0, y: 0}}
//                 end={{x: 1, y: 0}}
//                 style={{
//                   flexDirection: 'row',
//                   alignItems: 'center',
//                   paddingHorizontal: 6,
//                   borderRadius: 100,
//                 }}>
//                 <TouchableOpacity
//                   style={styles.goBackButton}
//                   onPress={() => navigation.goBack()}>
//                   <Text style={styles.goBackText}>GO BACK</Text>
//                 </TouchableOpacity>
//               </LinearGradient>
//             </ScrollView>
//           ) : (
//             filteredOrders.map((order, index) => (
//               <View
//                 key={index}
//                 style={[
//                   styles.orderCard,
//                   {
//                     marginBottom: hp(2),
//                   },
//                 ]}>
//                 <View
//                   style={[
//                     styles.orderHeader,
//                     {
//                       paddingHorizontal: wp(4),
//                       paddingBottom: hp(1.2),
//                     },
//                   ]}>
//                   <View
//                     style={[
//                       styles.orderDetails,
//                       {
//                         marginTop: hp(1),
//                       },
//                     ]}>
//                     <View>
//                       <Text
//                         style={[
//                           styles.orderIdText,
//                           // {
//                           //   fontSize: isTablet ? 17 : isSmallScreen ? 13 : 15,
//                           // },
//                         ]}>
//                         Order #{order?._id.slice(-9)}
//                       </Text>
//                       <View
//                         style={{flexDirection: 'row', alignItems: 'center'}}>
//                         <View
//                           style={[
//                             styles.statusDot,
//                             {
//                               backgroundColor: getStatusColor(order.status),
//                               width: wp(2.5),
//                               height: wp(2.5),
//                               borderRadius: wp(1.25),
//                               marginRight: wp(2),
//                             },
//                           ]}
//                         />
//                         <Text
//                           style={[
//                             styles.orderStatus,
//                             // {
//                             //   fontSize: isTablet ? 16 : isSmallScreen ? 12 : 14,
//                             // },
//                           ]}>
//                           {order.status}
//                         </Text>
//                       </View>
//                     </View>
//                     <View>
//                       <Text
//                         style={[
//                           styles.orderDateText,
//                           // {
//                           //   fontSize: isTablet ? 15 : isSmallScreen ? 11 : 13,
//                           // },
//                         ]}>
//                         Placed on {formatDate(order.createdAt)}
//                       </Text>
//                       {!order.isPartialOrder && (
//                         <View
//                           style={{flexDirection: 'row', alignItems: 'center'}}>
//                           <InfoIcon
//                             name="info-with-circle"
//                             size={isTablet ? 20 : isSmallScreen ? 16 : 18}
//                             color="#101924"
//                           />
//                           <Text
//                             style={{
//                               fontSize: isTablet ? 15 : isSmallScreen ? 11 : 13,
//                               color: 'black',
//                               marginLeft: wp(0.8),
//                             }}>
//                             Partial Order
//                           </Text>
//                         </View>
//                       )}
//                     </View>
//                   </View>
//                   <View
//                     style={{
//                       backgroundColor: '#3C5D87',
//                       marginTop: hp(1.2),
//                       borderRadius: 10,
//                     }}>
//                     <View
//                       style={{
//                         backgroundColor: '#FFF',
//                         borderBottomLeftRadius: 10,
//                       }}>
//                       {!expandedOrders.includes(order._id) &&
//                         order.items.length > 0 && (
//                           <View style={styles.orderItemsContainer}>
//                             <View
//                               style={[
//                                 styles.orderItem,
//                                 {
//                                   marginTop: hp(1.2),
//                                   padding: wp(3.8),
//                                 },
//                               ]}>
//                               <ScrollImage
//                                 product={order.items[0]?.productId}
//                                 reffer="cart"
//                               />
//                               <View
//                                 style={[
//                                   styles.productDetails,
//                                   {
//                                     marginLeft: wp(4),
//                                   },
//                                 ]}>
//                                 <Text
//                                   style={[
//                                     styles.productName,
//                                     // {
//                                     //   fontSize: isTablet
//                                     //     ? 17
//                                     //     : isSmallScreen
//                                     //     ? 13
//                                     //     : 15,
//                                     // },
//                                   ]}>
//                                   {order.items[0].productId.name}
//                                 </Text>
//                                 <Text
//                                   style={[
//                                     styles.productSize,
//                                     // {
//                                     //   fontSize: isTablet
//                                     //     ? 15
//                                     //     : isSmallScreen
//                                     //     ? 11
//                                     //     : 13,
//                                     //   marginTop: hp(0.5),
//                                     // },
//                                   ]}>
//                                   <Text style={{fontWeight: '700'}}>
//                                     Variant
//                                   </Text>
//                                   : {order.items[0].variant}
//                                 </Text>
//                                 <Text
//                                   style={[
//                                     styles.productQuantity,
//                                     // {
//                                     //   fontSize: isTablet
//                                     //     ? 15
//                                     //     : isSmallScreen
//                                     //     ? 11
//                                     //     : 13,
//                                     //   marginTop: hp(0.5),
//                                     // },
//                                   ]}>
//                                   Quantity: {order.items[0].quantity}
//                                 </Text>
//                               </View>
//                               {order.items.length > 1 && (
//                                 <View>
//                                   <LinearGradient
//                                     colors={['#38587F', '#101924']}
//                                     start={{x: 0, y: 0}}
//                                     end={{x: 1, y: 0}}
//                                     style={[
//                                       styles.ratingContainer,
//                                       // {
//                                       //   height: hp(2.5),
//                                       //   width: wp(7.5),
//                                       // },
//                                     ]}>
//                                     <Text
//                                       style={[
//                                         styles.ratingText,
//                                         // {
//                                         //   fontSize: isTablet
//                                         //     ? 14
//                                         //     : isSmallScreen
//                                         //     ? 10
//                                         //     : 12,
//                                         // },
//                                       ]}>
//                                       +{order.items.length - 1}
//                                     </Text>
//                                   </LinearGradient>
//                                 </View>
//                               )}
//                             </View>
//                           </View>
//                         )}

//                       {expandedOrders.includes(order._id) && (
//                         <View style={styles.orderItemsContainer}>
//                           {order.items.map((item, itemIndex) => (
//                             <View
//                               key={itemIndex}
//                               style={[
//                                 styles.orderItem,
//                                 // {
//                                 //   marginTop: hp(1.2),
//                                 //   padding: wp(3.8),
//                                 // },
//                               ]}>
//                               <ScrollImage
//                                 product={order.items[itemIndex]?.productId}
//                                 reffer="cart"
//                               />
//                               <View
//                                 style={[
//                                   styles.productDetails,
//                                   {
//                                     marginLeft: wp(4),
//                                   },
//                                 ]}>
//                                 <Text
//                                   style={[
//                                     styles.productName,
//                                     // {
//                                     //   fontSize: isTablet
//                                     //     ? 17
//                                     //     : isSmallScreen
//                                     //     ? 13
//                                     //     : 15,
//                                     // },
//                                   ]}>
//                                   {item.productId.name}
//                                 </Text>
//                                 <Text
//                                   style={[
//                                     styles.productSize,
//                                     // {
//                                     //   fontSize: isTablet
//                                     //     ? 15
//                                     //     : isSmallScreen
//                                     //     ? 11
//                                     //     : 13,
//                                     // },
//                                   ]}>
//                                   Variant: {item.variant}
//                                 </Text>
//                                 <Text
//                                   style={[
//                                     styles.productQuantity,
//                                     // {
//                                     //   fontSize: isTablet
//                                     //     ? 15
//                                     //     : isSmallScreen
//                                     //     ? 11
//                                     //     : 13,
//                                     // },
//                                   ]}>
//                                   Quantity: {item.quantity}
//                                 </Text>
//                               </View>
//                             </View>
//                           ))}
//                         </View>
//                       )}
//                     </View>
//                     {order.items.length > 1 && (
//                       <TouchableOpacity
//                         onPress={() => toggleOrderExpand(order._id)}
//                         style={{
//                           borderBottomLeftRadius: 10,
//                           borderBottomRightRadius: 10,
//                           marginTop: -10,
//                           paddingTop: hp(0.9),
//                         }}>
//                         <Icon
//                           name={
//                             expandedOrders.includes(order._id)
//                               ? 'chevron-up'
//                               : 'chevron-down'
//                           }
//                           style={{alignSelf: 'center'}}
//                           size={isTablet ? 28 : isSmallScreen ? 20 : 24}
//                           color="#fff"
//                         />
//                       </TouchableOpacity>
//                     )}
//                   </View>
//                   <View style={{marginTop: hp(1.2)}}>
//                     {order.status === 'Invoice Uploaded' ||
//                     order.status === 'Quote Sent' ||
//                     order.status === 'Partially Fulfilled' ? (
//                       <View
//                         style={{
//                           flexDirection: isSmallScreen ? 'column' : 'row',
//                           justifyContent: 'space-between',
//                           gap: isSmallScreen ? hp(1) : 0,
//                         }}>
//                         <LinearGradient
//                           colors={['#101924', '#38587F']}
//                           start={{x: 0, y: 0}}
//                           end={{x: 1, y: 0}}
//                           style={[
//                             styles.confirmButton,
//                             {
//                               width: isSmallScreen ? '100%' : '45%',
//                             },
//                           ]}>
//                           <TouchableOpacity
//                             style={[
//                               styles.quoteButton,
//                               {
//                                 paddingVertical: hp(1.2),
//                               },
//                             ]}
//                             onPress={() => handleConfirmOrder(order._id)}
//                             disabled={processing}>
//                             <Text
//                               style={[
//                                 styles.quoteButtonText,
//                                 {
//                                   color: '#FFF',
//                                   // fontSize: isTablet
//                                   //   ? 16
//                                   //   : isSmallScreen
//                                   //   ? 12
//                                   //   : 14,
//                                 },
//                               ]}>
//                               {processing ? 'Processing...' : 'Confirm'}
//                             </Text>
//                           </TouchableOpacity>
//                         </LinearGradient>
//                         <LinearGradient
//                           colors={['#FFF', '#FFF']}
//                           start={{x: 0, y: 0}}
//                           end={{x: 1, y: 0}}
//                           style={[
//                             styles.confirmButton,
//                             {
//                               borderColor: '#101924',
//                               borderWidth: 1,
//                               width: isSmallScreen ? '100%' : '45%',
//                               // paddingHorizontal: wp(1.25),
//                             },
//                           ]}>
//                           <TouchableOpacity
//                             style={[
//                               styles.quoteButton,
//                               {
//                                 paddingVertical: hp(1.2),
//                               },
//                             ]}
//                             onPress={() => handleReworkOrder(order._id)}
//                             disabled={processing}>
//                             <Text
//                               style={[
//                                 styles.quoteButtonText,
//                                 {
//                                   color: '#101924',
//                                 },
//                               ]}>
//                               {processing ? 'Processing...' : 'Rework'}
//                             </Text>
//                           </TouchableOpacity>
//                         </LinearGradient>
//                       </View>
//                     ) : null}
//                   </View>
//                 </View>
//               </View>
//             ))
//           )}
//         </ScrollView>
//       </View>

//       {/* Rework Modal */}
//       <Modal
//         visible={reworkModalVisible}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={() => {
//           setReworkModalVisible(false);
//           setReworkReason('');
//         }}>
//         <View style={[styles.modalContainer, {padding: wp(5)}]}>
//           <View
//             style={[
//               styles.modalContent,
//               {
//                 padding: wp(5),
//                 width: isTablet ? '80%' : '100%',
//                 maxWidth: isTablet ? 500 : 400,
//               },
//             ]}>
//             <Text
//               style={[
//                 styles.modalTitle,
//                 {
//                   fontSize: isTablet ? 20 : 18,
//                   marginBottom: hp(1.2),
//                 },
//               ]}>
//               Request Rework
//             </Text>
//             <Text
//               style={[
//                 styles.modalSubtitle,
//                 {
//                   fontSize: isTablet ? 16 : 14,
//                   marginBottom: hp(1.8),
//                 },
//               ]}>
//               Please provide a reason for your rework request:
//             </Text>
//             <TextInput
//               style={[
//                 styles.reasonInput,
//                 {
//                   padding: wp(2.5),
//                   marginBottom: hp(2.4),
//                   height: hp(12),
//                   fontSize: isTablet ? 16 : 14,
//                 },
//               ]}
//               placeholder="Enter reason for rework"
//               multiline={true}
//               numberOfLines={4}
//               value={reworkReason}
//               onChangeText={setReworkReason}
//             />
//             <View style={styles.modalButtons}>
//               <TouchableOpacity
//                 style={[
//                   styles.modalButton,
//                   styles.cancelButton,
//                   {
//                     padding: hp(1.4),
//                     marginHorizontal: wp(1.25),
//                   },
//                 ]}
//                 onPress={() => {
//                   setReworkModalVisible(false);
//                   setReworkReason('');
//                 }}>
//                 <Text
//                   style={[
//                     styles.cancelButtonText,
//                     {
//                       fontSize: isTablet ? 16 : 14,
//                     },
//                   ]}>
//                   Cancel
//                 </Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[
//                   styles.modalButton,
//                   styles.submitButton,
//                   {
//                     padding: hp(1.4),
//                     marginHorizontal: wp(1.25),
//                   },
//                 ]}
//                 onPress={submitReworkRequest}
//                 disabled={processing}>
//                 <Text
//                   style={[
//                     styles.submitButtonText,
//                     {
//                       fontSize: isTablet ? 16 : 14,
//                     },
//                   ]}>
//                   {processing ? 'Submitting...' : 'Submit'}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// export default OrderHistory;

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

// Get screen dimensions
const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

// Responsive helper functions
const wp = percentage => {
  return (percentage * screenWidth) / 100;
};

const hp = percentage => {
  return (percentage * screenHeight) / 100;
};

const isTablet = screenWidth >= 768;
const isSmallScreen = screenWidth < 380;

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
  const [dropdownVisible, setDropdownVisible] = useState(false);
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

  // Dropdown animation functions
  const toggleDropdown = () => {
    const toValue = dropdownVisible ? 0 : 1;

    Animated.timing(dropdownAnimation, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();

    setDropdownVisible(!dropdownVisible);
  };

  const selectFilter = filter => {
    setActiveTab(filter);
    toggleDropdown();
  };

  const dropdownHeight = dropdownAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, filterTabs.length * hp(6)], // Adjust height based on number of items
  });

  const dropdownOpacity = dropdownAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const rotateIcon = dropdownAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={styles.container}>
      <DashboardHeader />
      <View style={[styles.headerContainer, {marginTop: hp(-4)}]}>
        <View
          style={[
            styles.userInfoCard,
            {
              marginTop: hp(-6),
              margin: wp(4),
              padding: wp(4),
            },
          ]}>
          <Image
            source={{
              uri: fallbackImg(),
            }}
            style={[styles.userAvatar]}
          />
          <View style={[styles.userTextContainer, {marginLeft: wp(4)}]}>
            <Text style={[styles.userName]}>{user?.name}</Text>
            <Text style={[styles.userEmail]}>{user?.email}</Text>
          </View>
        </View>

        <View
          style={{
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}>
          {/* Updated Filter Dropdown */}
          <View style={styles.filterContainer}>
            <TouchableOpacity
              style={styles.dropdownToggle}
              onPress={toggleDropdown}
              activeOpacity={0.8}>
              <LinearGradient
                colors={['#38587F', '#101924']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.dropdownButton}>
                <Text style={styles.dropdownButtonText}>{activeTab}</Text>
                <Animated.View style={{transform: [{rotate: rotateIcon}]}}>
                  <Icon
                    name="chevron-down"
                    size={isTablet ? 22 : 18}
                    color="#FFF"
                  />
                </Animated.View>
              </LinearGradient>
            </TouchableOpacity>

            <Animated.View
              style={[
                styles.dropdownMenu,
                {
                  height: dropdownHeight,
                  opacity: dropdownOpacity,
                },
              ]}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}>
                {filterTabs.map((filter, index) => (
                  <TouchableOpacity
                    key={filter}
                    style={[
                      styles.dropdownItem,
                      activeTab === filter && styles.activeDropdownItem,
                      index === filterTabs.length - 1 &&
                        styles.lastDropdownItem,
                    ]}
                    onPress={() => selectFilter(filter)}
                    activeOpacity={0.7}>
                    <View style={styles.dropdownItemContent}>
                      <Text
                        style={[
                          styles.dropdownItemText,
                          activeTab === filter && styles.activeDropdownItemText,
                        ]}>
                        {filter}
                      </Text>
                      {activeTab === filter && (
                        <Icon
                          name="check"
                          size={isTablet ? 20 : 16}
                          color="#38587F"
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </Animated.View>
          </View>
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
              <View
                key={index}
                style={[
                  styles.orderCard,
                  {
                    marginBottom: hp(2),
                  },
                ]}>
                <View
                  style={[
                    styles.orderHeader,
                    {
                      paddingHorizontal: wp(4),
                      paddingBottom: hp(1.2),
                    },
                  ]}>
                  <View
                    style={[
                      styles.orderDetails,
                      {
                        marginTop: hp(1),
                      },
                    ]}>
                    <View>
                      <Text style={[styles.orderIdText]}>
                        Order #{order?._id.slice(-9)}
                      </Text>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View
                          style={[
                            styles.statusDot,
                            {
                              backgroundColor: getStatusColor(order.status),
                              width: wp(2.5),
                              height: wp(2.5),
                              borderRadius: wp(1.25),
                              marginRight: wp(2),
                            },
                          ]}
                        />
                        <Text style={[styles.orderStatus]}>{order.status}</Text>
                      </View>
                    </View>
                    <View>
                      <Text style={[styles.orderDateText]}>
                        Placed on {formatDate(order.createdAt)}
                      </Text>
                      {!order.isPartialOrder && (
                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          <InfoIcon
                            name="info-with-circle"
                            size={isTablet ? 20 : isSmallScreen ? 16 : 18}
                            color="#101924"
                          />
                          <Text
                            style={{
                              fontSize: isTablet ? 15 : isSmallScreen ? 11 : 13,
                              color: 'black',
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
                      marginTop: hp(1.2),
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
                            <View
                              style={[
                                styles.orderItem,
                                {
                                  marginTop: hp(1.2),
                                  padding: wp(3.8),
                                },
                              ]}>
                              <ScrollImage
                                product={order.items[0]?.productId}
                                reffer="cart"
                              />
                              <View
                                style={[
                                  styles.productDetails,
                                  {
                                    marginLeft: wp(4),
                                  },
                                ]}>
                                <Text style={[styles.productName]}>
                                  {order.items[0].productId.name}
                                </Text>
                                <Text style={[styles.productSize]}>
                                  <Text style={{fontWeight: '700'}}>
                                    Variant
                                  </Text>
                                  : {order.items[0].variant}
                                </Text>
                                <Text style={[styles.productQuantity]}>
                                  Quantity: {order.items[0].quantity}
                                </Text>
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
                        <View style={styles.orderItemsContainer}>
                          {order.items.map((item, itemIndex) => (
                            <View key={itemIndex} style={[styles.orderItem]}>
                              <ScrollImage
                                product={order.items[itemIndex]?.productId}
                                reffer="cart"
                              />
                              <View
                                style={[
                                  styles.productDetails,
                                  {
                                    marginLeft: wp(4),
                                  },
                                ]}>
                                <Text style={[styles.productName]}>
                                  {item.productId.name}
                                </Text>
                                <Text style={[styles.productSize]}>
                                  Variant: {item.variant}
                                </Text>
                                <Text style={[styles.productQuantity]}>
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
                            justifyContent: 'space-between',
                            gap: isSmallScreen ? hp(1) : 0,
                          }}>
                          <LinearGradient
                            colors={['#101924', '#38587F']}
                            start={{x: 0, y: 0}}
                            end={{x: 1, y: 0}}
                            style={[
                              styles.confirmButton,
                              {
                                width: isSmallScreen ? '100%' : '45%',
                              },
                            ]}>
                            <TouchableOpacity
                              style={[
                                styles.quoteButton,
                                {
                                  paddingVertical: hp(1.2),
                                },
                              ]}
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
                                width: isSmallScreen ? '100%' : '45%',
                              },
                            ]}>
                            <TouchableOpacity
                              style={[
                                styles.quoteButton,
                                {
                                  paddingVertical: hp(1.2),
                                },
                              ]}
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

                  <View style={{marginTop: hp(1.2)}}>
                    {order.status === 'Invoice Uploaded' ? (
                      <View
                        style={{
                          flexDirection: isSmallScreen ? 'column' : 'row',
                          justifyContent: 'space-between',
                          gap: isSmallScreen ? hp(1) : 0,
                        }}>
                        <LinearGradient
                          colors={['#101924', '#38587F']}
                          start={{x: 0, y: 0}}
                          end={{x: 1, y: 0}}
                          style={[
                            styles.confirmButton,
                            {
                              width: isSmallScreen ? '100%' : '45%',
                            },
                          ]}>
                          <TouchableOpacity
                            style={[
                              styles.quoteButton,
                              {
                                paddingVertical: hp(1.2),
                              },
                            ]}
                            onPress={() => handleConfirmOrder(order._id)}
                            disabled={processing}>
                            <Text
                              style={[
                                styles.quoteButtonText,
                                {
                                  color: '#FFF',
                                },
                              ]}>
                              {processing
                                ? 'Processing...'
                                : 'View the Invoice'}
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
                              width: isSmallScreen ? '100%' : '45%',
                            },
                          ]}>
                          <TouchableOpacity
                            style={[
                              styles.quoteButton,
                              {
                                paddingVertical: hp(1.2),
                              },
                            ]}
                            onPress={() => handleReworkOrder(order._id)}
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
                                : 'Downoload the Invoice'}
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
                    width: isSmallScreen ? '100%' : '45%',
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

      {/* Overlay to close dropdown */}
      {dropdownVisible && (
        <TouchableOpacity
          style={styles.dropdownOverlay}
          onPress={toggleDropdown}
          activeOpacity={1}
        />
      )}
    </View>
  );
};

export default OrderHistory;
