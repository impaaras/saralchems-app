import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  viewAll: {
    fontSize: 14,
    color: '#666',
  },
  productCard: {
    display: 'flex',

    flexDirection: 'column',
    alignItems: 'flex-start',
    width: 100,

    // marginRight: 10,
  },
  productImage: {
    width: 85,
    height: 85,
    borderRadius: 10,
  },
  productName: {
    marginTop: 5,
    fontSize: 11,
    width: '77%',
    // backgroundColor: 'red',
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
});
export default styles;
