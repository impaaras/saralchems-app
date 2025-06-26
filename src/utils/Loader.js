// import React, {useRef, useEffect} from 'react';
// import {View, StyleSheet, Animated, Text} from 'react-native';

// const DyeDropLoader = ({visible}) => {
//   // Drop animation
//   const dropY = useRef(new Animated.Value(-100)).current;
//   const dropScale = useRef(new Animated.Value(1)).current;
//   const dropOpacity = useRef(new Animated.Value(1)).current;

//   // Ripple effects (multiple concentric circles)
//   const ripple1Scale = useRef(new Animated.Value(0)).current;
//   const ripple1Opacity = useRef(new Animated.Value(0)).current;
//   const ripple2Scale = useRef(new Animated.Value(0)).current;
//   const ripple2Opacity = useRef(new Animated.Value(0)).current;
//   const ripple3Scale = useRef(new Animated.Value(0)).current;
//   const ripple3Opacity = useRef(new Animated.Value(0)).current;

//   // Color dispersion effect
//   const colorSpread = useRef(new Animated.Value(0)).current;
//   const colorOpacity = useRef(new Animated.Value(0)).current;
//   const colorRotation = useRef(new Animated.Value(0)).current;

//   // Additional color blobs
//   const blob1Scale = useRef(new Animated.Value(0)).current;
//   const blob2Scale = useRef(new Animated.Value(0)).current;
//   const blob3Scale = useRef(new Animated.Value(0)).current;
//   const blob1Opacity = useRef(new Animated.Value(0)).current;
//   const blob2Opacity = useRef(new Animated.Value(0)).current;
//   const blob3Opacity = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     if (visible) {
//       startDyeAnimation();
//     }
//   }, [visible]);

//   const startDyeAnimation = () => {
//     const mainAnimation = Animated.loop(
//       Animated.sequence([
//         // Reset all values
//         Animated.parallel([
//           Animated.timing(dropY, {
//             toValue: -100,
//             duration: 0,
//             useNativeDriver: true,
//           }),
//           Animated.timing(dropScale, {
//             toValue: 1,
//             duration: 0,
//             useNativeDriver: true,
//           }),
//           Animated.timing(dropOpacity, {
//             toValue: 1,
//             duration: 0,
//             useNativeDriver: true,
//           }),
//           Animated.timing(ripple1Scale, {
//             toValue: 0,
//             duration: 0,
//             useNativeDriver: true,
//           }),
//           Animated.timing(ripple1Opacity, {
//             toValue: 0,
//             duration: 0,
//             useNativeDriver: true,
//           }),
//           Animated.timing(ripple2Scale, {
//             toValue: 0,
//             duration: 0,
//             useNativeDriver: true,
//           }),
//           Animated.timing(ripple2Opacity, {
//             toValue: 0,
//             duration: 0,
//             useNativeDriver: true,
//           }),
//           Animated.timing(ripple3Scale, {
//             toValue: 0,
//             duration: 0,
//             useNativeDriver: true,
//           }),
//           Animated.timing(ripple3Opacity, {
//             toValue: 0,
//             duration: 0,
//             useNativeDriver: true,
//           }),
//           Animated.timing(colorSpread, {
//             toValue: 0,
//             duration: 0,
//             useNativeDriver: true,
//           }),
//           Animated.timing(colorOpacity, {
//             toValue: 0,
//             duration: 0,
//             useNativeDriver: true,
//           }),
//           Animated.timing(blob1Scale, {
//             toValue: 0,
//             duration: 0,
//             useNativeDriver: true,
//           }),
//           Animated.timing(blob2Scale, {
//             toValue: 0,
//             duration: 0,
//             useNativeDriver: true,
//           }),
//           Animated.timing(blob3Scale, {
//             toValue: 0,
//             duration: 0,
//             useNativeDriver: true,
//           }),
//           Animated.timing(blob1Opacity, {
//             toValue: 0,
//             duration: 0,
//             useNativeDriver: true,
//           }),
//           Animated.timing(blob2Opacity, {
//             toValue: 0,
//             duration: 0,
//             useNativeDriver: true,
//           }),
//           Animated.timing(blob3Opacity, {
//             toValue: 0,
//             duration: 0,
//             useNativeDriver: true,
//           }),
//         ]),

