import {StyleSheet} from 'react-native';
import {
  verticalScale,
  scale,
  moderateScale,
} from '../../utils/Responsive/responsive';

const styles = StyleSheet.create({
  container: {
    marginVertical: verticalScale(10),
    paddingHorizontal: scale(15),
  },
  shimmerContainer: {
    flexDirection: 'row',
    marginVertical: verticalScale(10),
    paddingHorizontal: scale(15),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(10),
  },
  title: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#333',
  },
  viewAll: {
    fontSize: moderateScale(14),
    color: '#666',
  },
  productCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: scale(100),
  },
  productImage: {
    width: scale(85),
    height: scale(85),
    borderRadius: scale(10),
  },
  productName: {
    marginTop: verticalScale(5),
    fontSize: moderateScale(10),
    width: '90%',
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
});

export default styles;
