import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(244, 249, 255,0.9)',
    height: '100%',
    width: '100%',
    paddingBottom: 20,
  },
  circle1: {
    position: 'absolute',
    top: -70,
    left: -120,
    width: 200,
    height: 200,
    borderRadius: 150,
    backgroundColor: '#8BA1C3',
    opacity: 0.7,
    zIndex: 0,
  },
  circle2: {
    position: 'absolute',
    top: -90,
    left: 7,
    width: 170,
    height: 170,
    borderRadius: 100,
    backgroundColor: '#8BA1C3',
    opacity: 0.7,
    zIndex: 0,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 20,
    width: '100%',
  },
  logo: {
    width: 110,
    height: 110,
    borderRadius: 80,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#555',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 100,
  },
  formContainer: {
    paddingHorizontal: 40,
    width: '100%',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#DDD',
    marginBottom: 15,
    fontSize: 16,
    shadowColor: '#333',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 0,
  },
  // New dropdown styles
  dropdownContainer: {
    position: 'relative',
    width: '100%',
    marginBottom: 15,
    zIndex: 1000,
  },
  dropdownButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#DDD',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#555',
  },
  dropdownArrow: {
    fontSize: 16,
    color: '#555',
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#DDD',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#555',
  },
  // inputError: {
  //   borderColor: '#ff0000',
  // },
  // errorText: {
  //   color: '#ff0000',
  //   fontSize: 12,
  //   marginTop: -10,
  //   marginBottom: 10,
  //   marginLeft: 20,
  // },
  loginButtonContainer: {
    width: '100%',
    height: 50,
    marginTop: 20,
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 100,
  },
  loginButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2B4C7E',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
    marginTop: 10,
    width: '100%',
  },
  signupText: {
    color: '#666',
  },
  signupLink: {
    color: '#2B4C7E',
    fontWeight: '600',
    marginLeft: 5,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  errorToast: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#ff6b6b',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  errorToastText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default styles;
