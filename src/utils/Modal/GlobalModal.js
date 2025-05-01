import React from 'react';
import {
  View,
  Modal,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';

import {closeModal} from '../../redux/slices/modalSlice';
import VariantsModal from '../../components/VariantsModal';
import Icon from 'react-native-vector-icons/Fontisto';
import {setSelectedVariant} from '../../redux/slices/productSlice';
import {toggleShowVariants} from '../../redux/slices/authSlice';
import {ProductModal} from '../../screens';
import {RotateCw, X} from 'lucide-react-native';
import CartModal from './CartModal';
import ViewCart from './ViewCart';

const GlobalModal = () => {
  const dispatch = useDispatch();
  const {isOpen, modalType, modalProps} = useSelector(state => state.modal);
  const handleClose = () => {
    dispatch(
      closeModal(
        closeModal({
          modalType: 'VARIANT_MODAL',
          callbackId: '123',
        }),
      ),
    );
  };

  const showVariants = useSelector(state => state.auth.showVariants);
  const variants = useSelector(state => state.cart.selectedVariants);

  const selectVariant = (variant, index, parentIndex, parentId) => {
    let newVariantName = `${variant}${index}${parentIndex}${parentId}`;
    console.log('newavain', newVariantName);
    dispatch(setSelectedVariant(newVariantName));
  };

  const selectedVariant = useSelector(state => state.product.selectedVariant);
  const categoryName = useSelector(state => state.product.categoryName);
  const selectedProductItem = useSelector(state => state.cart.selectedProduct);

  const renderModalContent = () => {
    switch (modalType) {
      case 'PRODUCT_MODAL':
        return (
          <>
            <ProductModal product={selectedProductItem} />
          </>
        );
      case 'CART':
        return (
          <>
            <CartModal product={selectedProductItem} />
          </>
        );
      case 'ViewCart':
        return (
          <>
            <ViewCart />
          </>
        );
      default:
        return (
          <>
            <Text style={styles.title}>
              {modalProps?.title || 'Default Titlssesssss'}
            </Text>
            <Text style={styles.message}>
              {modalProps?.message || 'Default Message'}
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </>
        );
    }
  };

  if (isOpen) {
    return (
      <View
        style={
          modalType === 'CART'
            ? styles.overlay2
            : modalType === 'ViewCart'
            ? styles.viewCartDesign
            : styles.overlay
        }>
        <View
          style={
            modalType === 'VARIANT_MODAL'
              ? styles.modalContent
              : modalType === 'ViewCart'
              ? styles.viewModalContent
              : styles.modalContent2
          }>
          {modalType === 'VARIANT_MODAL' ? (
            <>
              <View style={styles.header}>
                <Text style={styles.title}>Variants</Text>
              </View>
              <ScrollView contentContainerStyle={styles.variantsContainer}>
                <View style={styles.variantsGrid}>
                  {variants.length > 0 ? (
                    variants.map((variant, index) => (
                      <View key={index}>
                        <TouchableOpacity
                          style={
                            selectedVariant !==
                            `${variant.label}${index}${variant.parentIndex}${variant.parentId}`
                              ? styles.variantItem
                              : styles.selectedVariant
                          }
                          onPress={() =>
                            selectVariant(
                              variant.label,
                              index,
                              variant.parentIndex,
                              variant.parentId,
                            )
                          }>
                          <Text
                            style={
                              selectedVariant !==
                              `${variant.label}${index}${variant.parentIndex}${variant.parentId}`
                                ? styles.variantText
                                : styles.selectedVariantText
                            }>
                            {variant.label ||
                              variant.name ||
                              `Variant ${index + 1}`}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ))
                  ) : (
                    <Text style={{textAlign: 'center', marginTop: 10}}>
                      No Variants Available
                    </Text>
                  )}
                </View>
              </ScrollView>
              <TouchableOpacity
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignSelf: 'center',
                  paddingTop: 8,
                  paddingBottom: 2,
                  alignItems: 'center',
                }}
                onPress={handleClose}>
                <X size={18} />
                <Text style={{fontSize: 16, fontWeight: '500'}}>Close</Text>
              </TouchableOpacity>
            </>
          ) : (
            renderModalContent()
          )}
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  viewCartDesign: {
    flex: 1,
    // backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 9999,
    bottom: 80,
    // bottom
    left: 0,
    // height: '100%',
    width: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 9999,
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
  },
  overlay2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 9999,
    right: 0,
    bottom: 90,
    width: '70%',
  },
  cartModalContainer: {
    width: '100%',
    backgroundColor: 'transparent',
  },
  viewModalContent: {
    // backgroundColor: '#3C5D87',
    borderRadius: 30,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    minHeight: 150,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  closeButton: {
    padding: 10,
    backgroundColor: '#2196F3',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 20,
  },
  modalContent2: {
    backgroundColor: '#E5F1FF',
    borderRadius: 25,
    // paddingTop: 0,
    width: '90%',
    // maxHeight: '60%',
  },
  modalContent: {
    backgroundColor: '#E5F1FF',
    borderRadius: 25,
    // paddingTop: 0,
    width: '90%',
    maxHeight: '60%',
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
    paddingTop: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  variantsContainer: {
    minHeight: 180,
    paddingHorizontal: 5,
    borderRadius: 20,
    backgroundColor: 'white',
  },
  variantsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: 10,
    justifyContent: 'flex-start',
  },
  variantItem: {
    backgroundColor: '#E5F1FF',
    borderRadius: 5,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 5,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedVariant: {
    backgroundColor: '#3C5D86',
    borderRadius: 5,

    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 5,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  variantText: {
    fontSize: 11,
    color: '#3C5D86',
    textAlign: 'center',
    fontWeight: '600',
  },
  selectedVariantText: {
    fontSize: 11,
    color: '#FFF',
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default GlobalModal;
