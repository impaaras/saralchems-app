// import React from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   StyleSheet,
//   TouchableOpacity,
// } from 'react-native';
// import {useDispatch, useSelector} from 'react-redux';
// import {ROUTES} from '../constants/routes';
// import {useNavigation} from '@react-navigation/native';
// import ProductCard from './ProductCard';
// import {addItem} from '../redux/slices/cartSlice';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import {clearHistory} from '../redux/slices/searchHistory';
// import {searchProducts} from '../redux/slices/searchSlice';

// const SearchResults = ({searchText}) => {
//   const dispatch = useDispatch();
//   const {results, loading, error} = useSelector(state => state.search);
//   const {history} = useSelector(state => state.searchHistory);
//   const navigation = useNavigation();

//   const handleAddPress = product => {
//     dispatch(addItem(product));
//   };

//   const handleHistoryItemPress = query => {
//     dispatch(searchProducts(query));
//   };

//   const handleClearHistory = () => {
//     dispatch(clearHistory());
//   };

//   // Define empty states
//   const showNoResults = searchText && results?.length === 0;
//   const showInitialState = !searchText && results?.length === 0;

//   return (
//     <View style={styles.searchResultsContainer}>
//       <ScrollView style={styles.resultsListContainer}>
//         {loading ? (
//           <View style={styles.emptyStateContainer}>
//             <Text style={{fontSize: 16, color: '#555'}}>Loading...</Text>
//           </View>
//         ) : error ? (
//           <View style={styles.emptyStateContainer}>
//             <Text style={{fontSize: 16, color: '#555'}}>
//               Error: {error.message}
//             </Text>
//           </View>
//         ) : showNoResults ? (
//           <View style={styles.emptyStateContainer}>
//             <Icon name="search-off" size={48} color="#CCCCCC" />
//             <Text style={styles.noResultsText}>
//               No results found for "{searchText}"
//             </Text>
//           </View>
//         ) : showInitialState ? (
//           <View style={styles.emptyStateContainer}>
//             {results.map((item, index) => (
//               <ProductCard
//                 key={item._id}
//                 item={item}
//                 onAddPress={handleAddPress}
//                 idx={index}
//               />
//             ))}
//             {history.length > 0 && (
//               <View style={styles.historyContainer}>
//                 <View style={styles.historyHeader}>
//                   <Text style={styles.historyTitle}>Recent Searches</Text>
//                   <TouchableOpacity onPress={handleClearHistory}>
//                     <Text style={styles.clearHistoryText}>Clear</Text>
//                   </TouchableOpacity>
//                 </View>
//                 {history.map((item, index) => (
//                   <TouchableOpacity
//                     key={index}
//                     style={styles.historyItem}
//                     onPress={() => handleHistoryItemPress(item)}>
//                     <Icon name="history" size={20} color="#888" />
//                     <Text style={styles.historyText}>{item}</Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             )}
//           </View>
//         ) : (
//           <>
//             <View style={{padding: 10, backgroundColor: '#E5F1FF'}}>
//               {history.length > 0 && (
//                 <View style={styles.historyContainer}>
//                   <View style={styles.historyHeader}>
//                     <Text style={styles.historyTitle}>Recent Searches</Text>
//                     <TouchableOpacity onPress={handleClearHistory}>
//                       <Text style={styles.clearHistoryText}>Clear</Text>
//                     </TouchableOpacity>
//                   </View>
//                   {history.map((item, index) => (
//                     <TouchableOpacity
//                       key={index}
//                       style={styles.historyItem}
//                       onPress={() => handleHistoryItemPress(item)}>
//                       <Icon name="history" size={20} color="#3C5D87" />
//                       <Text style={styles.historyText}>{item}</Text>
//                     </TouchableOpacity>
//                   ))}
//                 </View>
//               )}
//             </View>

