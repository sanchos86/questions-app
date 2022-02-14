import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    let allowedOrigins = [];

    try {
      const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS;
      if (ALLOWED_ORIGINS) {
        const parsedOrigins = JSON.parse(ALLOWED_ORIGINS);
        allowedOrigins = Array.isArray(parsedOrigins) ? parsedOrigins : [];
      }
    } catch (e) {
      allowedOrigins = [];
    }
    callback(null, allowedOrigins);
  },
};

export { corsOptions };
