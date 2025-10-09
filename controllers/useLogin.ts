import { useSSO } from "@clerk/clerk-expo";
import { router } from "expo-router";

const useLogin = () => {
  const { startSSOFlow } = useSSO();
  const handleFacebookLogin = async () => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_facebook",
      });
      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      }
    } catch (error) {
      console.error("Facebook login error:", error);
      alert("Failed to sign in with Facebook. Please try again.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
      });
      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      }
    } catch (error) {
      console.error("Google login error:", error);
      alert("Failed to sign in with Google. Please try again.");
    }
  };

  const handleCreateAccount = () => {
    router.push("/(public)/create-account");
  };

  return {
    handleFacebookLogin,
    handleGoogleLogin,
    handleCreateAccount,
  };
};

export default useLogin;