//         // Wait before drop
//         Animated.delay(800),

//         // Drop falls down
//         Animated.parallel([
//           Animated.timing(dropY, {
//             toValue: 0,
//             duration: 1200,
//             useNativeDriver: true,
//           }),
//           // Drop gets slightly bigger as it falls
//           Animated.timing(dropScale, {
//             toValue: 1.3,
//             duration: 1200,
//             useNativeDriver: true,
//           }),
//         ]),

//         // Impact: Drop disappears and ripples start
//         Animated.parallel([
//           // Drop disappears
//           Animated.timing(dropOpacity, {
//             toValue: 0,
//             duration: 200,
//             useNativeDriver: true,
//           }),

//           // First ripple
//           Animated.parallel([
//             Animated.timing(ripple1Scale, {
//               toValue: 3,
//               duration: 1500,
//               useNativeDriver: true,
//             }),
//             Animated.sequence([
//               Animated.timing(ripple1Opacity, {
//                 toValue: 0.8,
//                 duration: 100,
//                 useNativeDriver: true,
//               }),
//               Animated.timing(ripple1Opacity, {
//                 toValue: 0,
//                 duration: 1400,
//                 useNativeDriver: true,
//               }),
//             ]),
//           ]),

//           // Second ripple (delayed)
//           Animated.sequence([
//             Animated.delay(300),
//             Animated.parallel([
//               Animated.timing(ripple2Scale, {
//                 toValue: 4,
//                 duration: 1800,
//                 useNativeDriver: true,
//               }),
//               Animated.sequence([
//                 Animated.timing(ripple2Opacity, {
//                   toValue: 0.6,
//                   duration: 100,
//                   useNativeDriver: true,
//                 }),
//                 Animated.timing(ripple2Opacity, {
//                   toValue: 0,
//                   duration: 1700,
//                   useNativeDriver: true,
//                 }),
//               ]),
//             ]),
//           ]),

//           // Third ripple (more delayed)
//           Animated.sequence([
//             Animated.delay(600),
//             Animated.parallel([
//               Animated.timing(ripple3Scale, {
//                 toValue: 5,
//                 duration: 2000,
//                 useNativeDriver: true,
//               }),
//               Animated.sequence([
//                 Animated.timing(ripple3Opacity, {
//                   toValue: 0.4,
//                   duration: 100,
//                   useNativeDriver: true,
//                 }),
//                 Animated.timing(ripple3Opacity, {
//                   toValue: 0,
//                   duration: 1900,
//                   useNativeDriver: true,
//                 }),
//               ]),
//             ]),
//           ]),

//           // Color dispersion starts after impact
//           Animated.sequence([
//             Animated.delay(200),
//             Animated.parallel([
//               Animated.timing(colorSpread, {
//                 toValue: 1,
//                 duration: 2000,
//                 useNativeDriver: true,
//               }),
//               Animated.sequence([
//                 Animated.timing(colorOpacity, {
//                   toValue: 0.7,
//                   duration: 300,
//                   useNativeDriver: true,
//                 }),
//                 Animated.timing(colorOpacity, {
//                   toValue: 0.3,
//                   duration: 1700,
//                   useNativeDriver: true,
//                 }),
//               ]),
//             ]),
//           ]),

