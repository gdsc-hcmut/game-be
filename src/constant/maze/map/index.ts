import { MazeMap } from '../../../models/round_maze_game.model';
import { Path, Wall } from './cell';

const initMapLevel1: MazeMap = {};

initMapLevel1[0] = new Wall(false);
initMapLevel1[1] = new Wall(false);
initMapLevel1[2] = new Wall(false);
initMapLevel1[3] = new Wall(false);

initMapLevel1[100] = new Wall(false);
initMapLevel1[101] = new Path(false);
initMapLevel1[102] = new Path(false);
initMapLevel1[103] = new Wall(false);

initMapLevel1[200] = new Wall(false);
initMapLevel1[201] = new Path(false);
initMapLevel1[202] = new Path(false);
initMapLevel1[203] = new Wall(false);

initMapLevel1[300] = new Wall(false);
initMapLevel1[301] = new Wall(false);
initMapLevel1[302] = new Wall(false);
initMapLevel1[303] = new Wall(false);

export default initMapLevel1;
