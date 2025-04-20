'use client';

import {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import {
  Package,
  BookmarkCheck,
  Phone,
  MessageCircle,
} from 'lucide-react-native';
import {LinearGradient} from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import OrderTrackModal from '../../components/OrderTrackModal';
import ProductModal from '../ProductDetails/ProductModal';
import DashboardHeader from '../../components/Header/DashBoardHeader';
import {fallbackImg} from '../../utils/images';
import styles from './Tracking.styles';

const {width} = Dimensions.get('window');

const OrderTracking = ({order = sampleOrder}) => {
  const [expanded, setExpanded] = useState(false);
  const [visible, setVisible] = useState(false);

  // Determine the current step based on status
  const getCurrentStep = () => {
    const statusMap = {
      placed: 0,
      generated: 0,
      ready: 1,
      packing: 1,
      shipped: 1,
      delivered: 3,
    };

    return statusMap[order.status.toLowerCase()] || 0;
  };

  const currentStep = getCurrentStep();

  // Toggle expanded view
  const toggleExpand = () => {
    setExpanded(!expanded);
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

  return (
    <>
      <DashboardHeader />

      <View style={styles.container}>
        <View
          style={{
            borderWidth: 1,
            borderColor: '#CCC',
            margin: 15,
            borderRadius: 8,
          }}>
          <View style={styles.orderItemContainer}>
            <View>
              <Text style={styles.orderIdText}>Order #{order.id}</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
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
              <Text style={styles.orderDateText}>Placed on {order.date}</Text>
              <Text style={styles.orderValueText}>Total Bill Value: $299</Text>
            </View>
          </View>
          <View
            style={{
              backgroundColor: '#3C5D87',
              paddingBottom: 12,
              margin: 10,
              borderRadius: 8,
            }}>
            <View
              style={{
                backgroundColor: '#FFF',
                borderBottomLeftRadius: 8,
                borderBottomRightRadius: 8,
              }}>
              <View style={{}}>
                <View style={styles.orderItem}>
                  <Image
                    source={{
                      uri: fallbackImg(),
                    }}
                    style={styles.productImage}
                  />
                  <View style={styles.productDetails}>
                    <Text style={styles.productName}>Nylon </Text>
                    <Text style={styles.productSize}>70*020</Text>
                    <Text style={styles.productQuantity}>Quantity: 200</Text>
                  </View>
                  {/* <View style={styles.ratingContainer}>
                    <Text style={styles.ratingText}>
                      {order.items.length > 1 ? '4+' : order.items.length}
                    </Text>
                  </View> */}
                </View>
              </View>
            </View>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: '10%'}}
          style={[
            styles.trackingContainer,
            expanded && styles.expandedTracking,
          ]}>
          <View style={styles.trackingHeader}>
            <Text style={styles.trackingTitle}>Order Tracking</Text>
          </View>
          <View style={styles.timeline}>
            {/* Placed Order */}
            <TrackingStep
              title="Placed Order"
              dates={order.tracking.placed}
              isActive={currentStep >= 0}
              isCompleted={currentStep > 0}
              isFirst={true}
              expanded={expanded}
            />

            {/* Packing */}
            <TrackingStep
              title="Packing"
              dates={order.tracking.packing}
              isActive={currentStep >= 1}
              isCompleted={currentStep > 1}
              expanded={expanded}
            />

            {/* Shipping */}
            <TrackingStep
              title="Shipping"
              dates={order.tracking.shipping}
              isActive={currentStep >= 2}
              isCompleted={currentStep > 2}
              expanded={expanded}
            />

            {/* Delivered */}
            <TrackingStep
              title="Delivered"
              dates={order.tracking.delivered}
              isActive={currentStep >= 3}
              isCompleted={currentStep > 3}
              isLast={true}
              expanded={expanded}
            />
          </View>

          {/* Delivery Receipt Button */}
          {(currentStep >= 1 || expanded) && (
            <View style={styles.receiptContainer}>
              <LinearGradient
                colors={['#38587F', '#101924']} // Left to right gradient colors
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.receiptButton} // Make sure the gradient covers the button
              >
                <TouchableOpacity
                  style={{flexDirection: 'row', alignItems: 'center'}}>
                  <BookmarkCheck
                    size={22}
                    color="#fff"
                    style={styles.receiptIcon}
                  />
                  <Text style={styles.receiptText}>Delivery Receipt</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          )}

          {visible && (
            <OrderTrackModal
              visible={visible}
              onClose={() => setVisible(!visible)}
            />
          )}

          {/* {visible && (
          <ProductModal
            visible={visible}
            onClose={() => setVisible(!visible)}
          />
        )} */}

          <View style={styles.supportContainer}>
            <View style={styles.supportButtons}>
              <Text style={styles.supportText}>Need Support?</Text>
              <LinearGradient
                colors={['#38587F', '#101924']} // Left to right gradient colors
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.receiptButton} // Make sure the gradient covers the button
              >
                <TouchableOpacity style={styles.callButton}>
                  <Phone size={16} color="#fff" />
                  <Text style={styles.buttonText}>Call</Text>
                </TouchableOpacity>
              </LinearGradient>
              <LinearGradient
                colors={['#38587F', '#101924']} // Left to right gradient colors
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.receiptButton} // Make sure the gradient covers the button
              >
                <TouchableOpacity style={styles.whatsappButton}>
                  <Icon name="whatsapp" size={16} color="#fff" />
                  <Text style={styles.buttonText}>Whatsapp</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
};

