import useLogin from "@/controllers/useLogin";
import useAppTheme from "@/hooks/useAppTheme";
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

const Login = () => {
  const {
    handleFacebookLogin,
    handleGoogleLogin,
    handleGuestLogin,
    triggerError,
  } = useLogin();
  const { colors } = useAppTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Hero Image Section */}
      <View style={styles.imageContainer}>
        <Image
          style={styles.loginImage}
          source={require("@/assets/images/back.png")}
        />
        <View
          style={[
            styles.imageOverlay,
            { backgroundColor: colors.transparentBlack15 },
          ]}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={[styles.title, { color: colors.blackPure }]}>
            Welcome to Spark
          </Text>
          <Text style={[styles.subtitle, { color: colors.textTertiary }]}>
            Connect with people who share your passions and discover new
            conversations
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          {/* Facebook Button */}
          <TouchableOpacity
            style={[
              styles.loginButton,
              {
                backgroundColor: colors.white,
                borderTopColor: colors.transparentBlack04,
                borderBottomColor: colors.transparentBlack04,
                borderRightColor: colors.transparentBlack04,
              },
              styles.facebookButton,
              { borderLeftColor: colors.primary },
            ]}
            onPress={handleFacebookLogin}
            activeOpacity={0.85}
          >
            <View style={styles.loginButtonContent}>
              <View
                style={[
                  styles.iconWrapper,
                  { backgroundColor: colors.iconPrimary },
                ]}
              >
                <Image
                  source={require("@/assets/images/facebook_icon.png")}
                  style={styles.loginButtonImage}
                />
              </View>
              <View style={styles.textContainer}>
                <Text
                  style={[styles.loginButtonText, { color: colors.blackPure }]}
                >
                  Continue with Facebook
                </Text>
                <Text
                  style={[styles.buttonSubtext, { color: colors.textTertiary }]}
                >
                  Quick setup with your Facebook profile
                </Text>
              </View>
              <View style={styles.chevronContainer}>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={colors.primary}
                />
              </View>
            </View>
          </TouchableOpacity>

          {/* Google Button */}
          <TouchableOpacity
            style={[
              styles.loginButton,
              {
                backgroundColor: colors.white,
                borderTopColor: colors.transparentBlack04,
                borderBottomColor: colors.transparentBlack04,
                borderRightColor: colors.transparentBlack04,
              },
              styles.googleButton,
              { borderLeftColor: colors.primary },
            ]}
            onPress={handleGoogleLogin}
            activeOpacity={0.85}
          >
            <View style={styles.loginButtonContent}>
              <View
                style={[
                  styles.iconWrapper,
                  { backgroundColor: colors.iconPrimary },
                ]}
              >
                <Image
                  source={require("@/assets/images/google_logo.webp")}
                  style={styles.loginButtonImage}
                />
              </View>
              <View style={styles.textContainer}>
                <Text
                  style={[styles.loginButtonText, { color: colors.blackPure }]}
                >
                  Continue with Google
                </Text>
                <Text
                  style={[styles.buttonSubtext, { color: colors.textTertiary }]}
                >
                  Sign in securely with Google
                </Text>
              </View>
              <View style={styles.chevronContainer}>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={colors.primary}
                />
              </View>
            </View>
          </TouchableOpacity>

          {/* Guest Button */}
          <TouchableOpacity
            style={[
              styles.loginButton,
              {
                backgroundColor: colors.backgroundMuted,
                borderColor: colors.transparentBlack08,
              },
              styles.guestButton,
              { borderLeftColor: colors.iconSecondary },
            ]}
            onPress={handleGuestLogin}
            activeOpacity={0.85}
          >
            <View style={styles.loginButtonContent}>
              <View
                style={[
                  styles.iconWrapper,
                  styles.guestIconWrapper,
                  { backgroundColor: colors.backgroundSecondary },
                ]}
              >
                <Ionicons
                  name="eye-outline"
                  size={20}
                  color={colors.textTertiary}
                />
              </View>
              <View style={styles.textContainer}>
                <Text
                  style={[styles.loginButtonText, { color: colors.blackPure }]}
                >
                  Browse as Guest
                </Text>
                <Text
                  style={[styles.buttonSubtext, { color: colors.textTertiary }]}
                >
                  Explore without an account
                </Text>
              </View>
              <View style={styles.chevronContainer}>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={colors.textTertiary}
                />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.footerSection}>
          <TouchableOpacity
            onPress={triggerError}
            style={[
              styles.switchButton,
              { backgroundColor: colors.backgroundMuted },
            ]}
          >
            <Ionicons
              name="swap-horizontal-outline"
              size={16}
              color={colors.textTertiary}
            />
            <Text
              style={[
                styles.switchAccountButtonText,
                { color: colors.textTertiary },
              ]}
            >
              Switch Account
            </Text>
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <Text style={[styles.legalText, { color: colors.textMuted }]}>
            By continuing, you agree to our{" "}
            <Text style={[styles.linkText, { color: colors.blackPure }]}>
              Terms
            </Text>{" "}
            and{" "}
            <Text style={[styles.linkText, { color: colors.blackPure }]}>
              Privacy Policy
            </Text>
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
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
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: "DMSans_400Regular",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: "100%",
    gap: 14,
    marginBottom: 32,
  },
  loginButton: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 16,

    borderWidth: 1,
  },
  facebookButton: {
    borderLeftWidth: 1,
  },
  googleButton: {
    borderLeftWidth: 1,
  },
  guestButton: {
    borderLeftWidth: 1,
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
    alignItems: "center",
    justifyContent: "center",
  },
  guestIconWrapper: {
    // backgroundColor handled inline
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
    marginBottom: 2,
  },
  buttonSubtext: {
    fontSize: 12,
    fontFamily: "DMSans_400Regular",
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
  },
  switchAccountButtonText: {
    fontSize: 14,
    fontFamily: "DMSans_500Medium",
  },
  divider: {
    width: 40,
    height: 1,
  },
  legalText: {
    fontSize: 11,
    fontFamily: "DMSans_400Regular",
    textAlign: "center",
    lineHeight: 16,
    paddingHorizontal: 24,
  },
  linkText: {
    fontFamily: "DMSans_500Medium",
  },
});
