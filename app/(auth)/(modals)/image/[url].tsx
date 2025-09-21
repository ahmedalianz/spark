import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { ImageZoom } from "@likashefqet/react-native-image-zoom";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const Page = () => {
  const { url, likeCount, commentCount } = useLocalSearchParams<{
    url: string;
    likeCount: string;
    commentCount: string;
  }>();

  const decodedUrl = decodeURIComponent(url || "");

  const likeCountNum = parseInt(likeCount || "0", 10);
  const commentCountNum = parseInt(commentCount || "0", 10);

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        <ImageZoom
          uri={decodedUrl}
          minScale={0.5}
          maxScale={5}
          doubleTapScale={2}
          isSingleTapEnabled
          isDoubleTapEnabled
          style={styles.image}
          resizeMode="contain"
        />

        <View style={styles.statsOverlay}>
          <View style={styles.statItem}>
            <Ionicons name="heart-outline" size={16} color="white" />
            <Text style={styles.statText}>{likeCountNum}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="chatbubble-outline" size={16} color="white" />
            <Text style={styles.statText}>{commentCountNum}</Text>
          </View>
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  statsOverlay: {
    position: "absolute",
    bottom: 20,
    left: 20,
    flexDirection: "row",
    gap: 16,
    backgroundColor: Colors.black70,
    padding: 12,
    borderRadius: 20,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  threadId: {
    position: "absolute",
    top: 20,
    left: 20,
    color: "white",
    backgroundColor: Colors.black70,
    padding: 8,
    borderRadius: 8,
  },
});
