import { fadeInDownText } from './modules/logoAnimation.js';
import { bounceInText } from './modules/heroAnimation.js';
import { burgerMenuToggle } from './modules/burgerMenuToggle.js';
import { toggleHeaderOnScroll } from './modules/headerAnimation.js';
import { fadeInUpText } from './modules/introAnimation.js';
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
const $introText = $('.intro__text');
const $heroText = $('.hero__text');
const $header = $('.header');
const $sentinel = $('.sentinel');
const $main = $('.main');
const $footer = $('.footer');
const $burgerMenuInput = $('.burger__menu input');

fadeInDownText($logoTitle);
moveItemsToBottom(container, gridItems);
bounceInText($heroText);
burgerMenuToggle($burgerMenuInput);
toggleHeaderOnScroll($header);
fadeInUpText($introText);
resetTransformOnIntersect(container, gridItems);
highlightOnHover(gridItems);
showFooter($main, $sentinel, $footer);
initDropdownMenu();