//           // Color blobs appear
//           Animated.sequence([
//             Animated.delay(400),
//             Animated.stagger(200, [
//               Animated.parallel([
//                 Animated.timing(blob1Scale, {
//                   toValue: 1,
//                   duration: 800,
//                   useNativeDriver: true,
//                 }),
//                 Animated.sequence([
//                   Animated.timing(blob1Opacity, {
//                     toValue: 0.6,
//                     duration: 200,
//                     useNativeDriver: true,
//                   }),
//                   Animated.timing(blob1Opacity, {
//                     toValue: 0,
//                     duration: 1200,
//                     useNativeDriver: true,
//                   }),
//                 ]),
//               ]),
//               Animated.parallel([
//                 Animated.timing(blob2Scale, {
//                   toValue: 1,
//                   duration: 1000,
//                   useNativeDriver: true,
//                 }),
//                 Animated.sequence([
//                   Animated.timing(blob2Opacity, {
//                     toValue: 0.5,
//                     duration: 200,
//                     useNativeDriver: true,
//                   }),
//                   Animated.timing(blob2Opacity, {
//                     toValue: 0,
//                     duration: 1400,
//                     useNativeDriver: true,
//                   }),
//                 ]),
//               ]),
//               Animated.parallel([
//                 Animated.timing(blob3Scale, {
//                   toValue: 1,
//                   duration: 900,
//                   useNativeDriver: true,
//                 }),
//                 Animated.sequence([
//                   Animated.timing(blob3Opacity, {
//                     toValue: 0.4,
//                     duration: 200,
//                     useNativeDriver: true,
//                   }),
//                   Animated.timing(blob3Opacity, {
//                     toValue: 0,
//                     duration: 1300,
//                     useNativeDriver: true,
//                   }),
//                 ]),
//               ]),
//             ]),
//           ]),
//         ]),

//         // Hold final state briefly
//         Animated.delay(1000),
//       ]),
//     );

//     // Continuous rotation for color dispersion
//     const rotationAnimation = Animated.loop(
//       Animated.timing(colorRotation, {
//         toValue: 1,
//         duration: 8000,
//         useNativeDriver: true,
//       }),
//     );

//     mainAnimation.start();
//     rotationAnimation.start();
//   };

//   if (!visible) return null;

//   const rotationInterpolate = colorRotation.interpolate({
//     inputRange: [0, 1],
//     outputRange: ['0deg', '360deg'],
//   });

//   return (
//     <View style={styles.container}>
//       {/* Water surface (invisible baseline) */}
//       <View style={styles.waterSurface} />

//       {/* Dye drop */}
//       <Animated.View
//         style={[
//           styles.dyeDrop,
//           {
//             transform: [{translateY: dropY}, {scale: dropScale}],
//             opacity: dropOpacity,
//           },
//         ]}>
//         <View style={styles.dropGradient} />
//       </Animated.View>

//       {/* Ripple effects */}
//       <Animated.View
//         style={[
//           styles.ripple,
//           styles.ripple1,
//           {
//             transform: [{scale: ripple1Scale}],
//             opacity: ripple1Opacity,
//           },
//         ]}
//       />
//       <Animated.View
//         style={[
//           styles.ripple,
//           styles.ripple2,
//           {
//             transform: [{scale: ripple2Scale}],
//             opacity: ripple2Opacity,
//           },
//         ]}
//       />
//       <Animated.View
//         style={[
//           styles.ripple,
//           styles.ripple3,
//           {
//             transform: [{scale: ripple3Scale}],
//             opacity: ripple3Opacity,
//           },
//         ]}
//       />

//       {/* Color dispersion effect */}
//       <Animated.View
//         style={[
//           styles.colorDispersion,
//           {
//             transform: [{scale: colorSpread}, {rotate: rotationInterpolate}],
//             opacity: colorOpacity,
//           },
//         ]}>
//         <View style={[styles.colorBlob, styles.colorBlob1]} />
//         <View style={[styles.colorBlob, styles.colorBlob2]} />
//         <View style={[styles.colorBlob, styles.colorBlob3]} />
//         <View style={[styles.colorBlob, styles.colorBlob4]} />
//       </Animated.View>

//       {/* Individual color blobs */}
//       <Animated.View
//         style={[
//           styles.floatingBlob,
//           styles.floatingBlob1,
//           {
//             transform: [{scale: blob1Scale}],
//             opacity: blob1Opacity,
//           },
//         ]}
//       />
//       <Animated.View
//         style={[
//           styles.floatingBlob,
//           styles.floatingBlob2,
//           {
//             transform: [{scale: blob2Scale}],
//             opacity: blob2Opacity,
//           },
//         ]}
//       />
//       <Animated.View
//         style={[
//           styles.floatingBlob,
//           styles.floatingBlob3,
//           {
//             transform: [{scale: blob3Scale}],
//             opacity: blob3Opacity,
//           },
//         ]}
//       />

