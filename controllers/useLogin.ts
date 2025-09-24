import { useSSO } from "@clerk/clerk-expo";

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
      console.error(error);
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
      console.error(error);
    }
  };
  const handleGuestLogin = () => {};
  const triggerError = () => {};
  return {
    handleFacebookLogin,
    handleGoogleLogin,
    handleGuestLogin,
    triggerError,
  };
};

export default useLogin;
