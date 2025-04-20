import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  screen: {backgroundColor: '#F2F7FE', flex: 1},
  scrollWrapper: {
    marginTop: -80,
    marginLeft: 10,
  },
  container: {
    backgroundColor: '#E5F1FF',
    flexDirection: 'row',
    borderRadius: 15,
    paddingHorizontal: 10,
  },
  itemContainer: {
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10,
    alignItems: 'center',
  },
  selectedItem: {opacity: 1},
  image: {width: 95, height: 95, borderRadius: 15},
  itemTitle: {fontSize: 14, textAlign: 'center', marginTop: 5, width: 95},
  borderBottom: {
    width: '100%',
    height: 4,
    borderRadius: 10,
    backgroundColor: '#3C5D85',
    marginTop: 5,
  },
  productsContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingTop: 20,
    marginHorizontal: 0,
    marginBottom: 20,
  },
});

export default styles;
