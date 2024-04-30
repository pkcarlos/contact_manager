export class Validator {
  constructor(display) {
    this.display = display;
  }

  isValidInput(inputId, input) {
    let regex;
    let result;
    switch (inputId) {
      case 'full_name':
        regex = /^(?=.*[ ]).*[a-zA-Z'-]+$/;
        result = regex.test(input);
        break;
      case 'email':
        regex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
        result = regex.test(input);
        break;
      case 'phone_number':
        regex = /^\d{3}-\d{3}-\d{4}$/;
        result = regex.test(input);
        break;
    }

    return result;
  }

  inputsValid(inputs) {
   return Object.entries(inputs).slice(0, 3).every(pair => this.isValidInput(pair[0], pair[1]));
  }
}
