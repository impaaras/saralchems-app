// import React from 'react';
// import {
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   Dimensions,
//   Animated,
// } from 'react-native';
// import Icon2 from 'react-native-vector-icons/AntDesign';
// import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';
// import Home from 'react-native-vector-icons/Entypo';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import LinearGradient from 'react-native-linear-gradient';
// import {PackageCheck} from 'lucide-react-native';
// import {ROUTES} from '../constants/routes';
// import {useSelector} from 'react-redux';

// const windowWidth = Dimensions.get('window').width;
// const CustomTabBar = ({state, descriptors, navigation, translateY}) => {
//   const windowWidth = Dimensions.get('window').width;
//   const [index, setIndex] = React.useState(state.index);
//   const [showOrderOptions, setShowOrderOptions] = React.useState(false);
//   const {items} = useSelector(state => state.addToCart);

//   React.useEffect(() => {
//     setIndex(state.index);
//   }, [state.index]);

//   const handleNavigateScreen = (index, directScreen = null) => {
//     setIndex(index);
//     const screens = ['Home', 'products', 'Cart', 'tracking'];
//     if (directScreen) {
//       navigation.navigate(directScreen);
//       setShowOrderOptions(false);
//     } else {
//       if (index === 3) {
//         navigation.navigate(ROUTES.HISTORY);
//       } else {
//         setShowOrderOptions(false);
//         navigation.navigate(screens[index]);
//       }
//     }
//   };

//   const TabButton = ({iconComponent, label, isActive, onPress}) => {
//     const ButtonContent = () => (
//       <View style={styles.tabContent}>
//         {label === 'Cart' && items?.length > 0 && (
//           <View
//             style={[
//               styles.cartBadge,
//               {
//                 backgroundColor: isActive ? 'white' : '#2D4565',
//               },
//             ]}>
//             <Text style={{fontSize: 12, color: isActive ? '#1B2B48' : 'white'}}>
//               {items.length}
//             </Text>
//           </View>
//         )}
//         {iconComponent}
//         <Text style={isActive ? styles.tabLabel : styles.inactiveTabLabel}>
//           {label}
//         </Text>
//       </View>
//     );

//     return isActive ? (
//       <LinearGradient
//         colors={['#1B2B48', '#2D4565']}
//         start={{x: 0, y: 0}}
//         end={{x: 1, y: 1}}
//         style={styles.activeTabButton}>
//         <ButtonContent />
//       </LinearGradient>
//     ) : (
//       <TouchableOpacity style={styles.inactiveTabButton} onPress={onPress}>
//         <ButtonContent />
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <Animated.View
//       style={[
//         styles.container,
//         {
//           transform: [{translateY}],
//           position: 'absolute',
//           left: 0,
//           right: 0,
//           bottom: 0,
//         },
//       ]}>
//       {/* {showOrderOptions && (
//         <View
//           style={[
//             styles.orderOptionsContainer,
//             {zIndex: index !== 3 && index !== 4 ? 0 : 1},
//           ]}>
//           <View style={styles.optionDivider} />
//           <TouchableOpacity
//             style={styles.orderTrackingOption}
//             onPress={() =>
//               handleNavigateScreen(
//                 index !== 4 ? 4 : 3,
//                 index !== 4 ? ROUTES.TRACKING : ROUTES.HISTORY,
//               )
//             }>
//             <Ionicons name="map" size={22} color={'#FFF'} />
//             <Text style={styles.orderOptionText}>
//               {index !== 3 ? 'Order History' : 'Order Tracking'}
//             </Text>
//           </TouchableOpacity>
//         </View>
//       )} */}

