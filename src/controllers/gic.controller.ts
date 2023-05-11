import { injectable, inject } from "inversify";
import { Controller } from "./controller";
import { Router } from "express";
import { ServiceType } from "../types";
import { AuthService } from "../services";

@injectable()
export class GICController extends Controller {
    public readonly router = Router();
    public readonly path = '/auth';

    constructor(
        @inject(ServiceType.Auth) private authService: AuthService,
    ) {
        super();
        
    }
}
