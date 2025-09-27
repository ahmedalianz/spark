import FloatingParticle from "@/components/FloatingParticle";
import { Colors } from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

interface AnimatedSplashProps {
  onFinish: () => void;
}

const AnimatedSplash: React.FC<AnimatedSplashProps> = ({ onFinish }) => {
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const textFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start the animation sequence
    const startAnimation = () => {
      // First: Fade in the container
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();

      // Second: Scale up the logo with bounce
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }).start();

      // Third: Fade in text after logo animation starts
      setTimeout(() => {
        Animated.timing(textFadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }).start();
      }, 800);

      // Finish splash screen
      setTimeout(() => {
        onFinish();
      }, 3500);
    };

    startAnimation();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3a94d8ff" />

      <LinearGradient
        colors={["#3a94d8ff", "#b8c6edff", "#042561ff"]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
          {/* Animated Logo */}
          <Animated.View
            style={[
              styles.logoContainer,
              {
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <View style={styles.logoShadow}>
              <Image
                source={require("@/assets/images/logo.webp")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          </Animated.View>

          {/* Animated App Name */}
          <Animated.View
            style={[styles.textContainer, { opacity: textFadeAnim }]}
          >
            <Text style={styles.tagline}>Connect • Share • Inspire</Text>
          </Animated.View>

          {/* Loading indicator */}
          <Animated.View
            style={[styles.loadingContainer, { opacity: textFadeAnim }]}
          >
            <View style={styles.loadingBar}>
              <Animated.View style={[styles.loadingProgress]} />
            </View>
          </Animated.View>

          {/* Floating particles */}
          <View style={styles.particlesContainer}>
            {Array.from({ length: 8 }).map((_, index) => (
              <FloatingParticle key={index} delay={index * 200} />
            ))}
          </View>
        </Animated.View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    marginBottom: 40,
  },
  logoShadow: {
    shadowColor: Colors.blackPure,
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.3,
    shadowRadius: 25,
    elevation: 20,
  },
  logo: {
    width: 250,
    height: 250,
    transform: [{ translateY: 60 }],
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  appName: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.white,
    marginBottom: 8,
    letterSpacing: 2,
    textShadowColor: Colors.transparentBlack30,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  tagline: {
    fontSize: 16,
    color: Colors.white,
    textAlign: "center",
    letterSpacing: 1,
  },
  loadingContainer: {
    width: width * 0.6,
    alignItems: "center",
  },
  loadingBar: {
    width: "100%",
    height: 4,
    backgroundColor: Colors.transparentWhite20,
    borderRadius: 2,
    overflow: "hidden",
  },
  loadingProgress: {
    flex: 1,
    height: "100%",
    backgroundColor: Colors.white,
    borderRadius: 2,
  },
  particlesContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
});

export default AnimatedSplash;