//       <View style={styles.tabBar}>
//         <TabButton
//           iconComponent={
//             <Home
//               name="home"
//               size={22}
//               color={index === 0 ? '#FFF' : '#5A5A5A'}
//             />
//           }
//           label="Home"
//           isActive={index === 0}
//           onPress={() => handleNavigateScreen(0)}
//         />
//         <TabButton
//           iconComponent={
//             <Ionicons
//               name="view-dashboard"
//               size={22}
//               color={index === 1 ? '#FFF' : '#5A5A5A'}
//             />
//           }
//           label="Products"
//           isActive={index === 1}
//           onPress={() => handleNavigateScreen(1)}
//         />
//         <TabButton
//           iconComponent={
//             <FontAwesome
//               name="cart-plus"
//               size={22}
//               color={index === 2 ? '#FFF' : '#5A5A5A'}
//             />
//           }
//           label="Cart"
//           isActive={index === 2}
//           onPress={() => handleNavigateScreen(2)}
//         />
//         {index !== 4 ? (
//           <TabButton
//             iconComponent={
//               <PackageCheck color={index === 3 ? '#FFF' : '#5A5A5A'} />
//             }
//             label="Order History"
//             isActive={index === 3}
//             onPress={() => handleNavigateScreen(3)}
//           />
//         ) : (
//           <TabButton
//             iconComponent={
//               <Ionicons
//                 name="map"
//                 size={22}
//                 color={index === 4 ? '#FFF' : '#5A5A5A'}
//               />
//             }
//             label="Order Tracking"
//             isActive={index === 4}
//             onPress={() => handleNavigateScreen(4)}
//           />
//         )}
//         <TouchableOpacity
//           style={{marginLeft: -20, marginRight: 5, zIndex: 999}}
//           onPress={() => setShowOrderOptions(!showOrderOptions)}>
//           <Icon2
//             name="caretdown"
//             size={16}
//             color={index === 3 || index === 4 ? '#FFF' : '#555'}
//           />
//         </TouchableOpacity>
//       </View>
//     </Animated.View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: '#3C5C85',
//     borderTopLeftRadius: 30,
//     borderTopRightRadius: 35,
//     paddingVertical: 8,
//   },
//   tabBar: {
//     flexDirection: 'row',
//     backgroundColor: '#FFF',
//     marginTop: -18,
//     marginHorizontal: 12,
//     borderRadius: 30,
//     borderWidth: 1,
//     borderColor: '#D9DFE7',
//     height: 54,
//     alignItems: 'center',
//     justifyContent: 'space-evenly',
//   },
//   activeTabButton: {
//     flex: 1,
//     height: 52,
//     borderRadius: 100,
//     marginHorizontal: 4,
//     justifyContent: 'center',
//     alignItems: 'center',
//     minWidth: 60,
//   },
//   inactiveTabButton: {
//     flex: 1,
//     height: 52,
//     borderRadius: 25,
//     marginHorizontal: 4,
//     justifyContent: 'center',
//     alignItems: 'center',
//     minWidth: 60,
//   },
//   tabContent: {
//     position: 'relative',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingHorizontal: 2,
//     paddingVertical: 4,
//   },
//   cartBadge: {
//     position: 'absolute',
//     top: 0,
//     right: -12,
//     borderRadius: 50,
//     paddingHorizontal: 5,
//     zIndex: 9999,
//   },
//   tabLabel: {
//     fontSize: 10,
//     color: '#FFF',
//     fontWeight: '600',
//     marginTop: 2,
//     textAlign: 'center',
//   },
//   inactiveTabLabel: {
//     fontSize: 10,
//     color: '#5A5A5A',
//     fontWeight: '600',
//     marginTop: 2,
//     textAlign: 'center',
//   },
//   orderOptionsContainer: {
//     position: 'absolute',
//     bottom: 58,
//     right: 15,
//     borderRadius: 15,
//     width: 92,
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 3},
//     shadowOpacity: 0.27,
//     shadowRadius: 4.65,
//     elevation: 6,
//     overflow: 'hidden',
//     marginBottom: -30,
//   },
//   orderTrackingOption: {
//     paddingBottom: 40,
//     paddingTop: 5,
//     alignItems: 'center',
//     backgroundColor: '#2D4565',
//     borderBottomLeftRadius: 15,
//     borderBottomRightRadius: 15,
//   },
//   optionDivider: {
//     backgroundColor: 'rgba(255, 255, 255, 0.15)',
//     width: '100%',
//   },
//   orderOptionText: {
//     color: '#FFF',
//     fontWeight: '600',
//     fontSize: 12,
//   },
// });

// export default CustomTabBar;

