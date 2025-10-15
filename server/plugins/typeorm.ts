import 'reflect-metadata';
import { DataSource } from 'typeorm';

export default defineNitroPlugin(async (nitroApp) => {
    const config = useRuntimeConfig();

    const isProduction = process.env.NODE_ENV === 'production';

    const dataSource = new DataSource(
        isProduction
            ? {
                  type: 'postgres' as const,
                  host: config.db.host,
                  port: 5432,
                  username: config.db.user,
                  password: config.db.pass,
                  database: config.db.name,
                  synchronize: false,
                  entities: ['~/server/entities/**/*.ts'],
                  logging: false,
              }
            : {
                  type: 'sqlite' as const,
                  database: 'dev.db',
                  synchronize: true,
                  entities: ['~/server/entities/**/*.ts'],
                  logging: true,
              }
    );

    await dataSource.initialize();

    // Attach to H3 event context
    nitroApp.hooks.hook('request', (event) => {
        event.context.db = dataSource;
    });
});
