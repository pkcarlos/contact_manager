export class Display {
  constructor(apiHandler) {
    this.apiHandler = apiHandler;
  }

  async showMainDisplay() {
    let mainTemplate = $('#search-and-add').html();
    let templateScript = Handlebars.compile(mainTemplate);
    $('main').html(templateScript());
    let contacts = await this.apiHandler.getContacts();

    this.showContacts(contacts);
  }

  clearContacts() {
    let mainChildren = $('main').children();
    let inputsHtml = Object.values(mainChildren).slice(0, 2);
    mainChildren.replaceWith(inputsHtml);
  }

  showContacts(contactInfo) {
    let template = $('#contact-display-template');
    let element = $('main');
    let context = {
      "contacts": contactInfo
    }

    this.insertTemplate(template, element, context);
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
}
