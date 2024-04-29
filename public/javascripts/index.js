import { Manager } from './contact_manager.js';
import { Display } from './display.js';
import { ApiHandler } from './api_handler.js';
import { Validator } from './validator.js';

document.addEventListener('DOMContentLoaded', () => {
  let apiHandler = new ApiHandler();
  let display = new Display(apiHandler);
  let validator = new Validator();

  new Manager(display, apiHandler);
})