import React from "react";
import { StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

interface ZoomableImageProps {
  uri: string;
}

export const ZoomableImage = ({ uri }: ZoomableImageProps) => {
  const scale = useSharedValue(1);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = event.scale;
    })
    .onEnd(() => {
      scale.value = withTiming(1);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <GestureDetector gesture={pinchGesture}>
      <Animated.Image
        source={{ uri }}
        style={[styles.image, animatedStyle]}
        resizeMode="cover"
      />
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 300,
    borderRadius: 12, // <-- Los bordes redondeados van aquí directo en la foto
  },
});
