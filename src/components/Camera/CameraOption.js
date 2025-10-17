import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Animated,
  Easing,
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import {BookMarked, Plus} from 'lucide-react-native';
import Colors from '../../assets/color';
import {scale} from '../../utils/Responsive/responsive';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Icon2 from 'react-native-vector-icons/Entypo';

const CameraOption = () => {
  const [visible, setVisible] = useState(false);
  const animatedHeight = useRef(new Animated.Value(0)).current;

  const toggleVisibility = () => {
    setVisible(prev => !prev);
  };

  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: visible ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
      easing: Easing.out(Easing.ease),
    }).start();
  }, [visible]);

  const containerHeight = animatedHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, scale(75)], // adjust based on the height of icons
  });

  const opacity = animatedHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const rotateInterpolate = animatedHeight.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          height: containerHeight,
          opacity,
          //   overflow: 'hidden',
        }}>
        <TouchableWithoutFeedback>
          <View style={styles.pdfIcon}>
            <Icon name="file-pdf" color={Colors.PRIMARY} size={14} />
          </View>
        </TouchableWithoutFeedback>

        <View style={{borderWidth: 0.4, borderColor: Colors.BORDER_GREY}} />

        <TouchableWithoutFeedback>
          <View style={styles.cameraIcon}>
            <Icon2 name="camera" color={Colors.TEXT_WHITE} size={14} />
          </View>
        </TouchableWithoutFeedback>
      </Animated.View>

      <View style={styles.camera}>
        <TouchableOpacity onPress={toggleVisibility}>
          <Animated.View style={{transform: [{rotate: rotateInterpolate}]}}>
            <Plus color={Colors.PRIMARY} size={22} />
          </Animated.View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CameraOption;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    backgroundColor: Colors.TEXT_WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scale(30),
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowColor: 'rgba(0,0,0,0.4)',
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 10,
  },
  camera: {
    padding: scale(10),
    backgroundColor: Colors.TEXT_WHITE,
    borderRadius: scale(30),
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowColor: 'rgba(0,0,0,0.5)',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 10,
  },
  cameraIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.PRIMARY_DARK,
    padding: scale(6),
    borderRadius: scale(30),
    marginTop: scale(5),
    marginBottom: scale(5),
  },
  pdfIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.TEXT_WHITE,
    padding: scale(5),
    borderRadius: scale(30),
    borderWidth: 1,
    borderColor: Colors.BORDER_GREY,
    marginBottom: scale(5),
    marginTop: scale(5),
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowColor: Colors.PRIMARY,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 20,
  },
});
