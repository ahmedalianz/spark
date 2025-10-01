import ImageGalleryViewer from "@/components/ImageGalleryViewer";
import { useLocalSearchParams } from "expo-router";

export default function ImageGalleryModal() {
  const params = useLocalSearchParams();

  return (
    <ImageGalleryViewer
      images={params.images as string}
      initialIndex={params.initialIndex as string}
      likeCount={params.likeCount as string}
      commentCount={params.commentCount as string}
    />
  );
}
