import { Request as ERequest, Response as EResponse } from 'express';
import { HttpResponseComposer } from './lib/response-composer';
import { TokenDocument } from './models/token.model';

export interface Request extends ERequest {
    tokenMeta?: TokenDocument;
}

export interface Response extends EResponse {
    composer?: HttpResponseComposer;
}

export const ServiceType = {
    Auth: Symbol.for('AuthService'),
    Database: Symbol.for('DatabaseService'),
    User: Symbol.for('UserService'),
    Game: Symbol.for('GameService'),
    Socket: Symbol.for('Socket'),
    Item: Symbol.for('Item'),
    MarketplaceItem: Symbol.for('MarketplaceItem'),
};

export enum PrivacyType {
    PUBLIC = 'public',
    PROTECTED = 'protected',
    PRIVATE = 'private',
}

export enum HttpMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    PATCH = 'PATCH',
    DELETE = 'DELETE',
}
