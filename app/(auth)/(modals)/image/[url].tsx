import ImageViewer from "@/components/ImageViewer";
import { useLocalSearchParams } from "expo-router";
export type ImageViewerProps = {
  url: string;
  likeCount: string;
  commentCount: string;
};
const Page = () => {
  const { url, likeCount, commentCount } =
    useLocalSearchParams<ImageViewerProps>();

  return <ImageViewer {...{ url, likeCount, commentCount }} />;
};

export default Page;
