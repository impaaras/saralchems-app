import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import SearchResults from '../../components/SearchResult';
import DashboardHeader from '../../components/DashBoardHeader';
import ProductModal from '../ProductDetails/ProductModal';
import {closeModal, closeSearchModal} from '../../redux/slices/cartSlice';
import {useDispatch, useSelector} from 'react-redux';
import VariantsModal from '../../components/VariantsModal';

const SearchScreen = () => {
  const dispatch = useDispatch();
  const isSearchModal = useSelector(state => state.cart.isSearchModal);
  const showSearchVariants = useSelector(
    state => state.auth.showSearchVariants,
  );
  const selectedProductItem = useSelector(state => state.cart.selectedProduct);

  return (
    <View>
      <DashboardHeader />
      <SearchResults />
      {/* {isSearchModal && selectedProductItem && (
        <ProductModal
          visible={isSearchModal}
          onClose={() => dispatch(closeSearchModal())}
          product={selectedProductItem}
        />
      )}
      <VariantsModal
        visible={showSearchVariants}
        variants={selectedProductItem?.variants || []}
      /> */}
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({});
