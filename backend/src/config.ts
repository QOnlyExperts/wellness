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
      origin: '*',
      credentials: true,
    },
  },
};

export default config;

