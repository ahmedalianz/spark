import { v } from "convex/values";
import { internalAction } from "./_generated/server";

const EXPO_ACCESS_TOKEN = process.env.EXPO_ACCESS_TOKEN;

export const sendPushNotification = internalAction({
  args: {
    pushToken: v.string(),
    messageTitle: v.string(),
    messageBody: v.string(),
    threadId: v.optional(v.id("threads")),
  },
  handler: async ({}, { pushToken, messageTitle, messageBody, threadId }) => {
    console.log("SEND PUSH NOTIFICATION");

    const res = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${EXPO_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        to: pushToken,
        sound: "default",
        body: messageBody,
        title: messageTitle,
        data: {
          threadId,
        },
      }),
    }).then((res) => res.json());

    return res;
  },
});