//       {/* Loading text */}
//       <Text style={styles.loadingText}>Please wait...</Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: '#FFFFFF',
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 1000,
//   },
//   waterSurface: {
//     position: 'absolute',
//     width: '100%',
//     height: 2,
//     backgroundColor: 'transparent',
//   },
//   dyeDrop: {
//     position: 'absolute',
//     width: 24,
//     height: 32,
//     top: '40%',
//   },
//   dropGradient: {
//     width: '100%',
//     height: '100%',
//     backgroundColor: '#E74C3C',
//     borderRadius: 20,
//     borderBottomLeftRadius: 2,
//     borderBottomRightRadius: 2,
//     shadowColor: '#E74C3C',
//     shadowOffset: {width: 0, height: 4},
//     shadowOpacity: 0.4,
//     shadowRadius: 8,
//     elevation: 8,
//   },
//   ripple: {
//     position: 'absolute',
//     borderWidth: 3,
//     borderRadius: 150,
//     top: '50%',
//     left: '50%',
//     marginTop: -75,
//     marginLeft: -75,
//     width: 150,
//     height: 150,
//   },
//   ripple1: {
//     borderColor: '#3498DB',
//   },
//   ripple2: {
//     borderColor: '#E74C3C',
//   },
//   ripple3: {
//     borderColor: '#F39C12',
//   },
//   colorDispersion: {
//     position: 'absolute',
//     width: 200,
//     height: 200,
//     top: '50%',
//     left: '50%',
//     marginTop: -100,
//     marginLeft: -100,
//   },
//   colorBlob: {
//     position: 'absolute',
//     borderRadius: 30,
//   },
//   colorBlob1: {
//     width: 40,
//     height: 60,
//     backgroundColor: '#E74C3C',
//     top: 20,
//     left: 80,
//     transform: [{rotate: '15deg'}],
//   },
//   colorBlob2: {
//     width: 50,
//     height: 35,
//     backgroundColor: '#3498DB',
//     top: 80,
//     left: 30,
//     transform: [{rotate: '-20deg'}],
//   },
//   colorBlob3: {
//     width: 35,
//     height: 45,
//     backgroundColor: '#F39C12',
//     top: 120,
//     left: 120,
//     transform: [{rotate: '45deg'}],
//   },
//   colorBlob4: {
//     width: 45,
//     height: 40,
//     backgroundColor: '#9B59B6',
//     top: 60,
//     left: 140,
//     transform: [{rotate: '-35deg'}],
//   },
//   floatingBlob: {
//     position: 'absolute',
//     borderRadius: 25,
//     top: '50%',
//   },
//   floatingBlob1: {
//     width: 30,
//     height: 30,
//     backgroundColor: '#E67E22',
//     left: '30%',
//     marginTop: -50,
//   },
//   floatingBlob2: {
//     width: 25,
//     height: 25,
//     backgroundColor: '#1ABC9C',
//     right: '30%',
//     marginTop: 20,
//   },
//   floatingBlob3: {
//     width: 35,
//     height: 35,
//     backgroundColor: '#8E44AD',
//     left: '60%',
//     marginTop: -80,
//   },
//   loadingText: {
//     position: 'absolute',
//     bottom: '25%',
//     fontSize: 18,
//     color: '#2C3E50',
//     fontWeight: '600',
//     letterSpacing: 1,
//   },
// });

// export default DyeDropLoader;
import React, {useRef, useEffect} from 'react';
import {View, StyleSheet, Animated, Text} from 'react-native';

