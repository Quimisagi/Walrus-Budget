import React, { useRef, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { GestureHandlerRootView, Gesture, GestureDetector } from 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons';
import { useGlobal } from './globalProvider';

import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  runOnJS,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TRANSLATE_X_THRESHOLD = SCREEN_WIDTH * 0.3;

const SwipeableItem = ({ children, height, onDelete }) => {
  const { isSwiping, setIsSwiping } = useGlobal();
  const translateX = useSharedValue(0);
  const itemHeight = useSharedValue(0);

  const itemRef = useRef();
  const [heightReady, setHeightReady] = useState(false);

  const onLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    itemHeight.value = height;
    setHeightReady(true);
  };

  const pan = Gesture.Pan()
    .minDistance(5)
    .onUpdate((event) => {
      translateX.value = Math.min(0, event.translationX);
      if(event.translationX > -TRANSLATE_X_THRESHOLD * 0.1 && !isSwiping) {
        runOnJS(setIsSwiping)(true);
      }
    })
    .onEnd((event) => {
      runOnJS(setIsSwiping)(false);
      if (event.translationX < -TRANSLATE_X_THRESHOLD) {
        translateX.value = withTiming(-SCREEN_WIDTH);
        itemHeight.value = withTiming(0, undefined, (isFinished) => {
          if (isFinished) {
            runOnJS(onDelete)();
          }
        });
      } else {
        translateX.value = withTiming(0);
      }
    });

  const rStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const rIconStyle = useAnimatedStyle(() => ({
    opacity: withTiming(Math.abs(translateX.value) > TRANSLATE_X_THRESHOLD ? 1 : 0),
  }));

  const rHeightStyle = useAnimatedStyle(() => ({
    height: withTiming(itemHeight.value),
  }));

  return (
    <GestureHandlerRootView>
      <Animated.View style={rHeightStyle}>
        <Animated.View style={[styles.deleteButton, rIconStyle]}>
          <FontAwesome name="trash-o" size={24} color="red" />
        </Animated.View>
        <GestureDetector gesture={pan}>
          <Animated.View style={rStyle}>
            {children}
          </Animated.View>
        </GestureDetector>
      </Animated.View>
      {!heightReady ? (
        <View style={styles.transparent} onLayout={onLayout} ref={itemRef}>
          {children}
        </View>
      ) : null}
    </GestureHandlerRootView>
  );
};

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
