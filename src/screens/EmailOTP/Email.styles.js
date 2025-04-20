import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(244, 249, 255,0.9)',
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
    zIndex: 1,
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 100,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2B4C7E',
    marginBottom: 10,
  },
  subHeaderText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  attemptsText: {
    fontSize: 14,
    color: '#ff6b6b',
    marginTop: 10,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DDD',
    backgroundColor: '#fff',
    fontSize: 20,
    textAlign: 'center',
    shadowColor: '#333',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 100,
  },
  otpInputDisabled: {
    backgroundColor: '#f5f5f5',
    borderColor: '#e0e0e0',
  },
  verifyButtonContainer: {
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
  verifyButtonDisabled: {
    opacity: 0.7,
  },
  verifyButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  resendText: {
    color: '#666',
  },
  resendLink: {
    color: '#2B4C7E',
    fontWeight: '600',
  },
  resendLinkDisabled: {
    color: '#999',
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
