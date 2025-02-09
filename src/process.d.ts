declare module "process" {
  global {
    namespace NodeJS {
      interface ProcessEnv {
        NODE_ENV: string;
      }
    }
  }
}
