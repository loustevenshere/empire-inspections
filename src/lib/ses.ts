import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

type SesLike = {
  send: (command: SendEmailCommand) => Promise<unknown>;
};

export function createSesClient(): SesLike {
  const { AWS_REGION, AWS_SES_SENDER, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env;
  const haveCreds = AWS_REGION && AWS_SES_SENDER && AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY;
  if (!haveCreds) {
    return {
      send: async (command: SendEmailCommand) => {
        console.log("[SES MOCK] SendEmail:", command.input);
        return Promise.resolve({ ok: true });
      },
    };
  }
  const client = new SESClient({ region: AWS_REGION });
  return {
    send: (command: SendEmailCommand) => client.send(command),
  };
}

export { SendEmailCommand };

