import Pokemon from './lib/pokemon.js';
import Toggle from './lib/toggle-active.js'
import Scroll from './lib/scroll-start.js'

const typeToggle = new Toggle('[data-type]', 'on');
const pokemonToggle = new Toggle('[data-mobile]', 'on', true);
const scrollStart = new Scroll('body', '[data-scroll]')
const scrollPokemon = new Scroll('#s-pokemon', '[data-pokedex]')
const pokemon = new Pokemon(
  '[data-pokemon]',
  '[data-type]',
  '[data-search]',
  '[data-show]',
  '[data-count]',
  '[data-modal]');

pokemon.init().insertPokemon(1, 18);
typeToggle.init();
scrollStart.init();
pokemonToggle.init();
scrollPokemon.init();