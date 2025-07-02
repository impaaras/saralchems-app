import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'red',
    backgroundColor: '#F4F9FF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F9FF',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F9FF',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  sectionContainer: {
    backgroundColor: '#FFF',
    shadowColor: '#002',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 5,
    marginTop: 10,
    marginBottom: 10,
  },
  scrollHomescreen: {
    paddingBottom: 80,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 5,
    fontSize: 15,
    color: '#101924',
    fontWeight: '600',
  },
});
export default styles;