//             <View style={styles.productsContainer}>
//               {results.map((item, index) => (
//                 <ProductCard
//                   key={item._id}
//                   item={item}
//                   onAddPress={handleAddPress}
//                   idx={index}
//                 />
//               ))}
//             </View>
//           </>
//         )}
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     alignSelf: 'center',
//     marginTop: 10,
//   },
//   searchResultsContainer: {
//     width: '100%',
//     marginTop: -80,
//     borderRadius: 10,
//     height: 1000,
//     backgroundColor: '#E5F1FF',
//     zIndex: 1000,
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.25,
//     // paddingBottom: 50,
//     shadowRadius: 3.84,
//   },
//   resultsListContainer: {
//     width: '100%',
//   },
//   productsContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     backgroundColor: '#FFF',
//     borderTopRightRadius: 10,
//     borderTopLeftRadius: 10,
//   },
//   emptyStateContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 10,
//     // minHeight: 200,
//   },
//   noResultsText: {
//     textAlign: 'center',
//     fontSize: 18,
//     color: '#555555',
//     marginTop: 15,
//     fontWeight: '500',
//   },
//   historyContainer: {
//     width: '100%',
//   },
//   historyHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',

//     marginBottom: 10,
//   },
//   historyTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#555',
//   },
//   clearHistoryText: {
//     color: '#3C5D87',
//     fontSize: 14,
//   },
//   historyItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     // paddingVertical: 8,
//     // paddingHorizontal: 10,
//     // backgroundColor: '#FFF',
//     borderRadius: 8,
//     marginBottom: 8,
//   },
//   historyText: {
//     marginLeft: 10,
//     fontSize: 18,
//     // textTransform: 'capitalize',
//     color: '#3C5D87',
//   },
// });

// export default SearchResults;
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {ROUTES} from '../constants/routes';
import {useNavigation} from '@react-navigation/native';
import ProductCard from './ProductCard';
import {addItem} from '../redux/slices/cartSlice';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {clearHistory} from '../redux/slices/searchHistory';
import {searchProducts} from '../redux/slices/searchSlice';

const SearchResults = ({searchText}) => {
  const dispatch = useDispatch();
  const {results, loading, error} = useSelector(state => state.search);
  const {history} = useSelector(state => state.searchHistory);
  const navigation = useNavigation();

  const handleAddPress = product => {
    dispatch(addItem(product));
  };

  const handleHistoryItemPress = query => {
    dispatch(searchProducts(query));
  };

  const handleClearHistory = () => {
    dispatch(clearHistory());
  };

  const showNoResults = searchText && results?.length === 0;
  const showInitialState = !searchText && results?.length === 0;

  const renderProductItem = ({item, index}) => (
    <ProductCard
      key={item._id}
      item={item}
      onAddPress={handleAddPress}
      idx={index}
    />
  );

  return (
    <View style={styles.searchResultsContainer}>
      {loading ? (
        <View style={styles.emptyStateContainer}>
          <ActivityIndicator size="large" color="#3C5D87" />
          <Text style={{fontSize: 16, color: '#555', marginTop: 10}}>
            Loading...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.emptyStateContainer}>
          <Text style={{fontSize: 16, color: '#555'}}>
            Error: {error.message}
          </Text>
        </View>
      ) : showNoResults ? (
        <View style={styles.emptyStateContainer}>
          <Icon name="search-off" size={48} color="#CCCCCC" />
          <Text style={styles.noResultsText}>
            No results found for "{searchText}"
          </Text>
        </View>
      ) : (
        <FlatList
          ListHeaderComponent={() =>
            history.length > 0 && (
              <View style={styles.historySection}>
                <View style={styles.historyHeader}>
                  <Text style={styles.historyTitle}>Recent Searches</Text>
                  <TouchableOpacity onPress={handleClearHistory}>
                    <Text style={styles.clearHistoryText}>Clear</Text>
                  </TouchableOpacity>
                </View>
                {history.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.historyItem}
                    onPress={() => handleHistoryItemPress(item)}>
                    <Icon name="history" size={20} color="#3C5D87" />
                    <Text style={styles.historyText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )
          }
          contentContainerStyle={styles.flatListContainer}
          data={results}
          renderItem={renderProductItem}
          keyExtractor={item => item._id}
          numColumns={3}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchResultsContainer: {
    width: '100%',
    marginTop: -80,
    borderRadius: 10,
    height: 1000,
    backgroundColor: '#E5F1FF',
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  flatListContainer: {
    // padding: 10,
    paddingBottom: 330,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noResultsText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#555555',
    marginTop: 15,
    fontWeight: '500',
  },
  historySection: {
    padding: 10,
    backgroundColor: '#E5F1FF',
    marginBottom: 10,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
  },
  clearHistoryText: {
    color: '#3C5D87',
    fontSize: 14,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyText: {
    marginLeft: 10,
    fontSize: 18,
    color: '#3C5D87',
  },
});

export default SearchResults;
