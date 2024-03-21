import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class JwtExpiredFilter implements ExceptionFilter {

    catch(exception: HttpException, host: ArgumentsHost) {
        console.log("catch ?")
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();
        let message = 'Une erreur est survenue';
        if (exception.message === 'jwt expired') {
            message = 'Votre session a expiré. Veuillez vous reconnecter.';
            console.log(message)


        } else if (exception.message === 'Unauthorized, user not found') {
            message = 'Vous n\'êtes pas autorisé à accéder à cette ressource.';
            console.log(message)

        }
        response
            .status(status)
            .json({
                statusCode: status,
                timestamp: new Date().toISOString(),
                path: request.url,
                message: message,
            });
    }
}
