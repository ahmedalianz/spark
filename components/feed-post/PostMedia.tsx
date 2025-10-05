import { PostMediaProps } from "@/types";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const PostMedia: React.FC<PostMediaProps> = ({
  mediaFiles,
  likeCount,
  commentCount,
  colors,
}) => {
  if (!mediaFiles || mediaFiles.length === 0) return null;
  const imageCount = mediaFiles.length;

  if (imageCount === 1) {
    return (
      <Link
        href={`/(auth)/(modals)/image-gallery?images=${encodeURIComponent(JSON.stringify(mediaFiles))}&initialIndex=0&likeCount=${likeCount}&commentCount=${commentCount}`}
        asChild
      >
        <TouchableOpacity
          style={[
            styles.singleImageContainer,
            { backgroundColor: colors.borderLighter },
          ]}
        >
          <Image
            source={{ uri: mediaFiles[0] }}
            style={styles.singleImage}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </Link>
    );
  }

  // Two images - side by side
  if (imageCount === 2) {
    return (
      <View style={styles.twoImagesContainer}>
        {mediaFiles.map((imageUrl, index) => (
          <Link
            href={`/(auth)/(modals)/image-gallery?images=${encodeURIComponent(JSON.stringify(mediaFiles))}&initialIndex=${index}&likeCount=${likeCount}&commentCount=${commentCount}`}
            key={index}
            asChild
          >
            <TouchableOpacity
              style={[
                styles.halfImage,
                { backgroundColor: colors.borderLighter },
              ]}
            >
              <Image
                source={{ uri: imageUrl }}
                style={styles.image}
                resizeMode="cover"
              />
            </TouchableOpacity>
          </Link>
        ))}
      </View>
    );
  }

  if (imageCount === 3) {
    return (
      <View style={styles.threeImagesContainer}>
        <Link
          href={`/(auth)/(modals)/image-gallery?images=${encodeURIComponent(JSON.stringify(mediaFiles))}&initialIndex=0&likeCount=${likeCount}&commentCount=${commentCount}`}
          asChild
        >
          <TouchableOpacity
            style={[
              styles.largeImage,
              { backgroundColor: colors.borderLighter },
            ]}
          >
            <Image
              source={{ uri: mediaFiles[0] }}
              style={styles.image}
              resizeMode="cover"
            />
          </TouchableOpacity>
        </Link>
        <View style={styles.rightColumn}>
          {mediaFiles.slice(1, 3).map((imageUrl, index) => (
            <Link
              href={`/(auth)/(modals)/image-gallery?images=${encodeURIComponent(JSON.stringify(mediaFiles))}&initialIndex=${index + 1}&likeCount=${likeCount}&commentCount=${commentCount}`}
              key={index}
              asChild
            >
              <TouchableOpacity
                style={[
                  styles.smallImage,
                  { backgroundColor: colors.borderLighter },
                ]}
              >
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.image}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            </Link>
          ))}
        </View>
      </View>
    );
  }

  // Four or more images - 2x2 grid with overlay on last image
  return (
    <View style={styles.gridContainer}>
      {mediaFiles.slice(0, 4).map((imageUrl, index) => {
        const isLastImage = index === 3;
        const remainingCount = imageCount - 4;

        return (
          <Link
            href={`/(auth)/(modals)/image-gallery?images=${encodeURIComponent(JSON.stringify(mediaFiles))}&initialIndex=${index}&likeCount=${likeCount}&commentCount=${commentCount}`}
            key={index}
            asChild
          >
            <TouchableOpacity
              style={[
                styles.gridImage,
                { backgroundColor: colors.borderLighter },
              ]}
              key={index}
            >
              <Image
                source={{ uri: imageUrl }}
                style={styles.image}
                resizeMode="cover"
              />
              {isLastImage && remainingCount > 0 && (
                <View style={styles.overlayContainer}>
                  <LinearGradient
                    colors={[
                      colors.transparentBlack30,
                      colors.transparentBlack70,
                    ]}
                    style={styles.overlay}
                  >
                    <Text style={[styles.overlayText, { color: colors.white }]}>
                      +{remainingCount}
                    </Text>
                  </LinearGradient>
                </View>
              )}
            </TouchableOpacity>
          </Link>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  singleImageContainer: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
  },
  singleImage: {
    width: SCREEN_WIDTH * 0.8,
    height: 300,
  },

  // Two Images
  twoImagesContainer: {
    flexDirection: "row",
    gap: 4,
    height: 240,
  },
  halfImage: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
  },

  // Three Images
  threeImagesContainer: {
    flexDirection: "row",
    gap: 4,
    height: 280,
  },
  largeImage: {
    flex: 2,
    borderRadius: 12,
    overflow: "hidden",
  },
  rightColumn: {
    flex: 1,
    gap: 4,
  },
  smallImage: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
  },

  // Four or More Images (Grid)
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    height: 320,
  },
  gridImage: {
    width: SCREEN_WIDTH * 0.39,
    height: "49.5%",
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },

  // Overlay for +N
  overlayContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlayText: {
    fontSize: 32,
    fontWeight: "700",
    fontFamily: "DMSans_700Bold",
  },
});

export default PostMedia;
