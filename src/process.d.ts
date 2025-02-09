declare module "process" {
  global {
    namespace NodeJS {
      interface ProcessEnv {
        NODE_ENV: string;
        DISCORD_GUILD: string;
        APPLICATION_ID: string;
        TRIAL_MODE: string;
      }
    }
  }
}
