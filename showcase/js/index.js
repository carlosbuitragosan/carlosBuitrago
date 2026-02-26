import { fadeInDownText } from './modules/logoAnimation.js';
import { burgerMenuToggle } from './modules/burgerMenuToggle.js';
import { toggleHeaderOnScroll } from './modules/headerAnimation.js';
import {
  highlightOnHover,
  resetTransformOnIntersect,
  moveItemsToBottom,
} from './modules/skillsAnimation.js';
import { showFooter } from './modules/showFooter.js';
import { initDropdownMenu } from './modules/projectsDropdown.js';

const container = document.querySelector('.skills__container');
const gridItems = document.querySelectorAll('.skills__category');
const $logoTitle = $('.logo__title');
const $header = $('.header');
const $sentinel = $('.sentinel');
const $main = $('.main');
const $footer = $('.footer');
const $burgerMenuInput = $('.burger__menu input');

fadeInDownText($logoTitle);
moveItemsToBottom(container, gridItems);
burgerMenuToggle($burgerMenuInput);
toggleHeaderOnScroll($header);
resetTransformOnIntersect(container, gridItems);
highlightOnHover(gridItems);
showFooter($main, $sentinel, $footer);
initDropdownMenu();
