import React, {useState, useCallback, useMemo, memo, useEffect} from 'react';
import {
  View,
  Modal,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import {useSelector, useDispatch, shallowEqual} from 'react-redux';
import {closeModal} from '../../redux/slices/modalSlice';
import VariantsModal from '../../components/VariantsModal';
import Icon from 'react-native-vector-icons/Fontisto';
import {setSelectedVariant} from '../../redux/slices/productSlice';
import {toggleShowVariants} from '../../redux/slices/authSlice';
import {ProductModal} from '../../screens';
import {RotateCw, X} from 'lucide-react-native';
import CartModal from './CartModal';
import ViewCart from './ViewCart';
import {selectVariant} from '../function/function';
import GlobalAlert from './GlobalAlert';
import ImageZoomModal from '../../components/ImageZoom/ImageZoom';

// Memoized selector to prevent unnecessary re-renders
const selectModalState = state => ({
  isOpen: state.modal.isOpen,
  modalType: state.modal.modalType,
  modalProps: state.modal.modalProps,
});

const selectVariantState = state => ({
  showVariants: state.auth.showVariants,
  variants: state.cart.selectedVariants,
  selectedVariant: state.product.selectedVariant,
  categoryName: state.product.categoryName,
  selectedProductItem: state.cart.selectedProduct,
  activeProduct: state.newCart.activeProduct,
});

const GlobalModal = memo(() => {
  const dispatch = useDispatch();

  // Split selectors to reduce re-renders
  const modalState = useSelector(selectModalState, shallowEqual);
  const variantState = useSelector(selectVariantState, shallowEqual);

  const [alertConfig, setAlertConfig] = useState({});
  const [alertVisible, setAlertVisible] = useState(false);

  // Early return if modal is not open - prevents all calculations
  if (!modalState.isOpen) {
    return null;
  }

  const handleClose = useCallback(() => {
    dispatch(closeModal());
  }, [dispatch]);

  const handleVariantSelect = useCallback(
    (variant, index, idx, parentId) => {
      selectVariant(dispatch, variant, index, idx, parentId);
    },
    [dispatch],
  );

  const showAlert = useCallback(config => {
    setAlertConfig(config);
    setAlertVisible(true);
  }, []);

  const hideAlert = useCallback(() => {
    setAlertVisible(false);
  }, []);

  const filteredVariants = useMemo(
    () =>
      variantState.variants?.filter(
        v =>
          v.label?.toLowerCase() !== 'loose' &&
          !v.label?.toLowerCase().includes('custom'),
      ) || [],
    [variantState.variants],
  );

  const renderModalContent = () => {
    switch (modalState.modalType) {
      case 'PRODUCT_MODAL':
        return <ProductModal product={variantState.selectedProductItem} />;
      case 'ViewCart':
        return <ViewCart />;
      case 'ImageZoomModal':
        return (
          <ImageZoomModal
            visible={modalState.modalProps?.visible}
            imageList={modalState.modalProps?.imageList}
            currentIndex={modalState.modalProps?.currentIndex}
            onClose={handleClose}
          />
        );
      case 'ALERT_MODAL':
        return (
          <GlobalAlert
            visible={alertVisible}
            title={alertConfig.title}
            message={alertConfig.message}
            onConfirm={() => {
              alertConfig.onConfirm?.();
              hideAlert();
            }}
            onCancel={() => {
              alertConfig.onCancel?.();
              hideAlert();
            }}
          />
        );
      default:
        return (
          <>
            <Text style={styles.title}>
              {modalState.modalProps?.title || 'Default Title'}
            </Text>
            <Text style={styles.message}>
              {modalState.modalProps?.message || 'Default Message'}
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </>
        );
    }
  };

  return (
    <View
      style={
        modalState.modalType === 'CART'
          ? styles.overlay2
          : modalState.modalType === 'ViewCart'
          ? styles.viewCartDesign
          : modalState.modalType === 'ImageZoomModal'
          ? styles.zoomContainer
          : styles.overlay
      }>
      <View
        style={
          modalState.modalType === 'VARIANT_MODAL'
            ? styles.modalContent
            : modalState.modalType === 'ViewCart'
            ? styles.viewModalContent
            : modalState.modalType === 'ImageZoomModal'
            ? styles.zoomModal
            : styles.modalContent2
        }>
        {modalState.modalType === 'VARIANT_MODAL' ? (
          <>
            <View style={styles.header}>
              <Text style={styles.title}>Variants</Text>
            </View>
            <ScrollView contentContainerStyle={styles.variantsContainer}>
              <View style={styles.variantsGrid}>
                {filteredVariants.length > 0 ? (
                  filteredVariants.map((variant, index) => {
                    const key = `${variant.label}AFTER${index}${variant.parentIndex}${variant.parentId}`;
                    const isSelected =
                      variantState.activeProduct?.selectedVariant === key;
                    return (
                      <TouchableOpacity
                        key={key}
                        style={
                          isSelected
                            ? styles.selectedVariant
                            : styles.variantItem
                        }
                        onPress={() =>
                          handleVariantSelect(
                            variant.label,
                            index,
                            variant.parentIndex,
                            variant.parentId,
                          )
                        }>
                        <Text
                          style={
                            isSelected
                              ? styles.selectedVariantText
                              : styles.variantText
                          }>
                          {variant.label ||
                            variant.name ||
                            `Variant ${index + 1}`}
                        </Text>
                      </TouchableOpacity>
                    );
                  })
                ) : (
                  <Text style={styles.noVariantsText}>
                    No Variants Available
                  </Text>
                )}
              </View>
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButtonContainer}
              onPress={handleClose}>
              <X size={18} />
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </>
        ) : (
          renderModalContent()
        )}
      </View>
    </View>
  );
});

GlobalModal.displayName = 'GlobalModal';

const styles = StyleSheet.create({
  viewCartDesign: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 9999,
    bottom: 80,
    left: 0,
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
  zoomContainer: {
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
  modalContent2: {
    backgroundColor: '#E5F1FF',
    borderRadius: 25,
    width: '90%',
  },
  zoomModal: {
    backgroundColor: '#FFF',
    borderRadius: 25,
    width: '90%',
  },
  modalContent: {
    backgroundColor: '#E5F1FF',
    borderRadius: 25,
    width: '90%',
    maxHeight: '60%',
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
    paddingTop: 10,
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
  noVariantsText: {
    textAlign: 'center',
    marginTop: 10,
  },
  closeButtonContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'center',
    paddingTop: 8,
    paddingBottom: 2,
    alignItems: 'center',
  },
  closeText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default GlobalModal;
