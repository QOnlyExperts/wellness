interface ApplicationConfig {
  cors: {
    origin: string;
    credentials: boolean;
  };
}

interface Config {
  application: ApplicationConfig;
}

const config: Config = {
  application: {
    cors: {
      origin: 'https://wellness-sn8h.vercel.app/',
      credentials: true,
    },
  },
};

export default config;

