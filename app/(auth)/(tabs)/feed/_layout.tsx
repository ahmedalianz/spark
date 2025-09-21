import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";
const Layout = () => {
  return (
    <Stack
      screenOptions={{
        contentStyle: {
          backgroundColor: Colors.white,
        },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
};
export default Layout;
