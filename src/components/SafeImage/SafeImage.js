// import React, {useState} from 'react';
// import {Image, View, StyleSheet} from 'react-native';

// const SafeImage = ({sourceUri, fallbackUri, style}) => {
//   const [error, setError] = useState(false);
//   console.log(sourceUri, fallbackUri, style);

//   return (
//     <Image
//       source={{uri: !error ? sourceUri : fallbackUri}}
//       style={style}
//       onError={() => setError(true)}
//     />
//   );
// };

// export default SafeImage;
import React, {useState} from 'react';
import {Image, View, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';

const SafeImage = ({sourceUri, style, iconSize = 32, iconColor = '#AAA'}) => {
  const [error, setError] = useState(false);

  return (
    <View style={[styles.container, style]}>
      {!error && sourceUri ? (
        <Image
          source={{uri: sourceUri}}
          style={[StyleSheet.absoluteFill, style]}
          resizeMode="contain"
          onError={() => setError(true)}
        />
      ) : (
        <View style={[styles.iconWrapper, style]}>
          <Icon name="images" size={iconSize} color={iconColor} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  iconWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee', // optional
  },
});

export default SafeImage;
