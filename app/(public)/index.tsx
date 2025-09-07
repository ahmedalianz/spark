import { useSSO } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Index() {
  const { startSSOFlow } = useSSO();
  const handleFacebookLogin = async () => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_facebook",
      });
      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleGoogleLogin = async () => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
      });
      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleGuestLogin = () => {};
  const triggerError = () => {};

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Hero Image Section */}
      <View style={styles.imageContainer}>
        <Image
          style={styles.loginImage}
          source={require("@/assets/images/login.png")}
        />
        <View style={styles.imageOverlay} />

        {/* Floating Brand Badge */}
        <View style={styles.brandBadge}>
          <Image
            source={require("@/assets/images/threads-logo-black.png")}
            style={styles.loginButtonImage}
          />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.title}>Welcome to Threads</Text>
          <Text style={styles.subtitle}>
            Connect with people who share your passions and discover new
            conversations
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          {/* Facebook Button */}
          <TouchableOpacity
            style={[styles.loginButton, styles.facebookButton]}
            onPress={handleFacebookLogin}
            activeOpacity={0.85}
          >
            <View style={styles.loginButtonContent}>
              <View style={styles.iconWrapper}>
                <Image
                  source={require("@/assets/images/facebook_icon.png")}
                  style={styles.loginButtonImage}
                />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.loginButtonText}>
                  Continue with Facebook
                </Text>
                <Text style={styles.buttonSubtext}>
                  Quick setup with your Facebook profile
                </Text>
              </View>
              <View style={styles.chevronContainer}>
                <Ionicons name="chevron-forward" size={18} color="#1877F2" />
              </View>
            </View>
          </TouchableOpacity>

          {/* Google Button */}
          <TouchableOpacity
            style={[styles.loginButton, styles.googleButton]}
            onPress={handleGoogleLogin}
            activeOpacity={0.85}
          >
            <View style={styles.loginButtonContent}>
              <View style={styles.iconWrapper}>
                <Image
                  source={require("@/assets/images/google_logo.webp")}
                  style={styles.loginButtonImage}
                />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.loginButtonText}>Continue with Google</Text>
                <Text style={styles.buttonSubtext}>
                  Sign in securely with Google
                </Text>
              </View>
              <View style={styles.chevronContainer}>
                <Ionicons name="chevron-forward" size={18} color="#4285F4" />
              </View>
            </View>
          </TouchableOpacity>

          {/* Guest Button */}
          <TouchableOpacity
            style={[styles.loginButton, styles.guestButton]}
            onPress={handleGuestLogin}
            activeOpacity={0.85}
          >
            <View style={styles.loginButtonContent}>
              <View style={[styles.iconWrapper, styles.guestIconWrapper]}>
                <Ionicons name="eye-outline" size={20} color="#666" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.loginButtonText}>Browse as Guest</Text>
                <Text style={styles.buttonSubtext}>
                  Explore without an account
                </Text>
              </View>
              <View style={styles.chevronContainer}>
                <Ionicons name="chevron-forward" size={18} color="#666" />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.footerSection}>
          <TouchableOpacity onPress={triggerError} style={styles.switchButton}>
            <Ionicons name="swap-horizontal-outline" size={16} color="#666" />
            <Text style={styles.switchAccountButtonText}>Switch Account</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <Text style={styles.legalText}>
            By continuing, you agree to our{" "}
            <Text style={styles.linkText}>Terms</Text> and{" "}
            <Text style={styles.linkText}>Privacy Policy</Text>
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
  },

  imageContainer: {
    position: "relative",
    height: 280,
    overflow: "hidden",
  },
  loginImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.15)",
  },
  brandBadge: {
    position: "absolute",
    top: 60,
    right: 24,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  brandText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
    fontFamily: "DMSans_700Bold",
  },

  // Content Section
  scrollContainer: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },
  welcomeSection: {
    alignItems: "center",
    marginBottom: 36,
  },
  title: {
    fontSize: 28,
    fontFamily: "DMSans_700Bold",
    textAlign: "center",
    color: "#111",
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: "DMSans_400Regular",
    textAlign: "center",
    color: "#666",
    lineHeight: 22,
    paddingHorizontal: 20,
  },

  buttonContainer: {
    width: "100%",
    gap: 14,
    marginBottom: 32,
  },
  loginButton: {
    backgroundColor: "#fff",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.04)",
  },
  facebookButton: {
    borderLeftWidth: 3,
    borderLeftColor: "#1877F2",
  },
  googleButton: {
    borderLeftWidth: 3,
    borderLeftColor: "#4285F4",
  },
  guestButton: {
    backgroundColor: "#f8f9fa",
    borderLeftWidth: 3,
    borderLeftColor: "#e9ecef",
    borderColor: "rgba(0,0,0,0.08)",
  },
  loginButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#f8f9fa",
    alignItems: "center",
    justifyContent: "center",
  },
  guestIconWrapper: {
    backgroundColor: "#e9ecef",
  },
  loginButtonImage: {
    width: 22,
    height: 22,
    resizeMode: "contain",
  },
  textContainer: {
    flex: 1,
  },
  loginButtonText: {
    fontSize: 16,
    fontFamily: "DMSans_600SemiBold",
    color: "#111",
    marginBottom: 2,
  },
  buttonSubtext: {
    fontSize: 12,
    fontFamily: "DMSans_400Regular",
    color: "#888",
    lineHeight: 16,
  },
  chevronContainer: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  footerSection: {
    alignItems: "center",
    gap: 20,
  },
  switchButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#f1f3f4",
  },
  switchAccountButtonText: {
    fontSize: 14,
    fontFamily: "DMSans_500Medium",
    color: "#666",
  },
  divider: {
    width: 40,
    height: 1,
    backgroundColor: "#e1e5e9",
  },
  legalText: {
    fontSize: 11,
    fontFamily: "DMSans_400Regular",
    color: "#999",
    textAlign: "center",
    lineHeight: 16,
    paddingHorizontal: 24,
  },
  linkText: {
    color: "#111",
    fontFamily: "DMSans_500Medium",
  },
});
