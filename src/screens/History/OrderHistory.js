// import React, {useCallback, useState, useMemo} from 'react';
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   FlatList,
//   TouchableWithoutFeedback,
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import {useFocusEffect, useNavigation} from '@react-navigation/native';
// import DashboardHeader from '../../components/Header/DashBoardHeader';
// import styles from './History.styles';
// import {useLoader} from '../../context/LoaderContext';
// import emptyImage from '../../assets/empty.png';
// import TrackingCard from '../../components/TrackingCard/TrackingCard';
// import {hp} from '../../utils/Responsive/responsive';
// import OrderCardShimmer from './OrderCardShimmer';
// import api from '../../redux/api';

// const OrderHistory = () => {
//   const [activeTab, setActiveTab] = useState('All Orders');
//   const [orders, setOrders] = useState([]);
//   const {setLoading} = useLoader();
//   const navigation = useNavigation();
//   const [isLoadingLocal, setIsLoadingLocal] = useState(true);

//   const fetchOrders = useCallback(async (forceRefresh = false) => {
//     setIsLoadingLocal(true);
//     setLoading(true);

//     try {
//       const response = await api.get(`/order/user-orders`);
//       setOrders(response.data);
//     } catch (error) {
//       console.log('Error fetching orders:', error.message);
//     } finally {
//       setLoading(false);
//       setIsLoadingLocal(false);
//     }
//   }, []);

//   useFocusEffect(
//     useCallback(() => {
//       let isActive = true;

//       const load = async () => {
//         if (isActive) {
//           await fetchOrders();
//         }
//       };

//       load();

//       return () => {
//         isActive = false;
//       };
//     }, [fetchOrders]),
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

//   // Memoize filtered orders to prevent unnecessary recalculations
//   const filteredOrders = useMemo(() => {
//     return orders.filter(
//       order => activeTab === 'All Orders' || order.status === activeTab,
//     );
//   }, [orders, activeTab]);

//   const selectFilter = useCallback(filter => {
//     setActiveTab(filter);
//   }, []);

//   const renderFilterTab = useCallback(
//     ({item: filter, index}) => (
//       <TouchableWithoutFeedback
//         key={index}
//         onPress={() => selectFilter(filter)}>
//         <View
//           style={[
//             styles.tabButton,
//             activeTab === filter && styles.activeTabButton,
//           ]}>
//           {activeTab === filter ? (
//             <LinearGradient
//               colors={['#2D4565', '#2D4565', '#1B2B48', '#1B2B48']}
//               start={{x: 0, y: 0}}
//               end={{x: 0, y: 1}}
//               style={styles.activeGradient}>
//               <Text style={styles.activeTabText}>{filter}</Text>
//             </LinearGradient>
//           ) : (
//             <Text style={styles.inactiveTabText}>{filter}</Text>
//           )}
//         </View>
//       </TouchableWithoutFeedback>
//     ),
//     [activeTab, selectFilter],
//   );

//   // Memoize the order card rendering
//   const renderOrderCard = useCallback(
//     ({item: order, index}) => (
//       <TrackingCard
//         key={order._id || index}
//         index={index}
//         order={order}
//         fetchOrders={fetchOrders}
//       />
//     ),
//     [],
//   );

//   // Memoize the shimmer rendering
//   const renderShimmer = useCallback(
//     ({item, index}) => <OrderCardShimmer key={index} />,
//     [],
//   );

//   // Memoize the empty state component
//   const renderEmptyState = useCallback(
//     () => (
//       <View style={styles.emptyContainer}>
//         <Image
//           source={emptyImage}
//           style={styles.emptyImage}
//           resizeMode="contain"
//         />
//         <Text style={styles.emptyTitle}>No Orders Yet</Text>
//         <Text style={styles.emptySubtitle}>
//           You haven't ordered any products yet. Start by exploring our dye &
//           chemical range.
//         </Text>
//         <LinearGradient
//           colors={['#38587F', '#101924']}
//           start={{x: 0, y: 0}}
//           end={{x: 1, y: 0}}
//           style={{
//             flexDirection: 'row',
//             alignItems: 'center',
//             paddingHorizontal: 6,
//             borderRadius: 100,
//           }}>
//           <TouchableOpacity
//             style={styles.goBackButton}
//             onPress={() => navigation.goBack()}>
//             <Text style={styles.goBackText}>GO BACK</Text>
//           </TouchableOpacity>
//         </LinearGradient>
//       </View>
//     ),
//     [navigation],
//   );

//   // Key extractor for FlatList
//   const keyExtractor = useCallback(
//     (item, index) => item._id || index.toString(),
//     [],
//   );

