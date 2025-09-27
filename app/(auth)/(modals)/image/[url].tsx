import ImageViewer from "@/components/ImageViewer";
import { ImageViewerProps } from "@/types";
import { useLocalSearchParams } from "expo-router";

const Page = () => {
  const { url, likeCount, commentCount } =
    useLocalSearchParams<ImageViewerProps>();

  return <ImageViewer {...{ url, likeCount, commentCount }} />;
};

export default Page;
