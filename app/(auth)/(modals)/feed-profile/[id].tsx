import { Id } from "@/convex/_generated/dataModel";
import Profile from "@/pages/Profile";
import { useLocalSearchParams } from "expo-router";

const Page = () => {
  const { id } = useLocalSearchParams();

  return <Profile userId={id as Id<"users">} />;
};
export default Page;
