// import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
// import {View, Text, Image, TouchableOpacity, ScrollView} from 'react-native';
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
// import emptyImage from '../../assets/empty.png';
// import {ROUTES} from '../../constants/routes';
// import TrackingCard from '../../components/TrackingCard/TrackingCard';
// import {hp, scale} from '../../utils/Responsive/responsive';
// import OrderCardShimmer from './OrderCardShimmer';

// const OrderHistory = () => {
//   const [activeTab, setActiveTab] = useState('All Orders');
//   const [expandedOrders, setExpandedOrders] = useState([]);
//   const [orders, setOrders] = useState([]);
//   const {setLoading} = useLoader();
//   const navigation = useNavigation();
//   const [isLoadingLocal, setIsLoadingLocal] = useState(true);

//   const fetchOrders = async () => {
//     setIsLoadingLocal(true); // <-- local shimmer trigger
//     setLoading(true);
//     const token = storage.getString(StorageKeys.AUTH_TOKEN);
//     try {
//       const response = await axios.get(`${API_URL}/order/user-orders`, {
//         headers: {Authorization: `Bearer ${token}`},
//       });
//       setOrders(response.data);
//     } catch (error) {
//       setLoading(false);
//     } finally {
//       setLoading(false);
//       setIsLoadingLocal(false); // <-- shimmer stop
//     }
//   };

//   useFocusEffect(
//     useCallback(() => {
//       fetchOrders();
//     }, []),
//   );

//   const filterTabs = [
//     'All Orders',
//     'Quote Sent',
//     'Invoice Uploaded',
//     'Confirmed',
//     'Rework',
//     'Packing',
//     'Dispatched',
//     'Delivered',
//   ];

//   // Updated button handlers
//   const handleInvoiceConfirmOrder = orderId => {
//     setShowInvoice(true);
//   };

//   const handleInvoiceReworkOrder = orderId => {
//     setShowInvoice(true);
//   };

//   // Filter orders based on active tab
//   const filteredOrders = orders.filter(
//     order => activeTab === 'All Orders' || order.status === activeTab,
//   );

//   const user = useSelector(state => state.auth.user);

//   const selectFilter = filter => {
//     setActiveTab(filter);
//   };

//   return (
//     <View style={styles.container}>
//       <DashboardHeader />
//       <View style={[styles.headerContainer, {marginTop: hp(-4)}]}>
//         <View
//           style={[
//             styles.userInfoCard,
//             {
//               marginTop: scale(-40),
//               margin: scale(15),
//               padding: scale(15),
//             },
//           ]}>
//           <Image
//             source={{
//               uri: fallbackImg(),
//             }}
//             style={[styles.userAvatar]}
//           />
//           <View style={[styles.userTextContainer]}>
//             <Text style={[styles.userName]}>{user?.name}</Text>
//             <Text style={[styles.userEmail]}>{user?.email}</Text>
//           </View>
//         </View>

//         <View style={styles.filterTabsContainer}>
//           <ScrollView
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={styles.tabScrollContainer}>
//             {filterTabs.map((filter, index) => (
//               <TouchableOpacity
//                 key={index}
//                 onPress={() => selectFilter(filter)}
//                 activeOpacity={0.8}
//                 style={[
//                   styles.tabButton,
//                   activeTab === filter && styles.activeTabButton,
//                 ]}>
//                 {activeTab === filter ? (
//                   <LinearGradient
//                     colors={['#38587F', '#101924']}
//                     start={{x: 0, y: 0}}
//                     end={{x: 1, y: 0}}
//                     style={styles.activeGradient}>
//                     <Text style={styles.activeTabText}>{filter}</Text>
//                   </LinearGradient>
//                 ) : (
//                   <Text style={styles.inactiveTabText}>{filter}</Text>
//                 )}
//               </TouchableOpacity>
//             ))}
//           </ScrollView>
//         </View>
//         <ScrollView
//           contentContainerStyle={styles.ordersContainer}
//           showsVerticalScrollIndicator={false}>
//           {isLoadingLocal ? (
//             <>
//               {[1, 2, 3, 4, 5].map((_, index) => {
//                 return <OrderCardShimmer key={index} />;
//               })}
//             </>
//           ) : filteredOrders.length === 0 ? (
//             <ScrollView contentContainerStyle={styles.emptyContainer}>
//               <Image
//                 source={emptyImage}
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
//               <TrackingCard
//                 key={order._id || index}
//                 index={index}
//                 order={order}
//               />
//             ))
//           )}
//         </ScrollView>
//       </View>
//     </View>
//   );
// };

