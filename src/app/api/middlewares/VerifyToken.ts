import { NextFunction, Request, Response } from 'express';
import { sha512 } from 'sha512-crypt-ts';
import dotenv from 'dotenv';

dotenv.config();

/**
 * @brief Na situação atual, não há necessidade de haver mais de um token válido para cada usuário rodando na api.
 * Está API está sendo utilizada apenas por um único admin.
 *
 * @todo Adicionar JWT tokens, quando houver necessidade.
 */
export const VerifyToken = {
  execute(request: Request, response: Response, next: NextFunction) {
    try {
      const bearerHeader = request.header('Authorization');

      if (typeof bearerHeader === 'undefined') {
        throw new Error('Auth header is missing.');
      }

      const bearer = bearerHeader.split(' ');
      const bearerToken = bearer[1] || '';

      if (
        sha512.hexHmac(process.env.SECRET_KEY || '', process.env.HASH || '') !==
        bearerToken
      ) {
        throw new Error('Bearer token is not valid.');
      }

      next();
    } catch (e) {
      console.error(e);
      response.sendStatus(401);
    }
  },
};
