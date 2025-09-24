import Profile from "@/components/Profile";
import { Id } from "@/convex/_generated/dataModel";
import { useLocalSearchParams } from "expo-router";

const Page = () => {
  const { id } = useLocalSearchParams();

  return <Profile userId={id as Id<"users">} />;
};
export default Page;
