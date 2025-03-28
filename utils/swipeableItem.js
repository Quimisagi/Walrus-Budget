import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons';
import { Dimensions } from 'react-native';
import { useRef, useState } from 'react';
import { useGlobal } from './globalProvider';

import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  runOnJS,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TRANSLATE_X_THRESHOLD = SCREEN_WIDTH * 0.2;

const SwipeableItem = ({ children, height, onDelete }) => {
  const { isSwiping, setIsSwiping } = useGlobal();
  const translateX = useSharedValue(0);
  const itemHeight = useSharedValue(0);
  const opacity = useSharedValue(1);

  const itemRef = useRef();

  const [heightReady, setHeightReady] = useState(false);

  const onLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    itemHeight.value = height;
    setHeightReady(true);
  };

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (event) => {
      // setIsSwiping(true);
    },
    onActive: (event, gestureState) => {
      translateX.value = event.translationX;
    },
    onCancel: (event) => {
      translateX.value = withTiming(0);
    },

    onEnd: (event) => {
      // setIsSwiping(false);
      if (Math.abs(event.translationX) > TRANSLATE_X_THRESHOLD) {
        translateX.value = withTiming(SCREEN_WIDTH * -1);
        itemHeight.value = withTiming(0, undefined, (isFinished) => {
          if (isFinished) {
            runOnJS(onDelete)();
          }
        }
        );
      } else {
        translateX.value = withTiming(0);
      }
    },
  });

  const rStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const rIconStyle = useAnimatedStyle(() => ({
    opacity: withTiming( Math.abs(translateX.value) > TRANSLATE_X_THRESHOLD ? 1 : 0 ),
  }));
  const rHeightStyle = useAnimatedStyle(() => ({
    height: withTiming(itemHeight.value),
  }));

  return (
    <GestureHandlerRootView>
      <Animated.View style={rHeightStyle}>
        <Animated.View style={[ styles.deleteButton, rIconStyle ]}>
          <FontAwesome name="trash-o" size={24} color="red" />
        </Animated.View>
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View
            style={rStyle}
          >
            {children}
          </Animated.View>
        </PanGestureHandler>
      </Animated.View>
      {!heightReady ? 
          (
            <View style={styles.transparent} onLayout={onLayout} ref={itemRef}>
              {children}
            </View>
          ) :
          null
      }
    </GestureHandlerRootView>
  );
}
const styles = StyleSheet.create({
  deleteButton: {
    width: 70,
    height: '100%',
    position: 'absolute',
    right: '0%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  transparent: {
    opacity: 0,
    position: 'absolute',
    top: 0,
    left: 0,
    pointerEvents: 'none',
  },
});

export default SwipeableItem;
