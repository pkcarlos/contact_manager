export class Manager {
  constructor(display, apiHandler, validator) {
    this.display = display;
    this.apiHandler = apiHandler;
    this.validator = validator;
    this.setupMainPage();
  }

  async setupMainPage() {
    await this.display.showMainDisplay();
    this.renderSearchFunction();
    this.handleAddContactButton();
    this.handleEditButtons();
    this.handleDeleteButtons();
  }

  async renderSearchFunction() {
    $('#search').on('keyup', () => {
      this.apiHandler.getContacts()
        .then(response => {
          let allContacts = response;
          let input = $('#search').val().toLowerCase();
          let searchResults = allContacts.filter(contact => contact.full_name.toLowerCase().startsWith(input));
          this.display.clearContacts();
          this.display.showContacts(searchResults);
        })
      })
  }

  handleAddContactButton() {
    $('#add-contact').on('click', (e) => {
      e.preventDefault();

      let template = $('#create-contact-template');
      let element = $('main');

      this.display.clearMainDisplay();
      this.display.insertTemplate(template, element);
      this.handleCancelButton();
      this.handleSubmitButton();
    })
  }

  handleCancelButton() {
    $('#cancel').on('click', () => {
      this.display.clearMainDisplay();
      this.setupMainPage();
    })
  }

  handleSubmitButton(contactId) {
    $('#submit').on('click', (event) => {
      event.preventDefault();

      let form = document.querySelector('form');
      let formData = new FormData(form);
      let data = {};

      formData.forEach((k, v) => data[v] = k);
    
      // validation
      if (this.validator.inputsValid(data)) {
        let formId = form.id;

        if (formId === "add-contact") {
          this.apiHandler.addContact(data);
        } else if (formId === "edit-contact") {
          this.apiHandler.updateContact(contactId, data);
        }

        this.display.clearMainDisplay();
        this.setupMainPage();
      } else {
          let divInputs = form.querySelectorAll('div input');

          for (let i = 0; i < divInputs.length - 1; i ++) {
            let divInput = divInputs[i];
            let inputId = divInput.id;
            let inputValue = divInput.value;

            if (this.validator.isValidInput(inputId, inputValue)) {
              divInput.nextElementSibling.style.display = "none";
            } else {
              divInput.nextElementSibling.style.display = "inline";
            }
          }

          this.handleSubmitButton(contactId);
      }
    })
  }
  
  handleDeleteButtons() {
    let deleteButtons = document.getElementsByClassName('delete');

    for (let i = 0; i < deleteButtons.length; i ++) {
      let button = deleteButtons[i];

      button.addEventListener('click', (event) => {
        let id = event.target.parentNode.dataset.contactId;
        
        if (confirm('Are you sure you want to delete the contact?')) {
          this.apiHandler.deleteContact(id);
        }

        this.setupMainPage();
      })
    }
  }

  handleEditButtons() {
    let editButtons = document.getElementsByClassName('edit');

    for (let i = 0; i < editButtons.length; i ++) {
      let button = editButtons[i];

      button.addEventListener('click', (event) => {
        let contactId = event.target.parentNode.dataset.contactId;
        
       this.apiHandler.getContact(contactId).then(response => {
          let template = $("#edit-contact-template");
          let element = $('main');
          let context = response;

          this.display.clearMainDisplay();
          this.display.insertTemplate(template, element, context);
          this.handleCancelButton();
          this.handleSubmitButton(contactId);
        })
      })
    }
  }
}