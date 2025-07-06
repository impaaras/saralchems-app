import {StyleSheet} from 'react-native';
import {scale} from '../../../screens/Cart/responsive';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: scale(16),
    fontWeight: '700',
    color: '#333',
    fontFamily: 'Poppins-SemiBold', // Use your Poppins font
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#CCC',
    backgroundColor: '#FFF',
  },
  actionText: {
    marginLeft: 4,
    fontSize: scale(12),
    color: '#000',
    fontFamily: 'Poppins-Medium', // Use your Poppins font
  },
});
export default styles;
