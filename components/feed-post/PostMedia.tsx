import { PostMediaProps } from "@/types";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

const POST_MEDIA_WIDTH = 0.9;

const PostMedia: React.FC<PostMediaProps> = ({
  mediaFiles,
  likeCount,
  commentCount,
  colors,
}) => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const containerWidth = SCREEN_WIDTH * POST_MEDIA_WIDTH;

  if (!mediaFiles?.length) return null;

  const imageCount = mediaFiles.length;
  const imageIds = mediaFiles.join(",");

  // Reusable Image Component
  const PostImage = ({
    imageUrl,
    index,
    style,
  }: {
    imageUrl: string;
    index: number;
    style: any;
  }) => (
    <Link
      href={`/(auth)/(modals)/image-gallery?images=${imageIds}&initialIndex=${index}&likeCount=${likeCount}&commentCount=${commentCount}`}
      asChild
    >
      <TouchableOpacity style={style}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      </TouchableOpacity>
    </Link>
  );

  // Single Image
  if (imageCount === 1) {
    return (
      <View style={[styles.container, { width: containerWidth }]}>
        <PostImage
          imageUrl={mediaFiles[0]}
          index={0}
          style={{
            ...styles.singleImage,
            backgroundColor: colors.borderLighter,
          }}
        />
      </View>
    );
  }

  // Two Images
  if (imageCount === 2) {
    return (
      <View style={[styles.container, { width: containerWidth }]}>
        <View style={styles.twoImagesContainer}>
          {mediaFiles.map((imageUrl, index) => (
            <PostImage
              key={imageUrl}
              imageUrl={imageUrl}
              index={index}
              style={{
                ...styles.halfImage,
                backgroundColor: colors.borderLighter,
              }}
            />
          ))}
        </View>
      </View>
    );
  }

  // Three Images
  if (imageCount === 3) {
    return (
      <View style={[styles.container, { width: containerWidth }]}>
        <View style={styles.threeImagesContainer}>
          <PostImage
            imageUrl={mediaFiles[0]}
            index={0}
            style={{
              ...styles.largeImage,
              backgroundColor: colors.borderLighter,
            }}
          />
          <View style={styles.rightColumn}>
            {mediaFiles.slice(1, 3).map((imageUrl, index) => (
              <PostImage
                key={imageUrl}
                imageUrl={imageUrl}
                index={index + 1}
                style={{
                  ...styles.smallImage,
                  backgroundColor: colors.borderLighter,
                }}
              />
            ))}
          </View>
        </View>
      </View>
    );
  }

  // Four or more images
  return (
    <View style={[styles.container, { width: containerWidth }]}>
      <View style={styles.gridContainer}>
        {mediaFiles.slice(0, 4).map((imageUrl, index) => (
          <View key={imageUrl} style={styles.gridImageWrapper}>
            <PostImage
              imageUrl={imageUrl}
              index={index}
              style={{
                ...styles.gridImage,
                backgroundColor: colors.borderLighter,
              }}
            />
            {/* on last image and image count is greater than 4 */}
            {index === 3 && imageCount > 4 && (
              <View style={styles.overlayContainer}>
                <LinearGradient
                  colors={[
                    colors.transparentBlack30,
                    colors.transparentBlack70,
                  ]}
                  style={styles.overlay}
                >
                  <Text style={[styles.overlayText, { color: colors.white }]}>
                    +{imageCount - 4}
                  </Text>
                </LinearGradient>
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: "hidden",
  },
  singleImage: {
    width: "100%",
    aspectRatio: 4 / 3,
    borderRadius: 16,
    overflow: "hidden",
  },
  twoImagesContainer: {
    flexDirection: "row",
    gap: 4,
    aspectRatio: 2 / 1,
  },
  halfImage: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  threeImagesContainer: {
    flexDirection: "row",
    gap: 4,
    aspectRatio: 4 / 3,
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
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    aspectRatio: 1,
  },
  gridImageWrapper: {
    width: "48%",
    height: "48%",
    position: "relative",
  },
  gridImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
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
  },
});

export default PostMedia;
