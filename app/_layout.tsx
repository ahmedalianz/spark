import AnimatedSplash from "@/pages/AnimatedSplash";
import {
  ClerkLoaded,
  ClerkProvider,
  useAuth,
  useUser,
} from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
  useFonts,
} from "@expo-google-fonts/dm-sans";
// import * as Sentry from "@sentry/react-native";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { Redirect, Slot, SplashScreen, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";

// Sentry.init({
//   //   beforeSend(event) {
//   //   // Filter out development errors or add custom logic
//   //   if (__DEV__) return null;
//   //   return event;
//   // },
//   dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
//   attachScreenshot: true,
//   // Add environment differentiation
//   environment: __DEV__ ? "development" : "production",
//   // Enable debug only in development
//   debug: __DEV__,
//   // Add release tracking
//   // release: "your-app@" + (process.env.APP_VERSION || "1.0.0"),
//   // dist: "1", // Build number
//   // Adds more context data to events (IP address, cookies, user, etc.)
//   // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
//   sendDefaultPii: true,

//   // Configure Session Replay
//   replaysSessionSampleRate: 0.1,
//   replaysOnErrorSampleRate: 1,
//   integrations: [
//     Sentry.mobileReplayIntegration(),
//     Sentry.feedbackIntegration(),
//     Sentry.reactNativeTracingIntegration(),
//     Sentry.httpClientIntegration(),
//     Sentry.consoleLoggingIntegration(),
//   ],

//   // uncomment the line below to enable Spotlight (https://spotlightjs.com)
//   // spotlight: __DEV__,
// });

// export default Sentry.wrap(function RootLayout() {
export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });
  const [showSplash, setShowSplash] = useState(true);
  const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
    unsavedChangesWarning: false,
  });

  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded || showSplash) {
    return <AnimatedSplash onFinish={() => setShowSplash(false)} />;
  }
  return (
    <ClerkProvider
      tokenCache={tokenCache}
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <ClerkLoaded>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <RootLayoutNav />
        </ConvexProviderWithClerk>
      </ClerkLoaded>
    </ClerkProvider>
  );
  // });
}

const RootLayoutNav = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const user = useUser();
  // useEffect(() => {
  //   if (user && user.user) {
  //     Sentry.setUser({
  //       email: user.user.emailAddresses[0].emailAddress,
  //       id: user.user.id,
  //     });
  //   } else {
  //     Sentry.setUser(null);
  //   }
  // }, [user]);
  if (!isLoaded) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  const inAuthGroup = segments[0] === "(auth)";

  if (isSignedIn && !inAuthGroup) {
    return <Redirect href="/(auth)/(tabs)/feed" />;
  }

  if (!isSignedIn && inAuthGroup) {
    return <Redirect href="/(public)" />;
  }

  return <Slot />;
};
