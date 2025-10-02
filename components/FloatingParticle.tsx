import { Colors } from "@/constants/Colors";
import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

const FloatingParticle: React.FC<{ delay: number; index: number }> = ({
  delay,
  index,
}) => {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0.8,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: -100,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    setTimeout(animate, delay);
  }, [delay]);

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          opacity,
          transform: [{ translateY }],
          left: index * width * 0.1,
          top: height * 0.7 + Math.random() * 100,
        },
      ]}
    />
  );
};

export default FloatingParticle;

const styles = StyleSheet.create({
  particle: {
    position: "absolute",
    width: 4,
    height: 4,
    backgroundColor: Colors.white,
    borderRadius: 2,
  },
});
