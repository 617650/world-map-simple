import { select } from 'd3';
import { viz } from './viz';
import '../styles.css';

const container = select('#app').node();
const rotation = [0, 0, 0];
let state = { rotation };

const render = () => {
    viz(container, {
      state,
      setState,
    });
};

const setState = (next) => {
    state = next(state);
    render();
};
  
render();

['rotateX', 'rotateY', 'rotateZ'].forEach((id, index) => {
  document.getElementById(id).addEventListener('input', (event) => {
    rotation[index] = event.target.value;
    setState((prevState) => ({ ...prevState, rotation: [...rotation] }));
  });
});