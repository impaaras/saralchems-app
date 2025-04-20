import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    paddingTop: 14,
    paddingBottom: 4,
    marginTop: -100,
    zIndex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingBottom: 5,
  },
  card: {
    marginHorizontal: 6,

    backgroundColor: '#E5F1FF',
    borderRadius: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 0,
      },
      web: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      },
    }),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 65,
    height: 65,
    margin: 13,
    borderRadius: 10,
  },
  cardContent: {
    flex: 1,
    // padding: 12,
  },
  cardTitle: {
    fontSize: 16,
    width: '70%',

    fontWeight: '600',
    color: '#333',
  },
});

export default styles;
