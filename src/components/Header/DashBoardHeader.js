// import React, {useCallback, useEffect, useState} from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   SafeAreaView,
//   TextInput,
//   Dimensions,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import Icon3 from 'react-native-vector-icons/FontAwesome';
// import {ROUTES} from '../../constants/routes';
// import styles from './Header.styles';
// import {useFocusEffect, useNavigation} from '@react-navigation/native';
// import {useDispatch, useSelector} from 'react-redux';
// import {ChevronLeft, Route, TextIcon} from 'lucide-react-native';
// import DropdownMenu from '../Dropdown/DropwDownComponent';
// import {
//   clearSearchResults,
//   searchProducts,
// } from '../../redux/slices/searchSlice';
// import axios from 'axios';
// import {addToHistory} from '../../redux/slices/searchHistory';
// import {API_URL} from '../../utils/ApiService';
// import {previousRouteName} from '../../navigation/navigationService';
// import {fetchUserProfile} from '../../redux/slices/authSlice';
// import {moderateScale, scale} from '../../utils/Responsive/responsive';

// const {width} = Dimensions.get('window');

// const DashboardHeader = ({name}) => {
//   const navigation = useNavigation();
//   const [currentRouteName, setCurrentRouteName] = useState('');
//   const [categories, setCategories] = useState();
//   const [openInput, setOpenInput] = useState(false);
//   const {results, error} = useSelector(state => state.search);
//   const dispatch = useDispatch();
//   // Function to get the current route name
//   const getCurrentRouteName = () => {
//     const state = navigation.getState();
//     if (state?.routes?.length > 0) {
//       return state.routes[state.index]?.name || '';
//     }
//     return '';
//   };

//   const menuRoutes = [
//     ROUTES.HOME,
//     ROUTES.PRODUCT_SCREEN,
//     ROUTES.CART,
//     ROUTES.HISTORY,
//   ];
//   // Update the route name dynamically when screen changes
//   useFocusEffect(
//     useCallback(() => {
//       setCurrentRouteName(getCurrentRouteName());
//     }, [navigation]),
//   );

//   // Function to return the header title dynamically
//   const getRouteName = () => {
//     switch (currentRouteName) {
//       case ROUTES.HISTORY:
//         return 'Order History';
//       case ROUTES.CART:
//         return 'Cart Summary';
//       case ROUTES.ITEM_SCREEN:
//         return 'Item Screen';
//       case ROUTES.TRACKING:
//         return 'Order Tracking';
//       case ROUTES.HOME:
//         return 'Trending Products';
//       case 'products':
//         return 'Products';
//       case ROUTES.LEDGER:
//         return 'Account Ledger';
//       case ROUTES.PROFILE:
//         return 'Profile';
//       case ROUTES.PRODUCT_DETAILS:
//         return name; // Fixed dynamic issue
//       case ROUTES.SEARCH:
//         return 'Search';
//     }
//   };

//   const [searchText, setSearchText] = useState('');
//   const [debouncedQuery, setDebouncedQuery] = useState('');

//   // Debounce search input
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedQuery(searchText);
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [searchText]);

//   useEffect(() => {
//     if (debouncedQuery.trim()) {
//       dispatch(searchProducts(debouncedQuery.trim()));
//       dispatch(addToHistory(searchText.trim()));
//     } else {
//       dispatch(searchProducts('')); // Pass empty string
//     }
//   }, [debouncedQuery]);

//   const handleSearchSubmit = () => {
//     if (searchText.trim()) {
//       dispatch(searchProducts(searchText.trim()));

//       dispatch(addToHistory(searchText.trim()));
//       navigation.navigate(ROUTES.SEARCH); // Navigate to search screen
//     }
//   };

//   const handleClearSearch = () => {
//     setSearchText('');
//     setOpenInput(false);
//     dispatch(clearSearchResults());
//   };

//   const token = useSelector(state => state.auth.token);

//   const getCategoryData = async () => {
//     try {
//       const {data} = await axios.get(`${API_URL}/category`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setCategories(data);
//     } catch (error) {
//       if (![401, 403].includes(error.response?.status)) {
//         console.log(
//           'Category Fetch Error:',
//           error.response?.data?.message || error.message,
//         );
//       }
//     }
//   };

//   useEffect(() => {
//     const route = getCurrentRouteName();
//     if (route === ROUTES.ITEM_SCREEN) {
//       getCategoryData();
//     }
//   }, []);

//   const handleGoBack = () => {
//     const routeName = getRouteName();
//     if (
//       routeName === ROUTES.ITEM_SCREEN ||
//       routeName === ROUTES.SEARCH ||
//       routeName === ROUTES.LEDGER ||
//       routeName === 'products'
//     ) {
//       navigation.navigate(ROUTES.HOME); // Specific fallback for ITEM_SCREEN
//       return;
//     }

