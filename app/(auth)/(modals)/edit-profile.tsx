import EditProfile from "@/pages/EditProfile";
import { EditProfileProps } from "@/types";
import { useLocalSearchParams } from "expo-router";
import React from "react";

const EditProfilePage = () => {
  const { biostring, linkstring, imageUrl } =
    useLocalSearchParams<EditProfileProps>();

  return <EditProfile {...{ biostring, linkstring, imageUrl }} />;
};

export default EditProfilePage;
