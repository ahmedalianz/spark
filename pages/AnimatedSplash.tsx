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

const { width, height } = Dimensions.get("window");

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

      // Fourth: Fade in text after logo animation starts
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
      <StatusBar barStyle="light-content" backgroundColor="#023c69" />

      <LinearGradient
        colors={["#023c69", "#1e3a8a", "#3b82f6"]}
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
                source={require("@/assets/images/splash.webp")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          </Animated.View>

          {/* Animated App Name */}
          <Animated.View
            style={[styles.textContainer, { opacity: textFadeAnim }]}
          >
            <Text style={styles.appName}>Spark</Text>
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
            {Array.from({ length: 6 }).map((_, index) => (
              <FloatingParticle key={index} delay={index * 200} />
            ))}
          </View>
        </Animated.View>
      </LinearGradient>
    </View>
  );
};

// Floating particle component
const FloatingParticle: React.FC<{ delay: number }> = ({ delay }) => {
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
          left: Math.random() * width,
          top: height * 0.7 + Math.random() * 100,
        },
      ]}
    />
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
    width: 200,
    height: 200,
    transform: [{ translateY: 60 }],
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 60,
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
    color: Colors.transparentWhite80,
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
  particle: {
    position: "absolute",
    width: 4,
    height: 4,
    backgroundColor: Colors.white,
    borderRadius: 2,
  },
});

export default AnimatedSplash;
