import _ from 'lodash';
import { EventTypes } from './event-types';
import { ObjectId } from 'mongodb';
import { GameService, TransactionService } from '../services';
import { ClubDayService, UserService } from '../services';

import levels from '../game/levels.json';
import { generateGameField } from '../game/game-logic';
import { LevelInfo } from '../models/game_session.modal';
import { Socket } from 'socket.io';
import { ConnectedUser, CustomSocket } from '.';
import { UserDocument, USER_ROLES } from '../models/user.model';
import mongoose, { Types } from 'mongoose';
import { SYSTEM_ACCOUNT_ID } from '../config';
const INIT_LEVEL = 0;

export interface SocketInfo {
    socket: CustomSocket;
    socketId: string;
    sessionId: string;
    levelQuiz: number;
    scoreQuiz: number;
    isQuizStart: boolean;
    isQuizTrue: boolean;
    questionTime: number;
    quizTimeout: ReturnType<typeof setTimeout>;
}

type SocketMapType = {
    [socketId: string]: SocketInfo;
};

class ClientUser {
    private sockets: SocketMapType;
    private userId: any;
    private gameService: GameService;
    private clubDayService: ClubDayService;
    private MathQuizRanking: UserDocument[];
    private userService: UserService;
    private userData: UserDocument;
    private transactionService: TransactionService;

    constructor(
        userId: string,
        gameService: GameService,
        clubDayService: ClubDayService,
        userService: UserService,
        transactionService: TransactionService,
    ) {
        this.sockets = [] as any;
        this.userId = [] as any;
        this.userId = userId;
        this.gameService = gameService;
        this.clubDayService = clubDayService;
        this.MathQuizRanking = [];
        this.userService = userService;
        this.transactionService = transactionService;
        const userIdCast = new mongoose.Types.ObjectId(userId);
        this.userService
            .findById(userIdCast)
            .then((user) => (this.userData = user));
        // thisUserService(userId).then((data: any) => (this.userData = data));
        this.onDisconnect = this.onDisconnect.bind(this);
    }

    async SyncMathQuizRanking(
        socket: CustomSocket,
        mathQuizRanking: UserDocument[],
    ) {
        const MathQuizRanking = await this.gameService.findTopRanking();
        if (MathQuizRanking === mathQuizRanking) return;
        this.MathQuizRanking = MathQuizRanking;
        socket.emit(EventTypes.MATH_QUIZ_RANKING, MathQuizRanking);
    }

    //#region game flip
    async createNewSessionGame(socketId: any) {
        let newSession = await this.gameService.createGameSessionWithUserLogin(
            this.userId,
        );
        this.sockets[socketId].sessionId = newSession._id;
        this.sockets[socketId].socket.emit(
            EventTypes.RECEIVE_NEW_GAME_SESSION,
            newSession,
        );
        this.sockets[socketId].socket.emit(EventTypes.NOTIFY, {
            type: 'success',
            message: 'Start game success',
        });
    }

    async onClickCell(socketId: any, cellId: any) {
        let gameSession = await this.gameService.getSessionById(
            this.sockets[socketId].sessionId,
        );

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

        if (_.includes(gameSession.chooseFields, cellId)) return;

        gameSession.chooseFields.push(cellId);

        if (
            gameSession.chooseFields.length ===
            gameSession.levelInfo.hiddenCells.length
        ) {
            let newLevelGame = await this.gameService.nextLevel(
                this.userId,
                gameSession,
            );
            this.sockets[socketId].socket.emit(
                EventTypes.NEXT_LEVEL_GAME,
                newLevelGame,
            );
            if (gameSession.level === 21)
                try {
                    await this.clubDayService.verifyGame(gameSession.userId);
                    this.sockets[socketId].socket.emit(EventTypes.NOTIFY, {
                        type: 'success',
                        message:
                            'You have pass first 20 level and claim reward from Club Day',
                    });
                } catch (err) {}
        } else {
            gameSession.save();
        }
    }
    //#endregion

    //#region

    getRandomInt(min: number, max: number) {
        return _.random(min, max);
    }

    async startQuiz(socketId: any) {
        this.sockets[socketId].levelQuiz = 1;
        this.sockets[socketId].scoreQuiz = 0;
        this.sockets[socketId].isQuizStart = true;
        let num1 = this.getRandomInt(1, 10);
        let num2 = this.getRandomInt(1, 10);
        let operation = _.sample([true, false]);
        let fake = _.sample([true, false]);
        this.sockets[socketId].isQuizTrue = !fake;

        let fakeAnwser = operation ? num1 + num2 : num1 - num2;
        if (fake) {
            while (fakeAnwser === (operation ? num1 + num2 : num1 - num2))
                fakeAnwser = fakeAnwser + this.getRandomInt(-10, 10);
        }

        this.sockets[socketId].socket.emit(EventTypes.RECEIVE_QUESTION_QUIZ, {
            level: 1,
            question: `${num1} ${
                operation ? '+' : '-'
            } ${num2} = ${fakeAnwser}`,
            score: 0,
            questionTime: this.calQuestionTimeWithLevel(
                this.sockets[socketId].levelQuiz,
            ),
        });

        this.sockets[socketId].socket.emit(EventTypes.NOTIFY, {
            type: 'success',
            message: 'Start quiz success',
        });
    }

