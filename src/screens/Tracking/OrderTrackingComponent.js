import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {Package, Truck, Box, CheckCircle} from 'lucide-react-native';

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

const OrderTrackingSteps = ({orderStatus, trackingData = null}) => {
  // Determine the current step based on status
  const getCurrentStep = () => {
    const statusMap = {
      'quote sent': 0,
      placed: 0,
      generated: 0,
      ready: 1,
      packing: 1,
      shipped: 2,
      shipping: 2,
      delivered: 3,
    };

    return statusMap[orderStatus?.toLowerCase()] || 0;
  };

  const currentStep = getCurrentStep();

  return (
    <View style={styles.trackingContainer}>
      <View style={styles.trackingHeader}>
        <Text style={styles.trackingTitle}>Order Tracking</Text>
      </View>

      <View style={styles.timeline}>
        {/* Placed Order */}
        <TrackingStep
          title="Placed Order"
          icon={<Package size={isTablet ? 32 : 28} color="#fff" />}
          dates={trackingData?.placed || []}
          isActive={currentStep >= 0}
          isCompleted={currentStep > 0}
          isFirst={true}
        />

        {/* Packing */}
        <TrackingStep
          title="Packing"
          icon={<Box size={isTablet ? 32 : 28} color="#fff" />}
          dates={trackingData?.packing || []}
          isActive={currentStep >= 1}
          isCompleted={currentStep > 1}
        />

        {/* Shipping */}
        <TrackingStep
          title="Shipping"
          icon={<Truck size={isTablet ? 32 : 28} color="#fff" />}
          dates={trackingData?.shipping || []}
          isActive={currentStep >= 2}
          isCompleted={currentStep > 2}
        />

        {/* Delivered */}
        <TrackingStep
          title="Delivered"
          icon={<CheckCircle size={isTablet ? 32 : 28} color="#fff" />}
          dates={trackingData?.delivered || []}
          isActive={currentStep >= 3}
          isCompleted={currentStep > 3}
          isLast={true}
        />
      </View>
    </View>
  );
};

// Individual tracking step component
const TrackingStep = ({
  title,
  icon,
  dates = [],
  isActive,
  isCompleted,
  isFirst = false,
  isLast = false,
}) => {
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
    let baseHeight = hp(8);

    // If step has dates and is active/completed, add height for each date entry
    if ((isActive || isCompleted) && dates.length > 0) {
      baseHeight += dates.length * hp(5);
    }

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
          {icon}
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
        <Text
          style={[
            styles.stepTitle,
            (isActive || isCompleted) && styles.stepTitleActive,
          ]}>
          {title}
        </Text>
        {title !== 'Delivered' && (
          <View
            style={{
              flexDirection: 'row',

              alignItems: 'center',
            }}>
            <View style={{alignItems: 'center', marginRight: hp(3)}}>
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 30,
                  backgroundColor: '#D9D9D9',
                }}></View>
              <View
                style={{
                  width: 2,
                  height: 40,
                  backgroundColor: '#808080',
                }}></View>
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 30,
                  backgroundColor: '#D9D9D9',
                }}></View>
            </View>
            <View>
              {(isActive || isCompleted) &&
                dates.length > 0 &&
                dates.map((date, index) => (
                  <View key={index} style={styles.dateContainer}>
                    <Text style={styles.dateText}>{date.time}</Text>
                    <Text style={styles.statusLabel}>{date.status}</Text>
                  </View>
                ))}
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  trackingContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: wp(4),
  },
  trackingHeader: {
    paddingVertical: hp(2),
  },
  trackingTitle: {
    fontSize: isTablet ? 20 : isSmallScreen ? 16 : 18,
    fontWeight: '600',
    color: '#101924',
  },
  timeline: {
    flex: 1,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: hp(3),
  },
  stepIconColumn: {
    alignItems: 'center',
    marginRight: wp(4),
  },
  stepIconContainer: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    justifyContent: 'center',
    backgroundColor: 'red',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#CCC',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  stepLine: {
    width: 1.5,
    // marginTop: hp(1),
  },
  stepContent: {
    flex: 1,
    paddingTop: hp(1),
  },
  stepTitle: {
    fontSize: isTablet ? 18 : isSmallScreen ? 14 : 16,
    fontWeight: '500',
    color: '#3C5D88',
    marginBottom: hp(1),
  },
  stepTitleActive: {
    color: '#3C5D86',
    fontWeight: '600',
  },
  dateContainer: {
    marginBottom: hp(1.5),
    // paddingLeft: wp(2),
  },
  dateText: {
    fontSize: isTablet ? 15 : isSmallScreen ? 12 : 14,
    color: '#555',
  },
  statusLabel: {
    fontSize: isTablet ? 14 : isSmallScreen ? 11 : 13,
    color: '#555',
    marginTop: hp(0.5),
  },
});

export default OrderTrackingSteps;
