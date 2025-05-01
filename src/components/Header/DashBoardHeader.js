// src/components/DashboardHeader.js
import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  TextInput,
  StatusBar,
  ActivityIndicator,
  FlatList,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon3 from 'react-native-vector-icons/FontAwesome';
import menuIcon from '../../assets/menu_icon.png';
import profileIcon from '../../assets/profile.png';
import {ROUTES} from '../../constants/routes';
import styles from './Header.styles';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {openDrawer, toggleDrawer} from '../../redux/slices/drawerSlice';
import {ChevronLeft, Route} from 'lucide-react-native';
import DropdownMenu from '../Dropdown/DropwDownComponent';
import {
  clearSearchResults,
  searchProducts,
} from '../../redux/slices/searchSlice';
import SearchResults from '../Search/SearchResult';
import axios from 'axios';
import {addToHistory} from '../../redux/slices/searchHistory';
import {
  setCategoryName,
  setSelectedCategory,
  setSelectedVariant,
} from '../../redux/slices/productSlice';
import {API_URL} from '../../utils/ApiService';
const {width} = Dimensions.get('window');

const DashboardHeader = ({name}) => {
  const navigation = useNavigation();
  const [currentRouteName, setCurrentRouteName] = useState('');
  const [categories, setCategories] = useState();
  const [openInput, setOpenInput] = useState(false);
  const {results, error} = useSelector(state => state.search);
  const dispatch = useDispatch();

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  // Function to get the current route name
  const getCurrentRouteName = () => {
    const state = navigation.getState();
    if (state?.routes?.length > 0) {
      return state.routes[state.index]?.name || '';
    }
    return '';
  };

  const menuRoutes = [
    ROUTES.HOME,
    'products',
    'Cart',
    ROUTES.CART,
    ROUTES.HISTORY,
    ROUTES.TRACKING,
  ];
  // Update the route name dynamically when screen changes
  useFocusEffect(
    useCallback(() => {
      setCurrentRouteName(getCurrentRouteName());
    }, [navigation]),
  );

  // Function to return the header title dynamically
  const getRouteName = () => {
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
      case ROUTES.PROFILE:
        return 'Profile';
      case ROUTES.PRODUCT_DETAILS:
        return name; // Fixed dynamic issue
      case ROUTES.SEARCH:
        return 'Search';
    }
  };

  const {loading, query} = useSelector(state => state.search);
  const [searchText, setSearchText] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchText);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchText]);

  useEffect(() => {
    if (debouncedQuery.trim()) {
      dispatch(searchProducts(debouncedQuery.trim()));
      dispatch(addToHistory(searchText.trim()));
    } else {
      dispatch(searchProducts('')); // Pass empty string
    }
  }, [debouncedQuery, dispatch]);

  const handleSearchSubmit = () => {
    if (searchText.trim()) {
      dispatch(searchProducts(searchText.trim()));

      dispatch(addToHistory(searchText.trim()));
      navigation.navigate(ROUTES.SEARCH); // Navigate to search screen
    }
  };

  const handleClearSearch = () => {
    setSearchText('');
    setOpenInput(false);
    dispatch(clearSearchResults());
  };

  const token = useSelector(state => state.auth.token);
  const getCategoryData = async () => {
    try {
      const {data} = await axios.get(`${API_URL}/category`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(data);
    } catch (error) {
      if (![401, 403].includes(error.response?.status)) {
        console.log(
          'Category Fetch Error:',
          error.response?.data?.message || error.message,
        );
      }
    }
  };

  useEffect(() => {
    getCategoryData();
  }, []);

  const handleGoBack = () => {
    let routeName = getRouteName();
    if (routeName === 'Profile') {
      navigation.goBack();
    } else if (routeName === ROUTES.ITEM_SCREEN) {
      console.log(routeName);
      navigation.navigate('Home');
      // setSearchText('');
      // dispatch(setCategoryName(null));
      // dispatch(setSelectedCategory(null));
      // dispatch(setSelectedVariant(null));
      // dispatch(clearSearchResults());
    } else if (routeName === 'Search') {
      navigation.navigate('Home');
    } else {
      navigation.navigate(ROUTES.ITEM_SCREEN);
    }
  };

  const inputRef = React.useRef(null);

  // Modify the useFocusEffect to use the ref
  useFocusEffect(
    useCallback(() => {
      const routeName = getCurrentRouteName();
      setCurrentRouteName(routeName);
      console.log(routeName, 'routename');

      // Focus the input if we're on the search screen
      if (routeName === ROUTES.SEARCH) {
        // setOpenInput(true);
        // Small timeout to ensure the input is mounted before focusing
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 100);
      }
    }, [navigation]),
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <View style={styles.mainContent}>
          <View style={styles.centerContainer}>
            {currentRouteName && menuRoutes.includes(currentRouteName) ? (
              <TouchableOpacity
                style={styles.menuContainer}
                onPress={() => navigation.openDrawer()}>
                <Image source={menuIcon} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={handleGoBack}
                style={{
                  borderWidth: 1,
                  borderColor: '#CCC',
                  padding: 6,
                  borderRadius: 100,
                }}>
                <ChevronLeft color="#FFF" size={26} />
              </TouchableOpacity>
            )}

            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'relative',
                zIndex: 9999999,
              }}>
              {openInput ||
                (getRouteName() === 'Search' && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      flex: 1,
                      marginLeft: 5,
                      paddingLeft: 10,
                      backgroundColor: '#FFF',
                      borderRadius: 100,
                    }}>
                    <TextInput
                      ref={inputRef}
                      placeholder="Search products..."
                      placeholderTextColor="#555"
                      value={searchText}
                      onChangeText={setSearchText}
                      autoFocus={true}
                      style={{
                        paddingVertical: 10,
                        flex: 1,
                      }}
                    />

                    {searchText.length > 0 && (
                      <TouchableOpacity
                        onPress={() => setSearchText('')}
                        style={{paddingHorizontal: 10}}>
                        <Text style={{fontSize: 22, color: '#555'}}>×</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}

              {openInput && getRouteName() === 'Search' && (
                <Text style={styles.title}>Search products here..</Text>
              )}
              {!openInput &&
                getRouteName() !== 'Search' &&
                getRouteName() !== ROUTES.ITEM_SCREEN && (
                  <Text style={styles.title}>{getRouteName()}</Text>
                )}
              {!openInput && currentRouteName === ROUTES.ITEM_SCREEN && (
                <DropdownMenu categories={categories} />
              )}
            </View>
            <View style={styles.rightSection}>
              <TouchableOpacity
                onPress={() => {
                  if (getRouteName() === 'Search') {
                    // if (openInput && searchText) {
                    //   handleSearchSubmit();
                    // }
                    setOpenInput(!openInput);
                  } else {
                    navigation.navigate(ROUTES.SEARCH);
                  }
                }}
                style={styles.searchButton}>
                <Icon
                  name={openInput ? 'search' : 'search'}
                  size={26}
                  color="#FFF"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.profileContainer}
                onPress={() => navigation.navigate(ROUTES.PROFILE)}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>5</Text>
                </View>
                <Icon3 name="user" size={24} color="#5A5A5A" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default DashboardHeader;