    calMinRangeWithLevel = (level: number) => {
        if (level < 10) {
            return 1;
        }
        if (level < 20) {
            return 10;
        }
        if (level < 30) {
            return 10;
        }
        if (level < 40) {
            return 10;
        }
        return 20;
    };
    calMaxRangeWithLevel = (level: number) => {
        if (level < 10) {
            return 10;
        }
        if (level < 20) {
            return 30;
        }
        if (level < 30) {
            return 50;
        }
        if (level < 40) {
            return 80;
        }
        return 100;
    };

    calQuestionTimeWithLevel = (level: number) => {
        if (level < 10) {
            return 3000;
        }
        if (level < 20) {
            return 2500;
        }
        if (level < 30) {
            return 2000;
        }
        if (level < 40) {
            return 2000;
        }
        return 2000;
    };

    async answerQuiz(socketId: any, answer: any, connectedUser: ConnectedUser) {
        if (answer !== this.sockets[socketId].isQuizTrue) {
            this.sockets[socketId].socket.emit(EventTypes.END_QUIZ);
            this.sockets[socketId].isQuizStart = false;
            await this.transactionService
                .createNewTransactionGame(
                    SYSTEM_ACCOUNT_ID,
                    new Types.ObjectId(this.userId),
                    this.sockets[socketId].scoreQuiz / 10,
                    `You got ${
                        this.sockets[socketId].scoreQuiz / 10
                    }Gcoin from the GDSC Math Quiz`,
                )
                .then(() => {
                    Object.keys(connectedUser).map(
                        (userKey: any, index: any) => {
                            Object.keys(connectedUser[userKey].sockets).map(
                                (key: any, index: any) => {
                                    this.SyncMathQuizRanking(
                                        connectedUser[userKey].sockets[key]
                                            .socket,
                                        connectedUser[userKey].MathQuizRanking,
                                    );
                                },
                            );
                        },
                    );
                });
            this.sockets[socketId].scoreQuiz = 0;
        }
        if (!this.sockets[socketId].isQuizStart) return;

        this.sockets[socketId].levelQuiz = this.sockets[socketId].levelQuiz + 1;
        this.sockets[socketId].scoreQuiz =
            this.sockets[socketId].scoreQuiz + 10;
        let num1 = this.getRandomInt(
            this.calMinRangeWithLevel(this.sockets[socketId].levelQuiz),
            this.calMaxRangeWithLevel(this.sockets[socketId].levelQuiz),
        );
        let num2 = this.getRandomInt(
            this.calMinRangeWithLevel(this.sockets[socketId].levelQuiz),
            this.calMaxRangeWithLevel(this.sockets[socketId].levelQuiz),
        );
        let operation = _.sample([true, false]);
        let fake = _.sample([true, false]);
        this.sockets[socketId].isQuizTrue = !fake;

        let fakeAnwser = operation ? num1 + num2 : num1 - num2;
        if (fake) {
            while (fakeAnwser === (operation ? num1 + num2 : num1 - num2))
                fakeAnwser = fakeAnwser + this.getRandomInt(-10, 10);
        }

        this.sockets[socketId].socket.emit(EventTypes.RECEIVE_QUESTION_QUIZ, {
            level: this.sockets[socketId].levelQuiz,
            question: `${num1} ${
                operation ? '+' : '-'
            } ${num2} = ${fakeAnwser}`,
            score: this.sockets[socketId].scoreQuiz,
            questionTime: this.calQuestionTimeWithLevel(
                this.sockets[socketId].levelQuiz,
            ),
        });
    }

    async endQuizTimeout(socketId: any, connectedUser: ConnectedUser) {
        if (!this.sockets[socketId].isQuizStart) {
            return;
        }
        clearTimeout(this.sockets[socketId].quizTimeout);
        this.sockets[socketId].socket.emit(EventTypes.END_QUIZ);
        this.sockets[socketId].isQuizStart = false;
        await this.transactionService
            .createNewTransactionGame(
                SYSTEM_ACCOUNT_ID,
                new Types.ObjectId(this.userId),
                this.sockets[socketId].scoreQuiz / 10,
                `You got ${
                    this.sockets[socketId].scoreQuiz / 10
                }Gcoin from the GDSC Math Quiz`,
            )
            .then(() => {
                Object.keys(connectedUser).map((userKey: any, index: any) => {
                    Object.keys(connectedUser[userKey].sockets).map(
                        (key: any, index: any) => {
                            this.SyncMathQuizRanking(
                                connectedUser[userKey].sockets[key].socket,
                                connectedUser[userKey].MathQuizRanking,
                            );
                        },
                    );
                });
            });
        // trigger
        this.sockets[socketId].scoreQuiz = 0;
    }

    //#endregion

    registerSocket(socket: CustomSocket) {
        const defaults: SocketInfo = {
            socket: socket,
            socketId: socket.id,
            sessionId: 'string',
            levelQuiz: 0,
            scoreQuiz: 0,
            isQuizStart: false,
            isQuizTrue: false,
            questionTime: 2000,
            quizTimeout: null,
        };
        this.sockets[socket.id] = { ...defaults };
        socket.on(EventTypes.DISCONNECT, (reason: any) =>
            this.onDisconnect(socket, reason),
        );
    }

    notifyClient(data: any) {
        console.log('Notify', data);
        // Object.keys(this.sockets).map((key: any, index: any) => {
        //     this.sockets[key].emit(EventTypes.NOTIFY, data);
        // });
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
