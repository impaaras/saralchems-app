import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {toggleShowVariants} from '../../redux/slices/authSlice';
import {useDispatch, useSelector} from 'react-redux';
import {
  openScreen,
  setVariants,
  addItem,
  // closeModal,
} from '../../redux/slices/cartSlice'; // Import the action
import {useNavigation} from '@react-navigation/native';
import {ROUTES} from '../../constants/routes';
import {ProductModal} from '../../screens';
import VariantsModal from '../VariantsModal';
import {closeModal, openModal} from '../../redux/slices/modalSlice';
import {callbackRegistry} from '../../utils/Modal/callbackRegistry';
import {fallbackImg} from '../../utils/images';
import {selectVariant} from '../../utils/function/function';
import styles from './Card.styles';
import {setActiveProduct, setSelectedVariant} from '../../redux/slices/newCart';

const ProductCard = ({item, onAddPress, idx}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const showVariants = useSelector(state => state.auth.showVariants);
  const selectedVariant = useSelector(state => state.product.selectedVariant);

  let [variantId, setVariantId] = useState(null);

  const handleShowVariants = (variantArray, parentIndex, parentId) => {
    const updatedVariants = variantArray.map(v => ({
      label: v,
      parentIndex,
      parentId,
    }));
    dispatch(setVariants(updatedVariants));
    // dispatch(setVariants(variantArray));

    dispatch(toggleShowVariants());
    dispatch(
      openModal({
        modalType: 'VARIANT_MODAL',

        callbackId: '123', // optional
      }),
    );
  };

  const openAddModal = (product, index, currentIndex) => {
    if (
      activeProduct?.selectedVariant === null ||
      activeProduct?._id !== currentIndex
    ) {
      dispatch(setActiveProduct(product));
    }
    setVariantId(index);
    const newProduct = {
      ...product,
      parentId: index,
    };
    dispatch(addItem(newProduct));
    dispatch(
      openModal({
        modalType: 'PRODUCT_MODAL',
        callbackId: '123',
      }),
    );
  };

  const selectedProductItem = useSelector(state => state.cart.selectedProduct);
  const isProductModalOpen = useSelector(
    state => state.cart.isProductModalOpen,
  );

  const openScreenTag = (product, index, currentIndex) => {
    if (
      activeProduct?.selectedVariant === null ||
      activeProduct?._id !== currentIndex
    ) {
      dispatch(setActiveProduct(product));
    }

    navigation.navigate(ROUTES.PRODUCT_DETAILS, {product, parentIndex: index});
  };

  const handleAddPress = product => {
    dispatch(addItem(product));
  };

  const handleOpenModal = () => {
    dispatch(
      openModal({
        modalType: 'CONFIRM_MODAL',
        modalProps: {
          title: 'Are you sure?',
          message: 'Do you want to continue?',
        },
        callbackId: '123',
      }),
    );
  };
  const activeProduct = useSelector(state => state.newCart.activeProduct);

  const handleVariantSelect = (product, variant, index, idx, parentId) => {
    dispatch(setActiveProduct(product));
    selectVariant(dispatch, variant, index, idx, parentId);
  };

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <TouchableOpacity>
          <Image source={{uri: fallbackImg()}} style={styles.productImage} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => openAddModal(item, idx, item?._id)}>
          <Text style={styles.addButtonText}>ADD</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.infoContainer}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          {item.variants.length > 0 && (
            <View style={styles.variantsContainer}>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  display: 'flex',
                  flexDirection: 'row',
                }}>
                {item.variants.slice(0, 3).map((variant, index) => (
                  <TouchableOpacity
                    key={index}
                    style={
                      activeProduct?.selectedVariant !==
                      `${variant}${index}${idx}${item._id}`
                        ? // selectedVariant !== `${variant}${index}${idx}${item._id}`
                          styles.variantItem
                        : styles.selectedVariantItem
                    }
                    onPress={() =>
                      handleVariantSelect(item, variant, index, idx, item?._id)
                    }>
                    <Text
                      style={
                        activeProduct?.selectedVariant !==
                        `${variant}${index}${idx}${item._id}`
                          ? // selectedVariant !==
                            // `${variant}${index}${idx}${item._id}`
                            styles.variantText
                          : styles.selectedVariantText
                      }>
                      {variant.length > 50
                        ? `${variant.substring(0, 50)}...`
                        : variant}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {item.variants.length > 1 && (
                <TouchableOpacity
                  style={styles.moreButton}
                  onPress={() =>
                    handleShowVariants(item.variants, idx, item._id)
                  }>
                  <Text style={styles.moreButtonText}>+</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
        <TouchableOpacity onPress={() => openScreenTag(item, idx, item?._id)}>
          <Text style={styles.name}>{item.name}</Text>
        </TouchableOpacity>
        <View style={styles.brandInfo}>
          <Text style={styles.brandText}>
            Brand:{' '}
            {item.brand
              ? item.brand.length > 8
                ? `${item.brand.substring(0, 8)}...`
                : item.brand
              : 'None'}
          </Text>
          <Text style={styles.UnitText}>Unit: ltr</Text>
        </View>
      </View>
    </View>
  );
};

export default ProductCard;
