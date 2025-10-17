// import React, {useEffect, useState, useCallback} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableWithoutFeedback,
//   Dimensions,
// } from 'react-native';
// import {useDispatch} from 'react-redux';
// import {useNavigation} from '@react-navigation/native';

// import {fallbackImg} from '../../utils/images';
// import RepeatCard from './RepeatCard';
// import {scale} from '../../utils/Responsive/responsive';
// import Colors from '../../assets/color';
// import RepeatOrderIcon from '../../assets/icons/svg/repeat.svg';
// import {addToCart} from '../../redux/slices/addToCartSlice';
// import {useAlert} from '../../context/CustomAlertContext';
// import {useLoader} from '../../context/LoaderContext';
// import {StorageKeys, storage} from '../../utils/storage';
// import {ROUTES} from '../../constants/routes';
// import api from '../../redux/api';
// import {openModal} from '../../redux/slices/modalSlice';

// const {width} = Dimensions.get('window');
// const cardWidth = width * 0.45;

// const RepeatOrder = () => {
//   const [lastOrderItems, setLastOrderItems] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [hasOrders, setHasOrders] = useState(false);
//   const dispatch = useDispatch();
//   const {showAlert} = useAlert();
//   const {setLoading} = useLoader();

//   // Fetch last order items
//   const fetchLastOrderItems = useCallback(async () => {
//     try {
//       setIsLoading(true);
//       const response = await api.get('/order/user-orders');

//       if (response.data && response.data.length > 0) {
//         setHasOrders(true);

//         // Get the most recent order (assuming they're sorted by date)
//         const lastOrder = response.data[0];

//         if (lastOrder.items && lastOrder.items.length > 0) {
//           // Transform order items to display format
//           const transformedItems = lastOrder.items.map(item => ({
//             id: item.productId._id || item.productId,
//             name: item.productId.name || item.name,
//             image: Array.isArray(item.productId.image)
//               ? item.productId.image[0]
//               : item.productId.image || fallbackImg(),
//             brand: item.productId.brand || 'Unknown',
//             unit: item.variant || 'pcs',
//             quantity: item.quantity,
//             variant: item.variant,
//             originalProduct: item.productId,
//           }));

//           setLastOrderItems(transformedItems);
//         }
//       } else {
//         setHasOrders(false);
//       }
//     } catch (error) {
//       console.log('Error fetching last order:', error.message);
//       setHasOrders(false);
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchLastOrderItems();
//   }, [fetchLastOrderItems]);

//   // Handle adding single item to cart
//   const handleAddToCart = async (productId, variant, quantity) => {
//     try {
//       await dispatch(addToCart({productId, variant, quantity})).unwrap();
//     } catch (err) {
//       console.log('Error adding item to cart:', err.message);
//       throw err;
//     }
//   };

//   const handleRepeatOrder = async () => {
//     if (!lastOrderItems || lastOrderItems.length === 0) {
//       showAlert({
//         title: 'No Previous Order',
//         message: 'No previous order found to repeat.',
//         acceptText: 'OK',
//       });
//       return;
//     }

//     showAlert({
//       title: 'Repeat Last Order',
//       message: `Do you want to add all ${lastOrderItems.length} items from your last order to cart?`,
//       onConfirm: async () => {
//         setLoading(true);
//         try {
//           // Add all items to cart
//           const addToCartPromises = lastOrderItems.map(item =>
//             handleAddToCart(item.id, item.variant, item.quantity),
//           );

//           console.log('2');
//           await Promise.all(addToCartPromises);

//           console.log('3');
//           dispatch(
//             openModal({
//               modalType: 'ViewCart',
//               callbackId: '123',
//             }),
//           );
//         } catch (error) {
//           showAlert({
//             title: 'Error',
//             message:
//               error.message || 'Failed to repeat order. Please try again.',
//             acceptText: 'OK',
//           });
//         } finally {
//           setLoading(false);
//         }
//       },
//       acceptText: 'Yes, Add to Cart',
//       rejectText: 'Cancel',
//     });
//   };

//   // Request for quote function
//   const requestForQuote = async () => {
//     const token = storage.getString(StorageKeys.AUTH_TOKEN);