//     if (navigation.canGoBack()) {
//       navigation.navigate(previousRouteName);
//     } else {
//       navigation.navigate(ROUTES.HOME); // Fallback if there's no screen to go back to
//     }
//   };

//   const inputRef = React.useRef(null);

//   // Modify the useFocusEffect to use the ref
//   useFocusEffect(
//     useCallback(() => {
//       const routeName = getCurrentRouteName();
//       setCurrentRouteName(routeName);
//       if (routeName === ROUTES.SEARCH) {
//         setTimeout(() => {
//           if (inputRef.current) {
//             inputRef.current.focus();
//           }
//         }, 100);
//       }
//     }, [navigation]),
//   );

//   const {user} = useSelector(state => state.auth);

//   useEffect(() => {
//     if (token) {
//       dispatch(fetchUserProfile({token}));
//     }
//   }, [token]);

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <View style={styles.headerContainer}>
//         <View style={styles.mainContent}>
//           <View style={styles.centerContainer}>
//             {currentRouteName && menuRoutes.includes(currentRouteName) ? (
//               <TouchableOpacity
//                 style={styles.menuContainer}
//                 onPress={() => navigation.openDrawer()}>
//                 <TextIcon size={scale(21)} color="#FFF" />
//               </TouchableOpacity>
//             ) : (
//               <TouchableOpacity
//                 onPress={handleGoBack}
//                 style={{
//                   borderWidth: 1,
//                   marginLeft: scale(3),
//                   borderColor: '#FCFCFC33',
//                   padding: moderateScale(5),
//                   borderRadius: 100,
//                 }}>
//                 <ChevronLeft color="#FFF" size={scale(23)} />
//               </TouchableOpacity>
//             )}

//             <View
//               style={{
//                 flex: 1,
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 justifyContent: 'space-between',
//                 position: 'relative',
//                 zIndex: 9999999,
//               }}>
//               {openInput ||
//                 (getRouteName() === 'Search' && (
//                   <View
//                     style={{
//                       flexDirection: 'row',
//                       alignItems: 'center',
//                       flex: 1,
//                       marginLeft: 5,
//                       paddingLeft: 10,
//                       backgroundColor: '#FFF',
//                       borderRadius: 100,
//                     }}>
//                     <TextInput
//                       ref={inputRef}
//                       placeholder="Search products..."
//                       placeholderTextColor="#555"
//                       value={searchText}
//                       onChangeText={setSearchText}
//                       autoFocus={true}
//                       style={{
//                         paddingVertical: 10,
//                         height: 40,
//                         flex: 1,
//                       }}
//                     />

//                     {searchText.length > 0 && (
//                       <TouchableOpacity
//                         onPress={() => setSearchText('')}
//                         style={{paddingHorizontal: 10}}>
//                         <Text style={{fontSize: 22, color: '#555'}}>×</Text>
//                       </TouchableOpacity>
//                     )}
//                   </View>
//                 ))}

//               {openInput && getRouteName() === 'Search' && (
//                 <Text style={styles.title}>Search products here..</Text>
//               )}
//               {getRouteName() === 'Account Ledger' && (
//                 <Text style={styles.title}>Account ledger page</Text>
//               )}
//               {!openInput &&
//                 getRouteName() !== 'Search' &&
//                 getRouteName() !== 'Account Ledger' &&
//                 getRouteName() !== ROUTES.ITEM_SCREEN && (
//                   <Text style={styles.title}>
//                     Welcome, {user?.name ? `${user.name.split(' ')[0]}` : ''} 🤗
//                   </Text>
//                 )}
//               {!openInput && currentRouteName === ROUTES.ITEM_SCREEN && (
//                 <DropdownMenu categories={categories} />
//               )}
//             </View>
//             <View style={styles.rightSection}>
//               <TouchableOpacity
//                 onPress={() => {
//                   if (getRouteName() === 'Search') {
//                     setOpenInput(!openInput);
//                   } else {
//                     navigation.navigate(ROUTES.SEARCH);
//                   }
//                 }}
//                 style={styles.searchButton}>
//                 <Icon
//                   name={openInput ? 'search' : 'search'}
//                   size={scale(21)}
//                   color="#FFF"
//                 />
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.profileContainer}
//                 onPress={() => navigation.navigate(ROUTES.PROFILE)}>
//                 {/* <View style={styles.badge}>
//                   <Text style={styles.badgeText}>5</Text>
//                 </View> */}
//                 <Icon3 name="user" size={scale(22)} color="#5A5A5A" />
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// };
// export default DashboardHeader;

