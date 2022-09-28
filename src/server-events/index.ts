import _ from 'lodash';
import { injectable, inject } from 'inversify';

import { EventTypes } from './event-types';
// import { verifyJWTToken } from "../services/auth.service";
import ClientUser from './client-user';
import TrackingUser from './tracking-user';
import { Request, Response, ServiceType } from '../types';
import TrackingDevice from './tracking-device';
import passport from 'passport';
// import IllegalDetection from './illegal-detection';
// import PlantWatering from './plant-watering';
// import FireAlarm from './fire-alarm';
// import EntranceManagement from './entrance-management';
// import AutoLighting from './auto-lighting';
import {
    // DeviceService,
    // DeviceStatusService,
    AuthService,
    GameService,
    // MQTTService,
} from '../services';
import { JWT_SECRET } from '../config';
import { nextTick } from 'process';

// let socketIOServer = null;
// let connectedUser = [] as any;
// let tracking = new TrackingUser();

// let clientSockets: any = [];

@injectable()
export class SocketService {
    private socketIOServer: any;
    private connectedUser = [] as any;
    private tracking: TrackingUser;
    private clientSockets: any;
    private trackingDevice: TrackingDevice;

    constructor(
        // @inject(ServiceType.MQTT) private mqttService: MQTTService,
        // @inject(ServiceType.Device) private deviceService: DeviceService,
        // @inject(ServiceType.DeviceStatus)
        // private deviceStatusService: DeviceStatusService,
        @inject(ServiceType.Auth) private authService: AuthService,
        @inject(ServiceType.Game) private gameService: GameService,
    ) {
        console.log('[SOCKET IO Service] Construct');

        this.socketIOServer = null;
        this.connectedUser = [] as ClientUser[];
        this.tracking = new TrackingUser();
        this.trackingDevice = new TrackingDevice();
        this.clientSockets = [];
    }

    notifyUser = (receiveUserId: any, data: any) => {
        console.log('Noti');
        this.connectedUser.map((e: any) => {
            e.notifyClient('Hello World');
        });

        // if (_.has(connectedUser, receiveUserId)) {
        //     console.log('User receive nofti: ', receiveUserId);
        //     connectedUser[receiveUserId].notifyClient(data);
        // }
    };

    onConnection = (socket: any) => {
        console.log('New user connected');
        console.log('Has a new connection', socket.id);
        console.log('Connected User', socket.userId);
        if (!_.has(this.connectedUser, socket.userId)) {
            this.connectedUser[socket.userId] = new ClientUser(
                socket.userId,
                this.gameService,
            );
        }
        this.connectedUser[socket.userId].registerSocket(socket);

        this.tracking.addUserConnecting(socket.id, socket.userId);

        console.log('Connection Pool', this.connectedUser);

        socket.emit(EventTypes.AUTHENTICATE, { success: true });

        socket.on(EventTypes.CREATE_NEW_GAME, () =>
            this.connectedUser[socket.userId].createNewSessionGame(socket.id),
        );

        socket.on(EventTypes.DISCONNECT, () => {
            this.tracking.removeUserConnecting(socket.id);
        });
    };

    // Emit 'notify' event to all clients
    notifyUpdate = (data: any) => {
        this.trackingDevice.update(data.name, data);

        Object.keys(this.connectedUser).map((key: any, index: any) => {
            this.connectedUser[key].notifyClient(data);
        });
    };

    initialize = (socketServer: any) => {
        this.socketIOServer = socketServer;
        const wrapMiddlewareForSocketIo =
            (middleware: any) => (socket: any, next: any) =>
                middleware(socket.request, {}, next);
        this.socketIOServer.use(
            wrapMiddlewareForSocketIo(passport.initialize()),
        );
        this.socketIOServer.use((socket: any, next: any) => {
            passport.authenticate('jwt', (err, tokenMeta, info, x, y) => {
                if (err || !tokenMeta)
                    return next(new Error('Authentication error'));
                socket.userId = tokenMeta.userId;
                next();
            })(socket.request, {}, next);
        });
        this.socketIOServer.on('connection', this.onConnection);
    };
}

// export const ServerEventSystem = {
//     initialize,
//     notifyUser,
//     notifyUpdate,
//     tracking,
// };
