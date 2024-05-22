export interface AppConfig {
  timezone: string;
  port: number;
}

export function appConfig(): AppConfig {
  return {
    timezone: process.env.TIMEZONE || 'Asia/Jakarta',
    port: Number(process.env.PORT) || 3000,
  };
}
