import { api } from "@/convex/_generated/api";
import { useUserInfo } from "@/hooks/useUserInfo";
import { useMutation } from "convex/react";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});
export const usePush = () => {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [channels, setChannels] = useState<Notifications.NotificationChannel[]>(
    []
  );
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);
  const router = useRouter();
  const updateUser = useMutation(api.users.updateUser);
  const { userInfo } = useUserInfo({});

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => {
        if (token && userInfo?._id) {
          setExpoPushToken(token);
          updateUser({ pushToken: token });
        }
      })
      .catch((error: any) => console.log("error", error));
    if (Platform.OS === "android") {
      Notifications.getNotificationChannelsAsync().then((value) =>
        setChannels(value ?? [])
      );
    }
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("🚀 ~ usePush ~ notification:", notification);
        setNotification(notification);
      }
    );

    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("🚀 ~ usePush ~ response:", response);
        const postId = response.notification.request.content.data.postId;
        router.push(`/(auth)/(modals)/post/${postId}`);
      });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  function handleRegistrationError(errorMessage: string) {
    alert(errorMessage);
    throw new Error(errorMessage);
  }

  async function registerForPushNotificationsAsync() {
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "A channel is needed for the permissions prompt to appear",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        handleRegistrationError(
          "Permission not granted to get push token for push notification!"
        );
        return;
      }
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;
      if (!projectId) {
        handleRegistrationError("Project ID not found");
      }
      try {
        const pushTokenString = (
          await Notifications.getExpoPushTokenAsync({
            projectId,
          })
        ).data;
        console.log(
          "🚀 ~ registerForPushNotificationsAsync ~ pushTokenString:",
          pushTokenString
        );
        return pushTokenString;
      } catch (e: unknown) {
        handleRegistrationError(`${e}`);
      }
    } else {
      handleRegistrationError(
        "Must use physical device for push notifications"
      );
    }
  }
};
