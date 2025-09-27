import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { Platform, Text, TouchableOpacity } from "react-native";
import { StackAnimationTypes, SwipeDirectionTypes } from "react-native-screens";

const Layout = () => {
  const router = useRouter();
  const commonProps = {
    gestureEnabled: true,
    presentation: "modal" as "modal",
    gestureDirection: "vertical" as SwipeDirectionTypes,
    ...Platform.select({
      ios: {
        animationDuration: 200,
      },
      android: {
        animation: "slide_from_bottom" as StackAnimationTypes,
        animationDuration: 100,
        // Android-specific configs:
        cardOverlayEnabled: true,
        cardShadowEnabled: true,
      },
    }),
  };
  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: "white" },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="(modals)/create-post"
        options={{
          headerRight: () => (
            <TouchableOpacity>
              <Ionicons
                name="ellipsis-horizontal-circle"
                size={24}
                color="#000"
              />
            </TouchableOpacity>
          ),
          ...commonProps,
        }}
      />
      <Stack.Screen
        name="(modals)/edit-profile"
        options={{
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.dismiss()}>
              <Text>Cancel</Text>
            </TouchableOpacity>
          ),
          headerShown: false,
          ...commonProps,
        }}
      />
      <Stack.Screen
        name="(modals)/post/[postId]"
        options={{
          headerShown: false,
          ...commonProps,
        }}
      />
      <Stack.Screen
        name="(modals)/feed-profile/[id]"
        options={{
          title: "",
          headerStyle: { backgroundColor: "black" },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.dismiss()}>
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          ),
          headerShown: false,
          ...commonProps,
        }}
      />

      <Stack.Screen
        name="(modals)/image/[url]"
        options={{
          presentation: "fullScreenModal",
          title: "",
          headerStyle: { backgroundColor: "black" },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.dismiss()}>
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
};
export default Layout;
