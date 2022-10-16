import Scene from './Scene';
import Runner from './Runner';

main();

async function main() {
  const canvas = document.getElementById('glCanvas') as HTMLCanvasElement;
  const gl = canvas.getContext('webgl')!;

  const sceneFromFile = await Scene.createFromFile(gl, '/scenes/deformation.json');

  const runner = new Runner(canvas, sceneFromFile);

  runner.run();
}
