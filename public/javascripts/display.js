export class Display {
  constructor(apiHandler) {
    this.apiHandler = apiHandler;
  }

  async showMainDisplay() {
    let contacts = await this.apiHandler.getContacts();

    this.insertTemplate($('#search-and-add'), $('main'));
    this.showContacts(contacts);
  }

  clearContacts() {
    let mainChildren = $('main').children();
    let inputsHtml = Object.values(mainChildren).slice(0, 2);
    mainChildren.replaceWith(inputsHtml);
  }

  showContacts(contactInfo) {
    let context = {
      "contacts": contactInfo
    }

    context.contacts.map(contact => {
      if (contact.tags) {
        contact.tags = contact.tags.split(',');
      }

      return contact;
    })

    this.insertTemplate($('#contact-display-template'), $('main'), context);
  }

  clearMainDisplay() {
    $('main').html('');
  }

  insertTemplate(template, element, context) {
    let templateHtml = template.html();
    let templateScript = Handlebars.compile(templateHtml);
    let html = context !== undefined ? templateScript(context) : templateScript();
    element.append(html);
  }

  addTag(tagName) {
    let tag = document.createElement('LI');
    let tagList = document.getElementById('tag-list');
    tag.textContent = tagName;
    tag.innerHTML += "<button class='delete-button'>X</button>";
    tagList.appendChild(tag);
  }

  showContactTags(id) {
    this.apiHandler.getContact(id).then(response => {
      let tagNames = response.tags;
      tagNames.split(',').forEach(tagName => {
        this.addTag(tagName);
      })
    })
  }
}

// delete button for tags in edit doesn't work

