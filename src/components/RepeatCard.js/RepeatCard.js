import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {
  scale,
  verticalScale,
  moderateScale,
} from '../../utils/Responsive/responsive';
import Colors from '../../assets/color';
import {fallbackImg} from '../../utils/images';

const RepeatCard = ({unique, imageSource, name, brand, unit, screen}) => {
  return (
    <View key={unique} style={styles.cardContainer}>
      <View
        style={{
          borderWidth: screen !== 'repeat' ? 0.5 : 0,
          borderColor: Colors.BORDER_GREY,
          padding: moderateScale(8),
          borderRadius: scale(10),
        }}>
        {imageSource ? (
          <Image
            source={{
              uri: `https://api.saraldyechems.com/upload/image/${imageSource}`,
            }}
            style={styles.image}
            resizeMode="contain"
          />
        ) : (
          <Image
            source={{uri: fallbackImg()}} // Call the function here
            style={styles.image}
            resizeMode="contain"
          />
        )}
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.nameText}>{name}</Text>
        <View style={styles.detailsRow}>
          <Text style={styles.detailText}>
            <Text style={styles.boldLabel}>Brand :</Text> {brand}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.boldLabel}>Unite :</Text> {unit}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default RepeatCard;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#E5F0FF',
    borderRadius: moderateScale(10),
    // padding: moderateScale(8),
    width: scale(140),
    margin: scale(2),
  },
  image: {
    width: '100%',
    height: verticalScale(70),
    borderRadius: moderateScale(6),
  },
  textContainer: {
    padding: moderateScale(8),
  },
  nameText: {
    fontSize: moderateScale(11),
    fontWeight: '600',
    color: '#000',
    marginBottom: verticalScale(4),
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailText: {
    fontSize: moderateScale(9),
    color: 'rgba(0, 0, 0, 1)',
  },
  boldLabel: {
    fontWeight: 'bold',
    color: '#000',
  },
});
