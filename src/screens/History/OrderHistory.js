import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Entypo';
import {ROUTES} from '../../constants/routes';
import {useNavigation} from '@react-navigation/native';
import DashboardHeader from '../../components/Header/DashBoardHeader';
import {fallbackImg} from '../../utils/images';
import styles from './History.styles';

const OrderHistory = () => {
  const [activeTab, setActiveTab] = useState('All Orders');
  const [expandedOrders, setExpandedOrders] = useState([]);
  const navigation = useNavigation();

  // Sample data based on the image
  const orders = [
    {
      id: '#1234',
      status: 'Delivered',
      date: '20 Mar, 2024',
      value: '$323.52',
      items: [
        {
          name: 'Nylon (Brand)',
          size: `80"×56" (4 * 4')`,
          quantity: 8,
          price: '$200.00',
          image: fallbackImg(),
        },
      ],
    },
    {
      id: '#8234',
      status: 'Processing',
      date: '20 Mar, 2025',
      value: '$323.52',
      items: [
        {
          name: 'Nylon (Brand)',
          size: `80"×56" (4' × 4')`,
          quantity: 8,
          image: fallbackImg(),
        },
        {
          name: 'Nylon (Brand)',
          size: `80"×56" (4' × 4')`,
          quantity: 8,
          image: fallbackImg(),
        },
        {
          name: 'Nylon (Brand)',
          size: `80"×56" (4' × 4')`,
          quantity: 8,
          image: fallbackImg(),
        },
        {
          name: 'Nylon (Brand)',
          size: `80"×56" (4' × 4')`,
          quantity: 8,
          image: fallbackImg(),
        },
        {
          name: 'Nylon (Brand)',
          size: `80"×56" (4' × 4')`,
          quantity: 8,
          image: fallbackImg(),
        },
      ],
    },
    {
      id: '#1235',
      status: 'Shipped',
      date: '20 Mar, 2024',
      value: '$323.52',
      items: [
        {
          name: 'Nylon (Brand)',
          size: `80"×56" (4' × 4')`,
          quantity: 8,
          price: '$200.00',
          image: fallbackImg(),
        },
      ],
    },
  ];

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
      case 'Processing':
        return '#FF9800';
      case 'Shipped':
        return '#2196F3';
      default:
        return '#757575';
    }
  };

  const filterTabs = ['All Orders', 'Processing', 'Shipped', 'Delivered'];

  return (
    <View style={styles.container}>
      <DashboardHeader />
      <View style={styles.headerContainer}>
        <View style={styles.userInfoCard}>
          <Image
            source={{
              uri: fallbackImg(),
            }} // Use your actual asset
            style={styles.userAvatar}
          />
          <View style={styles.userTextContainer}>
            <Text style={styles.userName}>John Doe</Text>
            <Text style={styles.userEmail}>JohnDoe@gmail.com</Text>
          </View>
        </View>

        <View
          style={{
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}>
          {/* User Info */}

          <View style={styles.tabsContainer}>
            {filterTabs.map(tab => (
              <LinearGradient
                key={tab}
                colors={
                  activeTab && activeTab === tab
                    ? ['#38587F', '#101924']
                    : ['#FFF', '#FFF']
                }
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={[
                  styles.tabButton,
                  activeTab === tab && styles.activeTabButton,
                ]}
                // style={styles.receiptButton} // Make sure the gradient covers the button
              >
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
          {orders
            .filter(
              order => activeTab === 'All Orders' || order.status === activeTab,
            )
            .map((order, index) => (
              <View key={index} style={styles.orderCard}>
                <View
                  style={styles.orderHeader}
                  onPress={() => toggleOrderExpand(order.id)}>
                  <View style={styles.orderDetails}>
                    <View>
                      <Text style={styles.orderIdText}>Order {order.id}</Text>
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
                        Placed on {order.date}
                      </Text>
                      <Text style={styles.orderValueText}>
                        Total Bill Value: {order.value}
                      </Text>
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
                      {!expandedOrders.includes(order.id) &&
                        order.items.length > 0 && (
                          <View style={styles.orderItemsContainer}>
                            <View style={styles.orderItem}>
                              <TouchableOpacity
                              // onPress={() =>
                              //   navigation.navigate(ROUTES.PRODUCT_DETAILS)
                              // }
                              >
                                <Image
                                  source={{uri: order.items[0].image}}
                                  style={styles.productImage}
                                />
                              </TouchableOpacity>
                              <View style={styles.productDetails}>
                                <Text style={styles.productName}>
                                  {order.items[0].name}
                                </Text>
                                <Text style={styles.productSize}>
                                  {order.items[0].size}
                                </Text>
                                <Text style={styles.productQuantity}>
                                  Quantity: {order.items[0].quantity}
                                </Text>
                              </View>
                              {order.items.length > 2 && (
                                <View>
                                  <LinearGradient
                                    colors={['#38587F', '#101924']} // Left to right gradient colors
                                    start={{x: 0, y: 0}}
                                    end={{x: 1, y: 0}}
                                    style={styles.ratingContainer}>
                                    <Text style={styles.ratingText}>
                                      {order.items.length > 1
                                        ? '4+'
                                        : order.items.length}
                                    </Text>
                                  </LinearGradient>
                                </View>
                              )}
                            </View>
                          </View>
                        )}

                      {expandedOrders.includes(order.id) && (
                        <View style={styles.orderItemsContainer}>
                          {order.items.map((item, itemIndex) => (
                            <View key={itemIndex} style={styles.orderItem}>
                              <Image
                                source={{uri: item.image}}
                                style={styles.productImage}
                              />
                              <View style={styles.productDetails}>
                                <Text style={styles.productName}>
                                  {item.name}
                                </Text>
                                <Text style={styles.productSize}>
                                  {item.size}
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
                        onPress={() => toggleOrderExpand(order.id)}
                        style={{
                          borderBottomLeftRadius: 10,
                          borderBottomRightRadius: 10,
                          marginTop: -10,
                          paddingTop: 7,
                        }}>
                        <Icon
                          name={
                            expandedOrders.includes(order.id)
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
                </View>
              </View>
            ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default OrderHistory;