// Individual tracking step component
const TrackingStep = ({
  title,
  dates,
  isActive,
  isCompleted,
  isFirst = false,
  isLast = false,
  expanded = false,
}) => {
  // Determine icon color based on status
  const getIconColor = () => {
    if (isCompleted) return '#3C5D87';
    if (isActive) return '#3C5D87';
    return '#D9D9D9';
  };

  // Determine background color based on status
  const getIconBgColor = () => {
    if (isCompleted) return '#3C5D87';
    if (isActive) return '#3C5D87';
    return '#D9D9D9';
  };

  // Determine line color based on status
  const getLineColor = () => {
    if (isCompleted) return '#3C5D87';
    return '#D9D9D9';
  };

  const getLineHeight = () => {
    // Base height for the step title
    let baseHeight = 24;

    // If expanded or step is active/completed, add height for each date entry
    if ((expanded || isActive || isCompleted) && dates) {
      // Each date entry takes approximately 40px (date + status + margin)
      baseHeight += dates.length * 40;
    }

    // Add some extra padding
    return baseHeight;
  };

  return (
    <View style={styles.stepContainer}>
      {/* Icon and Line */}
      <View style={styles.stepIconColumn}>
        <View
          style={[
            styles.stepIconContainer,
            {backgroundColor: getIconBgColor()},
          ]}>
          <Package size={30} color="#fff" />
        </View>

        {!isLast && (
          <View
            style={[
              styles.stepLine,
              {
                backgroundColor: getLineColor(),
                height: getLineHeight(),
              },
            ]}
          />
        )}
      </View>

      {/* Step Content */}
      <View style={styles.stepContent}>
        <Text style={styles.stepTitle}>{title}</Text>

        {/* Show dates only if expanded or step is active/completed */}
        {(expanded || isActive || isCompleted) &&
          dates &&
          dates.map((date, index) => (
            <View key={index} style={styles.dateContainer}>
              <Text style={styles.dateText}>{date.time}</Text>
              <Text style={styles.statusLabel}>{date.status}</Text>
            </View>
          ))}
      </View>
    </View>
  );
};

// Sample order data
const sampleOrder = {
  id: '1004',
  date: '20 Mar, 2025',
  status: 'Shipped',
  totalValue: '32132',
  item: {
    name: 'Nylon (Brand)',
    size: '80"56" (N • M)',
    quantity: 8,
    rating: '4.1',
    image: fallbackImg(),
  },
  tracking: {
    placed: [
      {time: 'Tue, 17 Jan 2023 02:32 PM', status: 'Pending'},
      {time: 'Tue, 17 Jan 2023 02:38 PM', status: 'Generated'},
    ],
    packing: [
      {time: 'Tue, 17 Jan 2023 02:38 PM', status: 'Ready'},
      {time: 'Tue, 17 Jan 2023 02:38 PM', status: 'Packing'},
    ],
    shipping: [{time: 'Tue, 18 Jan 2023 02:38 PM', status: 'Ready to deliver'}],

    delivered: [],
  },
};

export default OrderTracking;