import React, {useCallback, useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon3 from 'react-native-vector-icons/FontAwesome';
import {ROUTES} from '../../constants/routes';
import styles from './Header.styles';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {ChevronLeft, TextIcon} from 'lucide-react-native';
import DropdownMenu from '../Dropdown/DropwDownComponent';
import {
  clearSearchResults,
  searchProducts,
} from '../../redux/slices/searchSlice';
import axios from 'axios';
import {addToHistory} from '../../redux/slices/searchHistory';
import {API_URL} from '../../utils/ApiService';
import {previousRouteName} from '../../navigation/navigationService';
import {fetchUserProfile} from '../../redux/slices/authSlice';
import {moderateScale, scale} from '../../utils/Responsive/responsive';

const {width} = Dimensions.get('window');

const DashboardHeader = ({name}) => {
  const navigation = useNavigation();
  const [currentRouteName, setCurrentRouteName] = useState('');
  const [categories, setCategories] = useState();
  const [openInput, setOpenInput] = useState(false);
  const [searchText, setSearchText] = useState('');
  const dispatch = useDispatch();

  // Refs for performance
  const searchTimeoutRef = useRef(null);
  const isMountedRef = useRef(true);
  const lastSearchRef = useRef('');

  const {user} = useSelector(state => state.auth);
  const token = useSelector(state => state.auth.token);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const getCurrentRouteName = useCallback(() => {
    const state = navigation.getState();
    if (state?.routes?.length > 0) {
      return state.routes[state.index]?.name || '';
    }
    return '';
  }, [navigation]);

  // Optimized route tracking
  useFocusEffect(
    useCallback(() => {
      const routeName = getCurrentRouteName();
      setCurrentRouteName(routeName);

      // Only focus input if we're on search screen and input should be open
      if (routeName === ROUTES.SEARCH && openInput) {
        setTimeout(() => {
          if (isMountedRef.current) {
            // Focus logic here if needed
          }
        }, 100);
      }
    }, [navigation, openInput]),
  );

  // Optimized search - only search when on search screen or explicitly needed
  // useEffect(() => {
  //   if (!isMountedRef.current) return;

  //   // Clear previous timeout
  //   if (searchTimeoutRef.current) {
  //     clearTimeout(searchTimeoutRef.current);
  //   }

  //   // Only search if we have text and we're on search screen
  //   const shouldSearch =
  //     searchText.trim() && currentRouteName === ROUTES.SEARCH;

  //   if (shouldSearch && searchText.trim() !== lastSearchRef.current) {
  //     searchTimeoutRef.current = setTimeout(() => {
  //       if (isMountedRef.current) {
  //         console.log(`🔍 [HEADER] Searching for: "${searchText.trim()}"`);
  //         lastSearchRef.current = searchText.trim();
  //         dispatch(searchProducts(searchText.trim()));
  //         dispatch(addToHistory(searchText.trim()));
  //       }
  //     }, 400); // Increased debounce for better performance
  //   } else if (!searchText.trim() && lastSearchRef.current) {
  //     // Clear results when search is empty
  //     lastSearchRef.current = '';
  //     dispatch(clearSearchResults());
  //   }

  //   return () => {
  //     if (searchTimeoutRef.current) {
  //       clearTimeout(searchTimeoutRef.current);
  //     }
  //   };
  // }, [searchText, currentRouteName, dispatch]);
  // Replace the current search useEffect with this optimized version
  useEffect(() => {
    if (!isMountedRef.current) return;

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    const trimmedSearch = searchText.trim();

    // If search is cleared, immediately load all products
    if (trimmedSearch === '' && lastSearchRef.current !== '') {
      console.log('🔄 [HEADER] Search cleared, loading all products');
      lastSearchRef.current = '';
      dispatch(searchProducts(''));
      return;
    }

    // Only search if we have text and we're on search screen
    const shouldSearch = trimmedSearch && currentRouteName === ROUTES.SEARCH;

    if (shouldSearch && trimmedSearch !== lastSearchRef.current) {
      searchTimeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          console.log(`🔍 [HEADER] Searching for: "${trimmedSearch}"`);
          lastSearchRef.current = trimmedSearch;
          dispatch(searchProducts(trimmedSearch));
          dispatch(addToHistory(trimmedSearch));
        }
      }, 300); // Reduced debounce for faster response
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchText, currentRouteName, dispatch]);

  const handleSearchSubmit = () => {
    if (searchText.trim()) {
      // Clear any pending search
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      dispatch(searchProducts(searchText.trim()));
      dispatch(addToHistory(searchText.trim()));
      navigation.navigate(ROUTES.SEARCH);
    }
  };

  // const handleClearSearch = () => {
  //   setSearchText('');
  //   setOpenInput(false);
  //   lastSearchRef.current = '';
  //   dispatch(clearSearchResults());
  // };
  const handleClearSearch = () => {
    setSearchText('');
    setOpenInput(false);
    lastSearchRef.current = '';
    // Immediately dispatch to load all products
    dispatch(searchProducts(''));
  };

  const getCategoryData = async () => {
    if (!token) return;

    try {
      const {data} = await axios.get(`${API_URL}/category`, {
        headers: {Authorization: `Bearer ${token}`},
      });
      if (isMountedRef.current) {
        setCategories(data);
      }
    } catch (error) {
      if (![401, 403].includes(error.response?.status)) {
        console.log(
          'Category Fetch Error:',
          error.response?.data?.message || error.message,
        );
      }
    }
  };

  // Only fetch categories when needed
  useEffect(() => {
    const route = getCurrentRouteName();
    if (route === ROUTES.ITEM_SCREEN) {
      getCategoryData();
    }
  }, [getCurrentRouteName]);

  const handleGoBack = () => {
    const routeName = getCurrentRouteName();
    const fallbackRoutes = [
      ROUTES.ITEM_SCREEN,
      ROUTES.SEARCH,
      ROUTES.LEDGER,
      'products',
    ];

    if (fallbackRoutes.includes(routeName)) {
      navigation.navigate(ROUTES.HOME);
      return;
    }

    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate(ROUTES.HOME);
    }
  };

  const getRouteName = useCallback(() => {
    switch (currentRouteName) {
      case ROUTES.HISTORY:
        return 'Order History';
      case ROUTES.CART:
        return 'Cart Summary';
      case ROUTES.ITEM_SCREEN:
        return 'Item Screen';
      case ROUTES.TRACKING:
        return 'Order Tracking';
      case ROUTES.HOME:
        return 'Trending Products';
      case 'products':
        return 'Products';
      case ROUTES.LEDGER:
        return 'Account Ledger';
      case ROUTES.PROFILE:
        return 'Profile';
      case ROUTES.PRODUCT_DETAILS:
        return name;
      case ROUTES.SEARCH:
        return 'Search';
      default:
        return '';
    }
  }, [currentRouteName, name]);

  // Fetch user profile only once
  useEffect(() => {
    if (token && isMountedRef.current) {
      dispatch(fetchUserProfile({token}));
    }
  }, [token, dispatch]);

  const inputRef = useRef(null);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <View style={styles.mainContent}>
          <View style={styles.centerContainer}>
            {/* Back/Menu Button */}
            {currentRouteName &&
            [
              ROUTES.HOME,
              ROUTES.PRODUCT_SCREEN,
              ROUTES.CART,
              ROUTES.HISTORY,
            ].includes(currentRouteName) ? (
              <TouchableOpacity
                style={styles.menuContainer}
                onPress={() => navigation.openDrawer()}>
                <TextIcon size={scale(21)} color="#FFF" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={handleGoBack}
                style={styles.backButton}>
                <ChevronLeft color="#FFF" size={scale(23)} />
              </TouchableOpacity>
            )}

            {/* Search Input or Title */}
            <View style={styles.titleContainer}>
              {openInput || getRouteName() === 'Search' ? (
                <View style={styles.searchInputContainer}>
                  <TextInput
                    ref={inputRef}
                    placeholder="Search products..."
                    placeholderTextColor="#555"
                    value={searchText}
                    onChangeText={setSearchText}
                    style={styles.searchInput}
                    onSubmitEditing={handleSearchSubmit}
                  />
                  {searchText.length > 0 && (
                    <TouchableOpacity
                      onPress={handleClearSearch}
                      style={styles.clearButton}>
                      <Text style={styles.clearText}>×</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ) : (
                <>
                  {getRouteName() !== 'Account Ledger' &&
                    getRouteName() !== ROUTES.ITEM_SCREEN &&
                    getRouteName() !== 'Search' && (
                      <Text style={styles.title}>
                        Welcome,
                        {user?.name ? `${user.name.split(' ')[0]}` : ''} 🤗
                      </Text>
                    )}
                  {currentRouteName === ROUTES.ITEM_SCREEN && (
                    <DropdownMenu categories={categories} />
                  )}
                </>
              )}
            </View>

            {/* Right Section */}
            <View style={styles.rightSection}>
              <TouchableOpacity
                onPress={() => {
                  if (getRouteName() === 'Search') {
                    setOpenInput(!openInput);
                  } else {
                    navigation.navigate(ROUTES.SEARCH);
                  }
                }}
                style={styles.searchButton}>
                <Icon name="search" size={scale(21)} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.profileContainer}
                onPress={() => navigation.navigate(ROUTES.PROFILE)}>
                <Icon3 name="user" size={scale(22)} color="#5A5A5A" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default React.memo(DashboardHeader);
