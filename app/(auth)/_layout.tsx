import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { Platform, Text, TouchableOpacity } from "react-native";

const Layout = () => {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: "white" },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="(modals)/create-thread"
        options={{
          presentation: "modal",
          headerRight: () => (
            <TouchableOpacity>
              <Ionicons
                name="ellipsis-horizontal-circle"
                size={24}
                color="#000"
              />
            </TouchableOpacity>
          ),
          gestureEnabled: true,
          gestureDirection: "vertical",
          ...Platform.select({
            ios: {
              animationDuration: 200,
            },
            android: {
              animation: "slide_from_bottom",
              animationDuration: 100,
              // Android-specific configs:
              cardOverlayEnabled: true,
              cardShadowEnabled: true,
            },
          }),
        }}
      />
      <Stack.Screen
        name="(modals)/edit-profile"
        options={{
          presentation: "modal",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.dismiss()}>
              <Text>Cancel</Text>
            </TouchableOpacity>
          ),
          headerShown: false,
          gestureEnabled: true,
          gestureDirection: "vertical",
          ...Platform.select({
            ios: {
              animationDuration: 200,
            },
            android: {
              animation: "slide_from_bottom",
              animationDuration: 100,
              // Android-specific configs:
              cardOverlayEnabled: true,
              cardShadowEnabled: true,
            },
          }),
        }}
      />
      <Stack.Screen
        name="(modals)/reply/[id]"
        options={{
          presentation: "modal",
          title: "Reply",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.dismiss()}>
              <Text>Cancel</Text>
            </TouchableOpacity>
          ),
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
          headerRight: () => (
            <TouchableOpacity>
              <Ionicons
                name="ellipsis-horizontal-circle"
                size={24}
                color="white"
              />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
};
export default Layout;
