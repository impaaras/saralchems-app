// import {StyleSheet, Text, View} from 'react-native';
// import React from 'react';
// import SearchResults from '../../components/Search/SearchResult';
// import DashboardHeader from '../../components/Header/DashBoardHeader';
// import ProductModal from '../ProductDetails/ProductModal';
// import {closeModal, closeSearchModal} from '../../redux/slices/cartSlice';
// import {useDispatch, useSelector} from 'react-redux';
// import VariantsModal from '../../components/VariantsModal';

// const SearchScreen = () => {
//   const dispatch = useDispatch();
//   const isSearchModal = useSelector(state => state.cart.isSearchModal);
//   const showSearchVariants = useSelector(
//     state => state.auth.showSearchVariants,
//   );

//   return (
//     <View>
//       <DashboardHeader />
//       <SearchResults />
//     </View>
//   );
// };

// export default SearchScreen;

// const styles = StyleSheet.create({});

// import {StyleSheet, View} from 'react-native';
// import React, {useEffect} from 'react';
// import SearchResults from '../../components/Search/SearchResult';
// import DashboardHeader from '../../components/Header/DashBoardHeader';
// import {useDispatch, useSelector} from 'react-redux';
// import {clearSearchResults} from '../../redux/slices/searchSlice';

// const SearchScreen = () => {
//   const dispatch = useDispatch();

//   // Clear search results when leaving search screen
//   useEffect(() => {
//     return () => {
//       // Optional: Clear results when leaving search screen
//       // dispatch(clearSearchResults());
//     };
//   }, [dispatch]);

//   return (
//     <View style={styles.container}>
//       <DashboardHeader />
//       <SearchResults searchText="" />
//     </View>
//   );
// };

// export default React.memo(SearchScreen);

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
// });

import {StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import SearchResults from '../../components/Search/SearchResult';
import DashboardHeader from '../../components/Header/DashBoardHeader';

const SearchScreen = () => {
  const [searchText, setSearchText] = useState('');

  return (
    <View style={styles.container}>
      <DashboardHeader />
      <SearchResults searchText={searchText} />
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
