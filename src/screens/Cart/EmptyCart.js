import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {
  Svg,
  Path,
  Circle,
  G,
  Defs,
  ClipPath,
  Rect,
  Ellipse,
} from 'react-native-svg';

const EmptyCartScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Cart Illustration */}
        <View style={styles.illustrationContainer}>
          <CartIllustration />
        </View>

        {/* Empty Cart Message */}
        <Text style={styles.title}>Your Cart is Empty</Text>
        <Text style={styles.subtitle}>
          Looks like you haven't added anything to your cart yet
        </Text>
      </View>
    </View>
  );
};
// Cart SVG Illustration Component
const CartIllustration = () => (
  <Svg width="200" height="160" viewBox="0 0 200 160">
    {/* Cart Shadow */}
    <Ellipse cx="100" cy="140" rx="65" ry="10" fill="#F0F0F0" />

    {/* Cart Body - Perspective shape */}
    <Path
      d="M40 45 L160 45 L150 115 L50 115 Z"
      fill="#D9D9D9"
      stroke="#CCCCCC"
      strokeWidth="1"
    />

    {/* Cart Front Panel */}
    <Rect x="50" y="115" width="100" height="10" fill="#CCCCCC" />

    {/* Cart Slots (vertical lines) */}
    <Path d="M60 50 L57 110" stroke="#AAAAAA" strokeWidth="1" />
    <Path d="M80 50 L77 110" stroke="#AAAAAA" strokeWidth="1" />
    <Path d="M100 50 L97 110" stroke="#AAAAAA" strokeWidth="1" />
    <Path d="M120 50 L117 110" stroke="#AAAAAA" strokeWidth="1" />
    <Path d="M140 50 L137 110" stroke="#AAAAAA" strokeWidth="1" />

    {/* Cart Handle */}
    <Path
      d="M40 60 C35 55, 30 50, 25 45"
      stroke="#263a55"
      strokeWidth="4"
      strokeLinecap="round"
    />

    {/* Cart Wheels */}
    <G>
      <Circle cx="65" cy="130" r="8" fill="#263a55" />
      <Circle cx="65" cy="130" r="3" fill="#FFF" />
    </G>
    <G>
      <Circle cx="135" cy="130" r="8" fill="#263a55" />
      <Circle cx="135" cy="130" r="3" fill="#FFF" />
    </G>

    {/* Dashed Lines */}
    <Path
      d="M70 25 C80 15, 95 20, 100 10"
      stroke="#333333"
      strokeWidth="1"
      strokeDasharray="3 2"
    />
    <Path
      d="M110 20 C120 10, 130 15, 140 5"
      stroke="#333333"
      strokeWidth="1"
      strokeDasharray="3 2"
    />
    <Path
      d="M150 30 C160 20, 170 25, 175 15"
      stroke="#333333"
      strokeWidth="1"
      strokeDasharray="3 2"
    />

    {/* Decorative Elements */}
    <Circle cx="100" cy="10" r="3" fill="#263a55" />
    <Circle cx="140" cy="5" r="3" fill="#263a55" />
    <Circle cx="175" cy="15" r="3" fill="#263a55" />

    {/* Additional decorative element (small tag) */}
    <Path d="M40 55 L30 50 L25 55 L30 60 Z" fill="#263a55" />
  </Svg>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  illustrationContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#8C8C8C',
    textAlign: 'center',
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#263A55',
  },
  buttonText: {
    fontSize: 16,
    color: '#263A55',
    fontWeight: '500',
  },
});

export default EmptyCartScreen;