//   return (
//     <View style={styles.container}>
//       <DashboardHeader />
//       <View style={[styles.headerContainer, {marginTop: hp(-10)}]}>
//         <View style={styles.filterTabsContainer}>
//           <FlatList
//             data={filterTabs}
//             renderItem={renderFilterTab}
//             keyExtractor={(item, index) => item + index}
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={styles.tabScrollContainer}
//           />
//         </View>

//         {isLoadingLocal ? (
//           <FlatList
//             data={[1, 2, 3, 4, 5]}
//             renderItem={renderShimmer}
//             keyExtractor={(item, index) => `shimmer-${index}`}
//             contentContainerStyle={styles.ordersContainer}
//             showsVerticalScrollIndicator={false}
//           />
//         ) : (
//           <FlatList
//             data={filteredOrders}
//             renderItem={renderOrderCard}
//             keyExtractor={keyExtractor}
//             contentContainerStyle={[
//               styles.ordersContainer,
//               filteredOrders.length === 0 && styles.emptyContainer,
//             ]}
//             showsVerticalScrollIndicator={false}
//             ListEmptyComponent={renderEmptyState}
//             removeClippedSubviews={true}
//             maxToRenderPerBatch={10}
//             windowSize={10}
//             initialNumToRender={10}
//             updateCellsBatchingPeriod={50}
//             onRefresh={() => fetchOrders(true)}
//             refreshing={isLoadingLocal}
//           />
//         )}
//       </View>
//     </View>
//   );
// };

// export default React.memo(OrderHistory);

import React, {useCallback, useState, useMemo} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import DashboardHeader from '../../components/Header/DashBoardHeader';
import styles from './History.styles';
import {useLoader} from '../../context/LoaderContext';
import emptyImage from '../../assets/empty.png';
import TrackingCard from '../../components/TrackingCard/TrackingCard';
import {hp} from '../../utils/Responsive/responsive';
import OrderCardShimmer from './OrderCardShimmer';
import api from '../../redux/api';

const OrderHistory = () => {
  const [activeTab, setActiveTab] = useState('All Orders');
  const [orders, setOrders] = useState([]);
  const {setLoading} = useLoader();
  const navigation = useNavigation();
  const [isLoadingLocal, setIsLoadingLocal] = useState(true);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const fetchOrders = useCallback(
    async (forceRefresh = false) => {
      // Only show global loader on initial load
      if (!hasLoadedOnce) {
        setLoading(true);
      }
      setIsLoadingLocal(true);

      console.log(`${api}/order/user-orders`);
      try {
        const response = await api.get(`/order/user-orders`);
        console.log('response data', response.data);
        setOrders(response.data);
        setHasLoadedOnce(true);
      } catch (error) {
        console.log(error.response);
        console.log('Error fetching orders:', error.message);
      } finally {
        setLoading(false);
        setIsLoadingLocal(false);
      }
    },
    [hasLoadedOnce],
  );

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const load = async () => {
        if (isActive) {
          await fetchOrders();
        }
      };

      load();

      return () => {
        isActive = false;
      };
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

  const selectFilter = useCallback(filter => {
    setActiveTab(filter);
  }, []);

  const renderFilterTab = useCallback(
    ({item: filter, index}) => (
      <TouchableWithoutFeedback
        key={index}
        onPress={() => selectFilter(filter)}>
        <View
          style={[
            styles.tabButton,
            activeTab === filter && styles.activeTabButton,
          ]}>
          {activeTab === filter ? (
            <LinearGradient
              colors={['#2D4565', '#2D4565', '#1B2B48', '#1B2B48']}
              start={{x: 0, y: 0}}
              end={{x: 0, y: 1}}
              style={styles.activeGradient}>
              <Text style={styles.activeTabText}>{filter}</Text>
            </LinearGradient>
          ) : (
            <Text style={styles.inactiveTabText}>{filter}</Text>
          )}
        </View>
      </TouchableWithoutFeedback>
    ),
    [activeTab, selectFilter],
  );

  // Memoize the order card rendering
  const renderOrderCard = useCallback(
    ({item: order, index}) => (
      <TrackingCard
        key={order._id || index}
        index={index}
        order={order}
        fetchOrders={fetchOrders}
      />
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
      <View style={[styles.headerContainer, {marginTop: hp(-10)}]}>
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

        {/* Show shimmer only on initial load when we don't have data */}
        {isLoadingLocal && !hasLoadedOnce ? (
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
              filteredOrders.length === 0 && styles.emptyOrdersContainer,
            ]}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderEmptyState}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={10}
            initialNumToRender={10}
            updateCellsBatchingPeriod={50}
            onRefresh={() => fetchOrders(true)}
            refreshing={isLoadingLocal && hasLoadedOnce} // Only show refresh indicator after initial load
          />
        )}
      </View>
    </View>
  );
};

export default React.memo(OrderHistory);
