import { Colors } from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface PostMediaProps {
  mediaFiles?: string[];
  likeCount: number;
  commentCount: number;
}

const PostMedia: React.FC<PostMediaProps> = ({
  mediaFiles,
  likeCount,
  commentCount,
}) => {
  if (!mediaFiles || mediaFiles.length === 0) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.mediaContainer}
      decelerationRate="fast"
      snapToInterval={SCREEN_WIDTH * 0.8}
    >
      {mediaFiles.map((imageUrl, index) => (
        <Link
          href={`/(auth)/(modals)/image/${encodeURIComponent(imageUrl)}?&likeCount=${likeCount}&commentCount=${commentCount}`}
          key={index}
          asChild
        >
          <TouchableOpacity style={styles.mediaWrapper}>
            <Image source={{ uri: imageUrl }} style={styles.mediaImage} />
            <LinearGradient
              colors={["transparent", Colors.blackPure]}
              style={styles.mediaOverlay}
            />
          </TouchableOpacity>
        </Link>
      ))}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  mediaContainer: {
    paddingRight: 20,
    gap: 12,
  },
  mediaWrapper: {
    position: "relative",
    borderRadius: 16,
    overflow: "hidden",
  },
  mediaImage: {
    width: SCREEN_WIDTH * 0.8,
    height: 240,
    backgroundColor: Colors.borderLighter,
  },
  mediaOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
});
export default PostMedia;
