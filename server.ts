import cors from '@fastify/cors'
import { start, on, LifecycleEvent } from '@qelos/plugin-play'
import './endpoints'


on(LifecycleEvent.appMounted, ({ app }) => {
  console.log('added cors');
  app.register(cors);
})

start({
  manifest: {
    description: 'contact form api',
    appUrl: process.env.APP_URL || 'https://0.0.0.0:2040'
  },
  config: {
    port: Number(process.env.PORT || '2040'),
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || 'demo-secret',
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || 'refresh-token-secret',
    qelosUrl: process.env.QELOS_URL || 'https://app.qelos.io/',
    qelosUsername: process.env.QELOS_USER || 'david_contact_local@qelos.io',
    qelosPassword: process.env.QELOS_PASSWORD || 'david_contact_local@qelos.io',
  },
});
