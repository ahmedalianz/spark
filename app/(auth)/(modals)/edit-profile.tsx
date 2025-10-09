import EditProfile from "@/pages/EditProfile";
import { EditProfileProps } from "@/types";
import { useLocalSearchParams } from "expo-router";
import React from "react";

const EditProfilePage = () => {
  const { biostring, imageUrl } = useLocalSearchParams<EditProfileProps>();

  return <EditProfile {...{ biostring, imageUrl }} />;
};

export default EditProfilePage;
