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
  Truck,
} from 'lucide-react-native';
import {LinearGradient} from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import OrderTrackModal from '../../components/OrderTrackModal';
import ProductModal from '../ProductDetails/ProductModal';
import DashboardHeader from '../../components/Header/DashBoardHeader';
import {fallbackImg} from '../../utils/images';
import InfoIcon from 'react-native-vector-icons/Entypo';
import ScrollImage from '../../components/ScrollImage/Index';
import styles from './Tracking.styles';
import OrderTrackingSteps from './OrderTrackingComponent';
import {scale} from '../Cart/responsive';
import TrackingCard from '../../components/TrackingCard/TrackingCard';

const {width} = Dimensions.get('window');

// Get screen dimensions
const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

// Responsive helper functions
const wp = percentage => {
  return (percentage * screenWidth) / 100;
};

const hp = percentage => {
  return (percentage * screenHeight) / 100;
};

const formatDate = dateString => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const isTablet = screenWidth >= 768;
const isSmallScreen = screenWidth < 380;

const OrderTracking = ({route}) => {
  const [expanded, setExpanded] = useState(false);
  const [visible, setVisible] = useState(false);

  let {orders: order} = route.params;

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

    // return 0;
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
  const [expandedOrders, setExpandedOrders] = useState([]);

  const toggleOrderExpand = orderId => {
    setExpandedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId],
    );
  };

  const sampleTrackingData = {
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
  };

  return (
    <>
      <DashboardHeader />
      <View style={styles.container}>
        {/* Order Tracking */}
        <View style={[styles.orderCard]}>
          <TrackingCard order={order} />
        </View>

        <View>
          <OrderTrackingSteps
            orderStatus={order.status}
            trackingData={sampleTrackingData}
          />

          <View style={styles.supportContainer}>
            <Text style={styles.supportText}>Need Support?</Text>
            <View style={styles.supportButtons}>
              <LinearGradient
                colors={['#38587F', '#101924']} // Left to right gradient colors
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.receiptButton} // Make sure the gradient covers the button
              >
                <TouchableOpacity style={styles.callButton}>
                  <Phone size={scale(22)} color="#fff" />
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
                  <Icon name="whatsapp" size={scale(22)} color="#fff" />
                  <Text style={styles.buttonText}>Whatsapp</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        </View>
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
          <Truck size={30} color="#fff" />
          {/* <Package size={30} color="#fff" /> */}
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
