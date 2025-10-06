import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { Platform, TouchableOpacity } from "react-native";
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
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="error" options={{ headerShown: false }} />
      <Stack.Screen
        name="(modals)/create-post"
        options={{
          ...commonProps,
        }}
      />
      <Stack.Screen
        name="(modals)/edit-profile"
        options={{
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
          headerShown: false,
          ...commonProps,
        }}
      />

      <Stack.Screen
        name="(modals)/image-gallery"
        options={{
          presentation: "fullScreenModal",
          headerStyle: { backgroundColor: Colors.blackPure },
          headerTitle: "",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.dismiss()}>
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="(settings)/appearance"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(settings)/notifications"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(settings)/privacy"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(settings)/security"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(settings)/blocked-users"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(settings)/feed-preferences"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(settings)/accessibility"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(settings)/help"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(settings)/about"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(settings)/data-export"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(settings)/drafts"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};
export default Layout;
