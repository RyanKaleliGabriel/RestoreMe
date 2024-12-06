import { WebClient } from "@slack/web-api";
import dotenv from "dotenv";

dotenv.config();

export const sendMessageToSlack = async (message: string) => {
  const slackToken = process.env.SLACK_OAUTH_TOKEN;
  const channelID = process.env.CHANNEL_ID;
  try {
    if (!channelID) {
      throw new Error("Channel id has not been specified");
    }

    const web = new WebClient(slackToken);
    const result = await web.chat.postMessage({
      channel: channelID,
      text: message,
    });

    console.log("Message sent to slack: ", result.ts);
  } catch (error: any) {
    console.error("Error sending message to Slack:", error);
    throw error;
  }
};