// export default OrderHistory;

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
  useMemo,
} from 'react';
import {View, Text, Image, TouchableOpacity, FlatList} from 'react-native';
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
import emptyImage from '../../assets/empty.png';
import {ROUTES} from '../../constants/routes';
import TrackingCard from '../../components/TrackingCard/TrackingCard';
import {hp, scale} from '../../utils/Responsive/responsive';
import OrderCardShimmer from './OrderCardShimmer';

const OrderHistory = () => {
  const [activeTab, setActiveTab] = useState('All Orders');
  const [expandedOrders, setExpandedOrders] = useState([]);
  const [orders, setOrders] = useState([]);
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const {setLoading} = useLoader();
  const navigation = useNavigation();
  const [isLoadingLocal, setIsLoadingLocal] = useState(true);

  // Cache duration in milliseconds (5 minutes)
  const CACHE_DURATION = 5 * 60 * 1000;

  const fetchOrders = useCallback(
    async (forceRefresh = false) => {
      const currentTime = Date.now();

      // Check if we need to fetch (no cache or cache expired or force refresh)
      if (
        !forceRefresh &&
        orders.length > 0 &&
        currentTime - lastFetchTime < CACHE_DURATION
      ) {
        return;
      }

      setIsLoadingLocal(true);
      setLoading(true);
      const token = storage.getString(StorageKeys.AUTH_TOKEN);

      try {
        const response = await axios.get(`${API_URL}/order/user-orders`, {
          headers: {Authorization: `Bearer ${token}`},
        });
        setOrders(response.data);
        setLastFetchTime(currentTime);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
        setIsLoadingLocal(false);
      }
    },
    [orders.length, lastFetchTime, setLoading],
  );

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [fetchOrders]),
  );

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

  // Memoize filtered orders to prevent unnecessary recalculations
  const filteredOrders = useMemo(() => {
    return orders.filter(
      order => activeTab === 'All Orders' || order.status === activeTab,
    );
  }, [orders, activeTab]);

  const user = useSelector(state => state.auth.user);

  const selectFilter = useCallback(filter => {
    setActiveTab(filter);
  }, []);

  // Memoize the filter tab rendering
  const renderFilterTab = useCallback(
    ({item: filter, index}) => (
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
    ),
    [activeTab, selectFilter],
  );

  // Memoize the order card rendering
  const renderOrderCard = useCallback(
    ({item: order, index}) => (
      <TrackingCard key={order._id || index} index={index} order={order} />
    ),
    [],
  );

  // Memoize the shimmer rendering
  const renderShimmer = useCallback(
    ({item, index}) => <OrderCardShimmer key={index} />,
    [],
  );

  // Memoize the empty state component
  const renderEmptyState = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Image
          source={emptyImage}
          style={styles.emptyImage}
          resizeMode="contain"
        />
        <Text style={styles.emptyTitle}>No Orders Yet</Text>
        <Text style={styles.emptySubtitle}>
          You haven't ordered any products yet. Start by exploring our dye &
          chemical range.
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
      </View>
    ),
    [navigation],
  );

  // Key extractor for FlatList
  const keyExtractor = useCallback(
    (item, index) => item._id || index.toString(),
    [],
  );

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
          <FlatList
            data={filterTabs}
            renderItem={renderFilterTab}
            keyExtractor={(item, index) => item + index}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabScrollContainer}
          />
        </View>

        {isLoadingLocal ? (
          <FlatList
            data={[1, 2, 3, 4, 5]}
            renderItem={renderShimmer}
            keyExtractor={(item, index) => `shimmer-${index}`}
            contentContainerStyle={styles.ordersContainer}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <FlatList
            data={filteredOrders}
            renderItem={renderOrderCard}
            keyExtractor={keyExtractor}
            contentContainerStyle={[
              styles.ordersContainer,
              filteredOrders.length === 0 && styles.emptyContainer,
            ]}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderEmptyState}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={10}
            initialNumToRender={10}
            updateCellsBatchingPeriod={50}
            onRefresh={() => fetchOrders(true)}
            refreshing={isLoadingLocal}
          />
        )}
      </View>
    </View>
  );
};

export default React.memo(OrderHistory);
