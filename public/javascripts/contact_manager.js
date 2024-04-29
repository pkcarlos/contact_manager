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
    $('form').on('submit', (event) => {
      event.preventDefault();

      let form = document.querySelector('form');
      let formId = form.id;
      let formData = new FormData(form);
      let data = {};

      formData.forEach((k, v) => data[v] = k);

      if (formId === "add-contact") {
        this.apiHandler.addContact(data);
      } else if (formId === "edit-contact") {
        this.apiHandler.updateContact(contactId, data);
      }

      this.display.clearMainDisplay();
      this.setupMainPage();
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