import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Animated,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';
import Home from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import {PackageCheck} from 'lucide-react-native';
import {ROUTES} from '../constants/routes';
import {useSelector} from 'react-redux';
import CustomText from '../CustomText';

const windowWidth = Dimensions.get('window').width;

const CustomTabBar = ({state, descriptors, navigation, translateY}) => {
  const [index, setIndex] = React.useState(state.index);
  const {items} = useSelector(state => state.addToCart);

  React.useEffect(() => {
    setIndex(state.index);
  }, [state.index]);

  const handleNavigateScreen = index => {
    setIndex(index);
    const screens = [
      ROUTES.HOME,
      ROUTES.PRODUCT_SCREEN,
      ROUTES.CART,
      ROUTES.HISTORY,
    ];

    navigation.navigate(screens[index]);
  };

  const TabButton = ({iconComponent, label, isActive, onPress}) => {
    const ButtonContent = () => (
      <View style={styles.tabContent}>
        {label === 'Cart' && items?.length > 0 && (
          <View
            style={[
              styles.cartBadge,
              {
                backgroundColor: isActive ? 'white' : '#2D4565',
              },
            ]}>
            <Text style={{fontSize: 12, color: isActive ? '#1B2B48' : 'white'}}>
              {items.length}
            </Text>
          </View>
        )}
        {iconComponent}

        <Text style={isActive ? styles.tabLabel : styles.inactiveTabLabel}>
          {label}
        </Text>
      </View>
    );

    return isActive ? (
      <LinearGradient
        colors={['#2D4565', '#2D4565', '#1B2B48', '#1B2B48']}
        start={{x: 0, y: 0}} // Top
        end={{x: 0, y: 1}} // Bottom
        style={styles.activeTabButton}>
        <ButtonContent />
      </LinearGradient>
    ) : (
      <TouchableOpacity style={styles.inactiveTabButton} onPress={onPress}>
        <ButtonContent />
      </TouchableOpacity>
    );
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{translateY}],
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
        },
      ]}>
      <View style={styles.tabBar}>
        <TabButton
          iconComponent={
            <Home
              name="home"
              size={22}
              color={index === 0 ? '#FFF' : '#5A5A5A'}
            />
          }
          label="Home"
          isActive={index === 0}
          onPress={() => handleNavigateScreen(0)}
        />
        <TabButton
          iconComponent={
            <Ionicons
              name="view-dashboard"
              size={22}
              color={index === 1 ? '#FFF' : '#5A5A5A'}
            />
          }
          label="Products"
          isActive={index === 1}
          onPress={() => handleNavigateScreen(1)}
        />
        <TabButton
          iconComponent={
            <FontAwesome
              name="cart-plus"
              size={22}
              color={index === 2 ? '#FFF' : '#5A5A5A'}
            />
          }
          label="Cart"
          isActive={index === 2}
          onPress={() => handleNavigateScreen(2)}
        />
        <TabButton
          iconComponent={
            <PackageCheck color={index === 3 ? '#FFF' : '#5A5A5A'} />
          }
          label="Order History"
          isActive={index === 3}
          onPress={() => handleNavigateScreen(3)}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#3C5C85',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 35,
    paddingVertical: 8,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    marginTop: -18,
    marginHorizontal: 16,
    borderRadius: 35,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#D9DFE7',
    height: 54,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  activeTabButton: {
    flex: 1,
    height: 52,
    borderRadius: 100,
    marginHorizontal: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 60,
  },
  inactiveTabButton: {
    flex: 1,
    height: 52,
    borderRadius: 25,
    marginHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 60,
  },
  tabContent: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
    paddingVertical: 4,
  },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: -12,
    borderRadius: 50,
    paddingHorizontal: 5,
    zIndex: 9999,
  },
  tabLabel: {
    fontSize: 11,
    color: '#FFF',
    fontWeight: '700',
    marginTop: 2,
    textAlign: 'center',
    fontFamily: 'Poppins-Medium', // Use your Poppins font
  },
  inactiveTabLabel: {
    fontSize: 11,
    color: '#5A5A5A',
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'center',
  },
});

export default CustomTabBar;
