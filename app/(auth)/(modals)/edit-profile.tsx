import EditProfile from "@/pages/EditProfile";
import { useLocalSearchParams } from "expo-router";
import React from "react";
export type EditProfileProps = {
  biostring: string;
  linkstring: string;
  imageUrl: string;
};
const EditProfilePage = () => {
  const { biostring, linkstring, imageUrl } =
    useLocalSearchParams<EditProfileProps>();

  return <EditProfile {...{ biostring, linkstring, imageUrl }} />;
};

export default EditProfilePage;