const DyeDropLoader = ({visible}) => {
  // Drop animation
  const dropY = useRef(new Animated.Value(-100)).current;
  const dropScale = useRef(new Animated.Value(1)).current;
  const dropOpacity = useRef(new Animated.Value(1)).current;

  // Ripple effects (reduced to just one for simplicity)
  const rippleScale = useRef(new Animated.Value(0)).current;
  const rippleOpacity = useRef(new Animated.Value(0)).current;

  // Enhanced color dispersion effect
  const colorSpread = useRef(new Animated.Value(0)).current;
  const colorOpacity = useRef(new Animated.Value(0)).current;
  const colorRotation = useRef(new Animated.Value(0)).current;

  // Individual color blobs with movement
  const blob1Scale = useRef(new Animated.Value(0)).current;
  const blob2Scale = useRef(new Animated.Value(0)).current;
  const blob3Scale = useRef(new Animated.Value(0)).current;
  const blob4Scale = useRef(new Animated.Value(0)).current;
  const blob1Opacity = useRef(new Animated.Value(0)).current;
  const blob2Opacity = useRef(new Animated.Value(0)).current;
  const blob3Opacity = useRef(new Animated.Value(0)).current;
  const blob4Opacity = useRef(new Animated.Value(0)).current;

  // Movement animations for floating effect
  const blob1X = useRef(new Animated.Value(0)).current;
  const blob1Y = useRef(new Animated.Value(0)).current;
  const blob2X = useRef(new Animated.Value(0)).current;
  const blob2Y = useRef(new Animated.Value(0)).current;
  const blob3X = useRef(new Animated.Value(0)).current;
  const blob3Y = useRef(new Animated.Value(0)).current;
  const blob4X = useRef(new Animated.Value(0)).current;
  const blob4Y = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      startDyeAnimation();
    }
  }, [visible]);

  const startDyeAnimation = () => {
    const mainAnimation = Animated.loop(
      Animated.sequence([
        // Reset all values
        Animated.parallel([
          Animated.timing(dropY, {
            toValue: -100,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(dropScale, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(dropOpacity, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(rippleScale, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(rippleOpacity, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(colorSpread, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(colorOpacity, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
          // Reset all blobs
          Animated.timing(blob1Scale, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(blob1Opacity, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(blob1X, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(blob1Y, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(blob2Scale, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(blob2Opacity, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(blob2X, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(blob2Y, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(blob3Scale, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(blob3Opacity, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(blob3X, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(blob3Y, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(blob4Scale, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(blob4Opacity, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(blob4X, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(blob4Y, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),

        // Brief wait before drop
        Animated.delay(500),

        // Drop falls down (faster)
        Animated.parallel([
          Animated.timing(dropY, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(dropScale, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),

        // Quick impact and single ripple
        Animated.parallel([
          // Drop disappears quickly
          Animated.timing(dropOpacity, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
          }),

          // Single ripple effect
          Animated.parallel([
            Animated.timing(rippleScale, {
              toValue: 2.5,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.sequence([
              Animated.timing(rippleOpacity, {
                toValue: 0.6,
                duration: 100,
                useNativeDriver: true,
              }),
              Animated.timing(rippleOpacity, {
                toValue: 0,
                duration: 900,
                useNativeDriver: true,
              }),
            ]),
          ]),

          // MAIN FOCUS: Enhanced color dispersion with longer visibility
          Animated.sequence([
            Animated.delay(100),
            Animated.parallel([
              // Central color spread
              Animated.timing(colorSpread, {
                toValue: 1.5,
                duration: 2500,
                useNativeDriver: true,
              }),
              Animated.sequence([
                Animated.timing(colorOpacity, {
                  toValue: 0.8,
                  duration: 400,
                  useNativeDriver: true,
                }),
                // Hold the colors visible for longer
                Animated.delay(2000),
                Animated.timing(colorOpacity, {
                  toValue: 0,
                  duration: 1000,
                  useNativeDriver: true,
                }),
              ]),

              // Individual blobs with movement - staggered appearance
              Animated.sequence([
                Animated.delay(300),
                Animated.stagger(150, [
                  // Blob 1 - moves up-right
                  Animated.parallel([
                    Animated.timing(blob1Scale, {
                      toValue: 1,
                      duration: 600,
                      useNativeDriver: true,
                    }),
                    Animated.sequence([
                      Animated.timing(blob1Opacity, {
                        toValue: 0.7,
                        duration: 200,
                        useNativeDriver: true,
                      }),
                      Animated.delay(2200),
                      Animated.timing(blob1Opacity, {
                        toValue: 0,
                        duration: 800,
                        useNativeDriver: true,
                      }),
                    ]),
                    Animated.timing(blob1X, {
                      toValue: 40,
                      duration: 2800,
                      useNativeDriver: true,
                    }),
                    Animated.timing(blob1Y, {
                      toValue: -30,
                      duration: 2800,
                      useNativeDriver: true,
                    }),
                  ]),

                  // Blob 2 - moves left-down
                  Animated.parallel([
                    Animated.timing(blob2Scale, {
                      toValue: 1,
                      duration: 700,
                      useNativeDriver: true,
                    }),
                    Animated.sequence([
                      Animated.timing(blob2Opacity, {
                        toValue: 0.6,
                        duration: 200,
                        useNativeDriver: true,
                      }),
                      Animated.delay(2200),
                      Animated.timing(blob2Opacity, {
                        toValue: 0,
                        duration: 800,
                        useNativeDriver: true,
                      }),
                    ]),
                    Animated.timing(blob2X, {
                      toValue: -50,
                      duration: 2800,
                      useNativeDriver: true,
                    }),
                    Animated.timing(blob2Y, {
                      toValue: 35,
                      duration: 2800,
                      useNativeDriver: true,
                    }),
                  ]),

                  // Blob 3 - moves right-down
                  Animated.parallel([
                    Animated.timing(blob3Scale, {
                      toValue: 1,
                      duration: 650,
                      useNativeDriver: true,
                    }),
                    Animated.sequence([
                      Animated.timing(blob3Opacity, {
                        toValue: 0.5,
                        duration: 200,
                        useNativeDriver: true,
                      }),
                      Animated.delay(2200),
                      Animated.timing(blob3Opacity, {
                        toValue: 0,
                        duration: 800,
                        useNativeDriver: true,
                      }),
                    ]),
                    Animated.timing(blob3X, {
                      toValue: 60,
                      duration: 2800,
                      useNativeDriver: true,
                    }),
                    Animated.timing(blob3Y, {
                      toValue: 45,
                      duration: 2800,
                      useNativeDriver: true,
                    }),
                  ]),

                  // Blob 4 - moves up-left
                  Animated.parallel([
                    Animated.timing(blob4Scale, {
                      toValue: 1,
                      duration: 750,
                      useNativeDriver: true,
                    }),
                    Animated.sequence([
                      Animated.timing(blob4Opacity, {
                        toValue: 0.6,
                        duration: 200,
                        useNativeDriver: true,
                      }),
                      Animated.delay(2200),
                      Animated.timing(blob4Opacity, {
                        toValue: 0,
                        duration: 800,
                        useNativeDriver: true,
                      }),
                    ]),
                    Animated.timing(blob4X, {
                      toValue: -35,
                      duration: 2800,
                      useNativeDriver: true,
                    }),
                    Animated.timing(blob4Y, {
                      toValue: -40,
                      duration: 2800,
                      useNativeDriver: true,
                    }),
                  ]),
                ]),
              ]),
            ]),
          ]),
        ]),

        // Hold final state briefly before loop
        Animated.delay(800),
      ]),
    );

    // Slower rotation for color dispersion
    const rotationAnimation = Animated.loop(
      Animated.timing(colorRotation, {
        toValue: 1,
        duration: 12000,
        useNativeDriver: true,
      }),
    );

    mainAnimation.start();
    rotationAnimation.start();
  };

  if (!visible) return null;

  const rotationInterpolate = colorRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {/* Dye drop */}
      <Animated.View
        style={[
          styles.dyeDrop,
          {
            transform: [{translateY: dropY}, {scale: dropScale}],
            opacity: dropOpacity,
          },
        ]}>
        <View style={styles.dropGradient} />
      </Animated.View>

      {/* Single ripple effect */}
      <Animated.View
        style={[
          styles.ripple,
          {
            transform: [{scale: rippleScale}],
            opacity: rippleOpacity,
          },
        ]}
      />

      {/* Enhanced color dispersion effect */}
      <Animated.View
        style={[
          styles.colorDispersion,
          {
            transform: [{scale: colorSpread}, {rotate: rotationInterpolate}],
            opacity: colorOpacity,
          },
        ]}>
        <View style={[styles.colorBlob, styles.colorBlob1]} />
        <View style={[styles.colorBlob, styles.colorBlob2]} />
        <View style={[styles.colorBlob, styles.colorBlob3]} />
        <View style={[styles.colorBlob, styles.colorBlob4]} />
        <View style={[styles.colorBlob, styles.colorBlob5]} />
      </Animated.View>

      {/* Individual moving color blobs */}
      <Animated.View
        style={[
          styles.floatingBlob,
          styles.floatingBlob1,
          {
            transform: [
              {scale: blob1Scale},
              {translateX: blob1X},
              {translateY: blob1Y},
            ],
            opacity: blob1Opacity,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.floatingBlob,
          styles.floatingBlob2,
          {
            transform: [
              {scale: blob2Scale},
              {translateX: blob2X},
              {translateY: blob2Y},
            ],
            opacity: blob2Opacity,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.floatingBlob,
          styles.floatingBlob3,
          {
            transform: [
              {scale: blob3Scale},
              {translateX: blob3X},
              {translateY: blob3Y},
            ],
            opacity: blob3Opacity,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.floatingBlob,
          styles.floatingBlob4,
          {
            transform: [
              {scale: blob4Scale},
              {translateX: blob4X},
              {translateY: blob4Y},
            ],
            opacity: blob4Opacity,
          },
        ]}
      />

      {/* Loading text */}
      <Text style={styles.loadingText}>Please wait...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  dyeDrop: {
    position: 'absolute',
    width: 24,
    height: 32,
    top: '40%',
  },
  dropGradient: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E74C3C',
    borderRadius: 20,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    shadowColor: '#E74C3C',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  ripple: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#3498DB',
    borderRadius: 150,
    top: '50%',
    left: '50%',
    marginTop: -75,
    marginLeft: -75,
    width: 150,
    height: 150,
  },
  colorDispersion: {
    position: 'absolute',
    width: 200,
    height: 200,
    top: '50%',
    left: '50%',
    marginTop: -100,
    marginLeft: -100,
  },
  colorBlob: {
    position: 'absolute',
    borderRadius: 25,
  },
  colorBlob1: {
    width: 35,
    height: 50,
    backgroundColor: '#E74C3C',
    top: 30,
    left: 85,
    transform: [{rotate: '15deg'}],
  },
  colorBlob2: {
    width: 45,
    height: 30,
    backgroundColor: '#3498DB',
    top: 85,
    left: 40,
    transform: [{rotate: '-20deg'}],
  },
  colorBlob3: {
    width: 30,
    height: 40,
    backgroundColor: '#F39C12',
    top: 110,
    left: 130,
    transform: [{rotate: '45deg'}],
  },
  colorBlob4: {
    width: 40,
    height: 35,
    backgroundColor: '#9B59B6',
    top: 60,
    left: 135,
    transform: [{rotate: '-35deg'}],
  },
  colorBlob5: {
    width: 25,
    height: 35,
    backgroundColor: '#1ABC9C',
    top: 45,
    left: 20,
    transform: [{rotate: '60deg'}],
  },
  floatingBlob: {
    position: 'absolute',
    borderRadius: 20,
    top: '50%',
    left: '50%',
    marginTop: -15,
    marginLeft: -15,
  },
  floatingBlob1: {
    width: 30,
    height: 30,
    backgroundColor: '#E67E22',
  },
  floatingBlob2: {
    width: 25,
    height: 25,
    backgroundColor: '#1ABC9C',
  },
  floatingBlob3: {
    width: 35,
    height: 35,
    backgroundColor: '#8E44AD',
  },
  floatingBlob4: {
    width: 28,
    height: 28,
    backgroundColor: '#E91E63',
  },
  loadingText: {
    position: 'absolute',
    bottom: '25%',
    fontSize: 18,
    color: '#2C3E50',
    fontWeight: '600',
    letterSpacing: 1,
  },
});

export default DyeDropLoader;
