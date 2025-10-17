// import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
// import React from 'react';
// import styles from './Index.styles';
// import DashboardHeader from '../../components/Header/DashBoardHeader';
// import {scale} from '../../utils/Responsive/responsive';
// import {fallbackImg} from '../../utils/images';
// import UserInfo from '../../components/UserInfoCard/UserInfo';
// import {ROUTES} from '../../constants/routes';

// const Index = () => {
//   return (
//     <SafeAreaView>
//       <DashboardHeader name="Account ledger page" />
//       <View style={styles.ledgerContainer}>
//         <UserInfo screenName={ROUTES.LEDGER} />
//       </View>
//     </SafeAreaView>
//   );
// };

// export default Index;

import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import styles from './Index.styles';
import DashboardHeader from '../../components/Header/DashBoardHeader';
import {
  scale,
  verticalScale,
  moderateScale,
} from '../../utils/Responsive/responsive';
import {fallbackImg} from '../../utils/images';
import UserInfo from '../../components/UserInfoCard/UserInfo';
import {ROUTES} from '../../constants/routes';
import {SearchIcon} from 'lucide-react-native';
import CustomGradientButton from '../../components/Buttons/Gradient/CustomGradientButton';

const Index = () => {
  const [activeTab, setActiveTab] = useState('Ordered');
  const [searchText, setSearchText] = useState('');

  // Sample data for ordered items
  const orderedData = [
    {
      id: '54321',
      type: 'Order',
      amount: '-$264.96',
      date: 'Mar 15, 2024',
      description: 'Purchase',
      status: 'pending',
    },
    {
      id: '54321',
      type: 'Order',
      amount: '-$264.96',
      date: 'Credit Limit',
      description: 'Purchase',
      status: 'pending',
    },
    {
      id: '54321',
      type: 'Order',
      amount: '-$264.96',
      date: 'Mar 15, 2024',
      description: 'Purchase',
      status: 'pending',
    },
    {
      id: '54321',
      type: 'Order',
      amount: '-$264.96',
      date: 'Mar 15, 2024',
      description: 'Purchase',
      status: 'pending',
    },
  ];

  // Sample data for payments
  const paymentData = [
    {
      id: 'payment1',
      type: 'Payment Received',
      amount: '+$500.00',
      date: 'Mar 10, 2024',
      description: 'Credit Limit',
      status: 'completed',
    },
    {
      id: 'payment2',
      type: 'Payment Received',
      amount: '+$500.00',
      date: 'Mar 10, 2024',
      description: 'Credit Limit',
      status: 'completed',
    },
    {
      id: 'payment3',
      type: 'Payment Received',
      amount: '+$500.00',
      date: 'Mar 10, 2024',
      description: 'Credit Limit',
      status: 'completed',
    },
    {
      id: 'payment4',
      type: 'Payment Received',
      amount: '+$500.00',
      date: 'Mar 10, 2024',
      description: 'Credit Limit',
      status: 'completed',
    },
  ];

  const renderOrderedItem = ({item}) => (
    <View style={styles.ledgerItem}>
      <View style={styles.itemLeft}>
        <Text style={styles.itemTitle}>Order #{item.id}</Text>
        <Text style={styles.itemDate}>{item.date}</Text>
      </View>
      <View style={styles.itemRight}>
        <CustomGradientButton
          size="md"
          title="Pay Now"
          onPress={() => {
            console.log('Repeat Order Pressed');
          }}
        />
        <View>
          <Text style={[styles.itemAmount, {color: '#FF0000'}]}>
            {item.amount}
          </Text>
          <Text style={[styles.itemDescription, {marginLeft: scale(6)}]}>
            {item.description}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderPaymentItem = ({item}) => (
    <View style={styles.ledgerItem}>
      <View style={styles.itemLeft}>
        <Text style={styles.itemTitle}>{item.type}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
      </View>
      <View style={styles.itemRight}>
        <View>
          <Text style={[styles.itemAmount, {color: '#006D0F'}]}>
            {item.amount}
          </Text>
          <Text style={styles.itemDate}>{item.date}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <DashboardHeader name="Account ledger page" />
      <View style={styles.ledgerContainer}>
        {/* <UserInfo screenName={ROUTES.LEDGER} /> */}
        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <View style={styles.tabButton}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'Ordered' && styles.activeTab]}
              onPress={() => setActiveTab('Ordered')}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'Ordered' && styles.activeTabText,
                ]}>
                Ordered
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'Payment' && styles.activeTab]}
              onPress={() => setActiveTab('Payment')}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'Payment' && styles.activeTabText,
                ]}>
                Payment
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.searchIconContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor="#A0A0A0"
              value={searchText}
              onChangeText={setSearchText}
            />
            <SearchIcon color="#555555" size={18} />
          </View>
        </View>

        {/* Account Ledger Section */}
        <View style={styles.shadowWrapper}>
          <View style={styles.ledgerSection}>
            <View style={styles.ledgerHeader}>
              <Text style={styles.ledgerTitle}>Account Ledger</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View all</Text>
              </TouchableOpacity>
            </View>

            {/* Ledger Items */}
            <ScrollView
              style={styles.ledgerList}
              showsVerticalScrollIndicator={false}>
              {activeTab === 'Ordered' ? (
                <FlatList
                  data={orderedData}
                  renderItem={renderOrderedItem}
                  keyExtractor={(item, index) => `${item.id}_${index}`}
                  scrollEnabled={false}
                  showsVerticalScrollIndicator={false}
                />
              ) : (
                <FlatList
                  data={paymentData}
                  renderItem={renderPaymentItem}
                  keyExtractor={(item, index) => `${item.id}_${index}`}
                  scrollEnabled={false}
                  showsVerticalScrollIndicator={false}
                />
              )}
            </ScrollView>
          </View>
        </View>
      </View>
      {/* Bulk Payment Button - Only show on Ordered tab */}
      {activeTab === 'Ordered' && (
        <View style={styles.bulkPaymentContainer}>
          <CustomGradientButton
            size="elg"
            title="Bulk payment"
            onPress={() => {
              console.log('Repeat Order Pressed');
            }}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default Index;
