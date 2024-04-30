Features:
- Main page
  X Clicking contact Manager Header reroutes to Main Page
  X button to add contact
    X routes to 'Add Contact' page
  X search bar
    X as user types in search, results autopopulate as "contact card" on the page
  - list of contacts as "contact cards"
    X Name as header
    X email
    X phone numer
    - tags
      - clicking on a tag takes user to list of contacts with the same tag
  X Edit contact card
    X Updates contact with changes made
  X Delete contact card
    X alert to ensure user wants to delete contact
    X CANCEL returns to main page
    X OK deletes contact

X Add Contact/Create Contact
  X full name
    X validation
      X must contain name for add contact
  X email address
    X validation
      X must be structured with "@domain.something" for add contact
  X phone number
    X validation
      X must only contain numbers
  X submit
    X adds new contact info
    X returns user to main page
  X cancel
    X returns user to main page
  - add tag (optional)
    - user can select a tag to attach to a contact (e.g. marketing, sales, engineering, etc.)

  - CSS ??
    - analog style, like adding a contact card to a rolodex??

  - Assumptions
    - there are no two contacts with the same name
    - each contact only has one phone number

- Tagging
  - create tag
  - can select a tag to attach to contact; ea contact can have multiple tags
  - clicking on tag shows all contacts with tag

Also, implement a "tagging" feature, which allows you to create tags, such as "marketing," "sales," "engineering," and when you add/edit a contact, you can select a tag to attach to the contact. Finally, you can click on a tag and show all the contacts with that tag. The UI isn't too important here since the focus is on the functionality.
