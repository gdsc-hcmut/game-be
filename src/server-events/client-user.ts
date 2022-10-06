import _ from 'lodash';
import * as UserService from '../services/user.service';
import { EventTypes } from './event-types';
import { ObjectId } from 'mongodb';
import { GameService } from '../services';
import levels from '../game/levels.json';
import { generateGameField } from '../game/game-logic';
import { LevelInfo } from '../models/game_session.modal';

const INIT_LEVEL = 0;

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
        let newSession = await this.gameService.createGameSessionWithUserLogin(
            this.userId,
        );
        this.sockets[socketId].sessionId = newSession._id;
        this.sockets[socketId].socket.emit(
            EventTypes.RECEIVE_NEW_GAME_SESSION,
            newSession,
        );
    }

    async onClickCell(socketId: any, cellId: any, sessionId: any) {
        let gameSession = await this.gameService.getSessionById(sessionId);
        console.log(gameSession.finishAt, 'Finish here');
        if (gameSession.finishAt || gameSession.userId != this.userId) return;

        let isCorrect = _.includes(gameSession.levelInfo.hiddenCells, cellId);

        if (!isCorrect) {
            let userBalance = await this.gameService.endSessionGame(
                gameSession._id,
            );
            this.sockets[socketId].socket.emit(
                EventTypes.END_SESSION_GAME,
                userBalance,
            );
        }

        const chooseFields = await this.gameService.ChooseField(
            gameSession,
            cellId,
        );

        if (chooseFields.length === gameSession.levelInfo.hiddenCells.length) {
            let newLevelGame = await this.gameService.nextLevel(
                this.userId,
                gameSession._id,
            );
            this.sockets[socketId].socket.emit(
                EventTypes.NEXT_LEVEL_GAME,
                newLevelGame,
            );
        }
    }

    registerSocket(socket: any) {
        this.sockets[socket.id] = { socket, sessionId: '' };
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

    async onDisconnect(socket: any, reason: any) {
        console.log('Disconnect from: ', socket.id);
        console.log('reason: ', reason);
        // console.log('User data: ', this.userData.username);
        if (this.sockets[socket.id].sessionId)
            await this.gameService.endSessionGame(
                this.sockets[socket.id].sessionId,
            );
        delete this.sockets[socket.id];
    }
}

export default ClientUser;
