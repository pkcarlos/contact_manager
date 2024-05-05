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
    this.handleTagLinks();
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

  async handleTagLinks() {
    let tagLinks = document.getElementsByClassName('tag-links');

    for (let i = 0; i < tagLinks.length; i ++) {
      let link = tagLinks[i];
      
      link.addEventListener('click', (event) => {
        event.preventDefault();

        let tagName = event.target.textContent.slice(1).trim();
        this.display.clearMainDisplay();
        this.display.insertTemplate($('#search-and-add'), $('main'));
        document.querySelector('main').innerHTML += '<h2>Tagged with: ' + `"${tagName}"` + '</h2>';

        // get contacts that include "friend" as tag
        this.apiHandler.getContacts()
          .then(contacts => {
            let contactInfo = contacts.filter(contact => {
              let tags = contact.tags;
              if (tags) {
                return contact.tags.split(',').includes(tagName);
              }
            })

            this.display.showContacts(contactInfo);
        });

      })
    }
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
      this.handleTagInputs();
    })
  }

  configureTags() {
    let tags = [];
    let tagList = document.getElementById('tag-list').children;

    for (let i = 0; i < tagList.length; i ++) {
      let tag = tagList[i];
      tags.push(tag.textContent.slice(0, -1));
    }

    return tags.join(',');
  }

  handleTagInputs() {
    $('#tags').on('keydown', (event) => {
      let tagValue = event.target.value.trim();

      if (event.key === 'Enter') {
        event.preventDefault();

        // tag validation
        if (tagValue !== '' && this.validator.uniqueTag(tagValue, this.getTags())) {
          this.display.addTag(tagValue);
          event.target.value = '';
          event.target.nextElementSibling.style.display = 'none';
        } else {
          event.target.nextElementSibling.style.display = 'inline';
        }
      }
    })

    $('#tag-list').on('click', (event) => {
      event.preventDefault();

      if (event.target.classList.contains('delete-button')) { /// replaced code below
        event.target.parentNode.remove();
      }
      // let listItem = event.target.parentNode; /// why did this give me an error???
      // listItem.parentNode.removeChild(listItem);
    })
  }

  getTags() {
    let tags = [];
    let tagList = document.getElementById('tag-list').children;
    
    if (tags) {
      for (let i = 0; i < tagList.length; i ++) {
        let tag = tagList[i];
        tags.push(tag.textContent.slice(0, -1));
      }
    }

    return tags;
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
      let tags = this.configureTags();
      let data = {};

      formData.forEach((k, v) => data[v] = k);
      data.tags = tags;
    
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

          for (let i = 0; i < 3; i ++) {
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

        this.display.clearMainDisplay();
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
          let template = $('#edit-contact-template');
          let element = $('main');
          let context = response;

          this.display.clearMainDisplay();
          this.display.insertTemplate(template, element, context);
          this.display.showContactTags(contactId);
          this.handleTagInputs();
          this.handleCancelButton();
          this.handleSubmitButton(contactId);
        })
      })
    }
  }
}

// bugs
// pressing enter on add contact when cursor is in any input except tags submits form...right now, pressing ENTER while cursor is in any input deletes any tags already in the Tags section
// contact deleted and contact added alerts showing up weird
// clicking next to tags triggers link

// lowercase all tags??

