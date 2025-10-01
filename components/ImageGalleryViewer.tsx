import { Colors } from "@/constants/Colors";
import formatCount from "@/utils/formatCount";
import { Ionicons } from "@expo/vector-icons";
import { ImageZoom } from "@likashefqet/react-native-image-zoom";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View,
  ViewToken,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface ImageGalleryViewerProps {
  images: string;
  initialIndex: string;
  likeCount?: string;
  commentCount?: string;
}

const ImageGalleryViewer: React.FC<ImageGalleryViewerProps> = ({
  images,
  initialIndex,
  likeCount,
  commentCount,
}) => {
  const imageArray = JSON.parse(decodeURIComponent(images || "[]"));
  const startIndex = parseInt(initialIndex || "0", 10);
  const likeCountNum = parseInt(likeCount || "0", 10);
  const commentCountNum = parseInt(commentCount || "0", 10);

  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const flatListRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setCurrentIndex(viewableItems[0].index || 0);
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const renderItem = ({ item }: { item: string }) => (
    <View style={styles.imageContainer}>
      <ImageZoom
        uri={item}
        minScale={0.5}
        maxScale={5}
        doubleTapScale={2}
        isSingleTapEnabled
        isDoubleTapEnabled
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        <FlatList
          ref={flatListRef}
          data={imageArray}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={startIndex}
          getItemLayout={(_, index) => ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * index,
            index,
          })}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          bounces={false}
        />

        {/* Image Counter */}
        {imageArray.length > 1 && (
          <View style={styles.counterContainer}>
            <View style={styles.counterBadge}>
              <Text style={styles.counterText}>
                {currentIndex + 1} / {imageArray.length}
              </Text>
            </View>
          </View>
        )}

        {/* Stats Overlay */}
        <View style={styles.statsOverlay}>
          <View style={styles.statItem}>
            <Ionicons name="heart-outline" size={16} color="white" />
            <Text style={styles.statText}>{formatCount(likeCountNum)}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="chatbubble-outline" size={16} color="white" />
            <Text style={styles.statText}>{formatCount(commentCountNum)}</Text>
          </View>
        </View>

        {/* Dot Indicators (optional, for better UX) */}
        {imageArray.length > 1 && imageArray.length <= 5 && (
          <View style={styles.dotsContainer}>
            {imageArray.map((_: string, index: number) => (
              <View
                key={index}
                style={[styles.dot, currentIndex === index && styles.activeDot]}
              />
            ))}
          </View>
        )}
      </View>
    </GestureHandlerRootView>
  );
};

export default ImageGalleryViewer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  counterContainer: {
    position: "absolute",
    top: 60,
    right: 20,
  },
  counterBadge: {
    backgroundColor: Colors.transparentBlack70,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  counterText: {
    color: "white",
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "DMSans_700Bold",
  },
  statsOverlay: {
    position: "absolute",
    bottom: 80,
    left: 20,
    flexDirection: "row",
    gap: 16,
    backgroundColor: Colors.transparentBlack70,
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
    fontFamily: "DMSans_600SemiBold",
  },
  dotsContainer: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    flexDirection: "row",
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
  },
  activeDot: {
    width: 20,
    backgroundColor: "white",
  },
});
