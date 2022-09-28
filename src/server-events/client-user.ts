import _ from 'lodash';
import * as UserService from '../services/user.service';
import { EventTypes } from './event-types';
import { ObjectId } from 'mongodb';
import { GameService } from '../services';

class ClientUser {
    private sockets: any;
    private userId: any;
    private gameService: GameService;

    constructor(userId: ObjectId, gameService: GameService) {
        this.sockets = [] as any;
        this.userId = [] as any;
        this.userId = userId;
        this.gameService = gameService;
        // UserService.getOne(userId).then((data: any) => (this.userData = data));
        this.onDisconnect = this.onDisconnect.bind(this);
    }

    async createNewSessionGame(socketId: any) {
        let sessionId = await this.gameService.createGameSessionWithUserLogin(
            this.userId,
        );
        this.sockets[socketId].emit(
            EventTypes.RECEIVE_NEW_GAME_SESSION,
            sessionId,
        );
    }

    registerSocket(socket: any) {
        this.sockets[socket.id] = socket;
        socket.on(EventTypes.DISCONNECT, (reason: any) =>
            this.onDisconnect(socket, reason),
        );
    }

    notifyClient(data: any) {
        console.log('Notify', data);
        Object.keys(this.sockets).map((key: any, index: any) => {
            this.sockets[key].emit(EventTypes.NOTIFY, data);
        });
    }

    onDisconnect(socket: any, reason: any) {
        console.log('Disconnect from: ', socket.id);
        console.log('reason: ', reason);
        // console.log('User data: ', this.userData.username);

        delete this.sockets[socket.id];
    }
}

export default ClientUser;