//     try {
//       const response = await fetch(
//         'https://api.saraldyechems.com/order/send-quote',
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`,
//           },
//         },
//       );

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(result?.message || 'Failed to send quote request');
//       }

//       return result;
//     } catch (error) {
//       throw error;
//     }
//   };

//   // Don't render the component if there are no orders
//   if (!hasOrders) {
//     return null;
//   }

//   return (
//     <View style={styles.container}>
//       <View style={styles.repeatOrderContainer}>
//         <View style={styles.titleContainer}>
//           <Text style={styles.repTitle}>Repeat Last Order</Text>
//         </View>

//         <TouchableWithoutFeedback onPress={handleRepeatOrder}>
//           <View style={styles.repBtn}>
//             <View style={styles.boxIconContainer}>
//               <RepeatOrderIcon width={18} height={18} style={{color: '#FFF'}} />
//             </View>
//             <Text style={styles.repBtnText}>Repeat Order</Text>
//           </View>
//         </TouchableWithoutFeedback>
//       </View>

//       <ScrollView
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         contentContainerStyle={styles.scrollContent}>
//         {lastOrderItems.map(product => (
//           <RepeatCard
//             key={product.id}
//             unique={product.id}
//             imageSource={product.image}
//             name={product.name}
//             screen="repeat"
//             onAddToCart={() => {
//               // Individual item add to cart for last order items
//               handleAddToCart(
//                 product.id,
//                 product.variant,
//                 product.quantity || 1,
//               )
//                 .then(() => {
//                   showAlert({
//                     title: 'Success',
//                     message: `${product.name} added to cart!`,
//                     acceptText: 'OK',
//                   });
//                 })
//                 .catch(err => {
//                   showAlert({
//                     title: 'Error',
//                     message: err.message || 'Failed to add item to cart',
//                     acceptText: 'OK',
//                   });
//                 });
//             }}
//           />
//         ))}
//       </ScrollView>
//     </View>
//   );
// };

// export default RepeatOrder;

// const styles = StyleSheet.create({
//   container: {
//     paddingBottom: 4,
//     marginLeft: -8,
//     zIndex: 1,
//   },
//   scrollContent: {
//     paddingHorizontal: 12,
//     paddingBottom: 5,
//     marginLeft: scale(5),
//   },
//   repTitle: {
//     fontSize: scale(14),
//     color: Colors.BLACK,
//     fontWeight: '700',
//   },
//   repeatOrderContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginVertical: scale(10),
//   },
//   boxIconContainer: {
//     padding: scale(2),
//   },
//   titleContainer: {
//     marginLeft: scale(20),
//   },
//   repBtn: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: Colors.PRIMARY_DARK,
//     borderRadius: scale(30),
//     padding: scale(5),
//     marginRight: scale(10),
//   },
//   repBtnText: {
//     color: Colors.TEXT_WHITE,
//     fontSize: scale(10),
//     fontWeight: '500',
//     marginLeft: scale(2),
//   },
// });

import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import {fallbackImg} from '../../utils/images';
import RepeatCard from './RepeatCard';
import {scale} from '../../utils/Responsive/responsive';
import Colors from '../../assets/color';
import RepeatOrderIcon from '../../assets/icons/svg/repeat.svg';
import {addToCart} from '../../redux/slices/addToCartSlice';
import {useAlert} from '../../context/CustomAlertContext';
import {useLoader} from '../../context/LoaderContext';
import {StorageKeys, storage} from '../../utils/storage';
import {ROUTES} from '../../constants/routes';
import api from '../../redux/api';
import {openModal} from '../../redux/slices/modalSlice';

const {width} = Dimensions.get('window');
const cardWidth = width * 0.45;

const RepeatOrder = () => {
  const [lastOrderItems, setLastOrderItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasOrders, setHasOrders] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {showAlert} = useAlert();
  const {setLoading} = useLoader();

  // Fetch last order items
  const fetchLastOrderItems = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/order/user-orders');

      if (response.data && response.data.length > 0) {
        setHasOrders(true);

        // Get the most recent order (assuming they're sorted by date)
        const lastOrder = response.data[0];

        if (lastOrder.items && lastOrder.items.length > 0) {
          // Transform order items to display format
          const transformedItems = lastOrder.items.map(item => ({
            id: item.productId._id || item.productId,
            name: item.productId.name || item.name,
            image: Array.isArray(item.productId.image)
              ? item.productId.image[0]
              : item.productId.image || fallbackImg(),
            brand: item.productId.brand || 'Unknown',
            unit: item.variant || 'pcs',
            quantity: item.quantity,
            variant: item.variant,
            originalProduct: item.productId,
          }));

          setLastOrderItems(transformedItems);
        }
      } else {
        setHasOrders(false);
      }
    } catch (error) {
      console.log('Error fetching last order:', error.message);
      setHasOrders(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLastOrderItems();
  }, [fetchLastOrderItems]);

  // Handle adding single item to cart
  const handleAddToCart = async (productId, variant, quantity) => {
    try {
      await dispatch(addToCart({productId, variant, quantity})).unwrap();
    } catch (err) {
      console.log('Error adding item to cart:', err.message);
      throw err;
    }
  };

  const handleRepeatOrder = async () => {
    if (!lastOrderItems || lastOrderItems.length === 0) {
      showAlert({
        title: 'No Previous Order',
        message: 'No previous order found to repeat.',
        acceptText: 'OK',
      });
      return;
    }

    showAlert({
      title: 'Repeat Last Order',
      message: `Do you want to add all ${lastOrderItems.length} items from your last order to cart?`,
      onConfirm: async () => {
        setLoading(true);
        try {
          // FIX: Add items sequentially to avoid race conditions
          const addedItems = [];
          const failedItems = [];

          for (const item of lastOrderItems) {
            try {
              await handleAddToCart(item.id, item.variant, item.quantity);
              addedItems.push(item.name);
            } catch (error) {
              console.log(`Failed to add ${item.name}:`, error.message);
              failedItems.push(item.name);
            }
          }

          // Show appropriate message based on results
          if (addedItems.length === lastOrderItems.length) {
            // All items added successfully
            dispatch(
              openModal({
                modalType: 'ViewCart',
                callbackId: '123',
              }),
            );
          } else if (addedItems.length > 0) {
            // Some items added, some failed
            showAlert({
              title: 'Partial Success',
              message: `Added ${addedItems.length} out of ${
                lastOrderItems.length
              } items to cart.${
                failedItems.length > 0
                  ? ` Failed: ${failedItems.join(', ')}`
                  : ''
              }`,
              acceptText: 'OK',
              onAccept: () => {
                dispatch(
                  openModal({
                    modalType: 'ViewCart',
                    callbackId: '123',
                  }),
                );
              },
            });
          } else {
            // All items failed
            showAlert({
              title: 'Failed',
              message: 'Failed to add any items to cart. Please try again.',
              acceptText: 'OK',
            });
          }
        } catch (error) {
          showAlert({
            title: 'Error',
            message:
              error.message || 'Failed to repeat order. Please try again.',
            acceptText: 'OK',
          });
        } finally {
          setLoading(false);
        }
      },
      acceptText: 'Yes, Add to Cart',
      rejectText: 'Cancel',
    });
  };

  // Request for quote function
  const requestForQuote = async () => {
    const token = storage.getString(StorageKeys.AUTH_TOKEN);

    try {
      const response = await fetch(
        'https://api.saraldyechems.com/order/send-quote',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || 'Failed to send quote request');
      }

      return result;
    } catch (error) {
      throw error;
    }
  };

  // Don't render the component if there are no orders
  if (!hasOrders) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.repeatOrderContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.repTitle}>Repeat Last Order</Text>
        </View>

        <TouchableWithoutFeedback onPress={handleRepeatOrder}>
          <View style={styles.repBtn}>
            <View style={styles.boxIconContainer}>
              <RepeatOrderIcon width={18} height={18} style={{color: '#FFF'}} />
            </View>
            <Text style={styles.repBtnText}>Repeat Order</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {lastOrderItems.map(product => (
          <RepeatCard
            key={product.id}
            unique={product.id}
            imageSource={product.image}
            name={product.name}
            screen="repeat"
            onAddToCart={() => {
              // Individual item add to cart for last order items
              handleAddToCart(
                product.id,
                product.variant,
                product.quantity || 1,
              )
                .then(() => {
                  showAlert({
                    title: 'Success',
                    message: `${product.name} added to cart!`,
                    acceptText: 'OK',
                  });
                })
                .catch(err => {
                  showAlert({
                    title: 'Error',
                    message: err.message || 'Failed to add item to cart',
                    acceptText: 'OK',
                  });
                });
            }}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default RepeatOrder;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 4,
    marginLeft: -8,
    zIndex: 1,
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingBottom: 5,
    marginLeft: scale(5),
  },
  repTitle: {
    fontSize: scale(14),
    color: Colors.BLACK,
    fontWeight: '700',
  },
  repeatOrderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: scale(10),
  },
  boxIconContainer: {
    padding: scale(2),
  },
  titleContainer: {
    marginLeft: scale(20),
  },
  repBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.PRIMARY_DARK,
    borderRadius: scale(30),
    padding: scale(5),
    marginRight: scale(10),
  },
  repBtnText: {
    color: Colors.TEXT_WHITE,
    fontSize: scale(10),
    fontWeight: '500',
    marginLeft: scale(2),
  },
});
