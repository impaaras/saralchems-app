import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity, ScrollView} from 'react-native';
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

const OrderHistory = () => {
  const [activeTab, setActiveTab] = useState('All Orders');
  const [expandedOrders, setExpandedOrders] = useState([]);
  const [orders, setOrders] = useState([]);
  const {setLoading} = useLoader();
  const navigation = useNavigation();

  const fetchOrders = async () => {
    setLoading(true);
    const token = storage.getString(StorageKeys.AUTH_TOKEN);
    try {
      const response = await axios.get(`${API_URL}/order/user-orders`, {
        headers: {Authorization: `Bearer ${token}`},
      });
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, []),
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

  // Updated button handlers
  const handleInvoiceConfirmOrder = orderId => {
    setShowInvoice(true);
  };

  const handleInvoiceReworkOrder = orderId => {
    setShowInvoice(true);
  };

  // Filter orders based on active tab
  const filteredOrders = orders.filter(
    order => activeTab === 'All Orders' || order.status === activeTab,
  );

  const user = useSelector(state => state.auth.user);

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
          {filteredOrders.length === 0 ? (
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
    </View>
  );
};

export default OrderHistory;
