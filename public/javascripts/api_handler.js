export class ApiHandler {
  async getContacts() {
    let response = await fetch("http://localhost:3000/api/contacts");
    return await response.json();
  }

  async getContact(id) {
    let response =  await fetch(`http://localhost:3000/api/contacts/${id}`);
    return await response.json();
  }

  async deleteContact(id) {
    let data = { id: id };

    await fetch(`http://localhost:3000/api/contacts/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => {
      if (response.ok) {
        alert('Contact deleted.');
      } else {
        alert(response.statusText);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    })
  }

  async addContact(formData) {
    await fetch("http://localhost:3000/api/contacts/", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData),
    })
    .then(response => {
      if (response.ok) {
        alert('New contact added.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    })
  }

  async updateContact(contactId, newData) {
    newData.id = parseInt(contactId);

    await fetch(`http://localhost:3000/api/contacts/${contactId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newData),
    })
    .then(response => {
      if (response.ok) {
        alert('Contact updated.');
      } else {
        alert(`Error: ${response.statusText}`);
      }
    })
  }
}