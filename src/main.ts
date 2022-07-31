import { NestFactory } from '@nestjs/core';
import * as firebaseAdmin from "firebase-admin";
import { FirebaseGuard } from 'src/auth/firebase-auth.guard';
import token from "src/auth/token.json";
import { Logger } from 'src/middleware/logger.middleware';
import { AppModule } from './app.module';




const config = firebaseAdmin.credential.cert({
    projectId: token.project_id,
    privateKey: token.private_key,
    clientEmail: token.client_email,
})

/**
const httpsOptions = {
    key: fs.readFileSync('certificate/privkey.pem'),
    cert: fs.readFileSync('certificate/fullchain.pem'),
};
 */

if (!firebaseAdmin.apps.length) firebaseAdmin.initializeApp({
    credential: config
});


declare const module: any;

async function bootstrap() {
    const app = await NestFactory.create(AppModule);//, { httpsOptions }
    app.enableCors();
    app.useGlobalGuards(new FirebaseGuard());
    app.use(Logger)
    await app.listen(3001);

    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }

}
bootstrap();
