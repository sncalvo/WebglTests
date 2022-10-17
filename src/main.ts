import Scene from './Scene';
import Runner from './Runner';

main();

async function main() {
  const canvas = document.getElementById('glCanvas') as HTMLCanvasElement;
  const gl = canvas.getContext('webgl')!;

  const ext = gl.getExtension('WEBGL_depth_texture');
  if (!ext) {
    return alert('need WEBGL_depth_texture');
  }

  const sceneFromFile = await Scene.createFromFile(gl, '/scenes/test.json');

  const runner = new Runner(canvas, sceneFromFile);

  runner.run();
}
