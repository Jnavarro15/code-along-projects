// Topics: Custom Events, Event Delegation, local storage, DOM Events, Object Reference,

const shoppingForm = document.querySelector('.shopping');
const list = document.querySelector('.list');

// We need an array to hold our state
let items = [];

function handleSubmit(e) {
  e.preventDefault();
  console.log('submitted');
  const name = e.currentTarget.item.value;
  // if its empty, then dont submit it
  if (!name) return;

  const item = {
    name,
    id: Date.now(),
    complete: false,
  };
  // push items into our state
  items.push(item);
  console.log(`There are now ${items.length} in your state`);
  // clear the form.
  e.target.reset();
  // fire off a custom event that will tell anyone else who cares that the items have been updated
  list.dispatchEvent(new CustomEvent('itemsUpdated'));
}

function displayItems() {
  console.log(items);
  const html = items
    .map(
      item => `<li class="shopping-item">
      <input
        value="${item.id}"
        type="checkbox"
        ${item.complete ? 'checked' : ''}  
      >  
      <span class="itemName">${item.name}</span>
      <button
       aria-label="Remove ${item.name}"
       value="${item.id}" 
      >&times;</button>
  </li>`
    )
    .join('');
  list.innerHTML = html;
}

// save items in local storage so that they work after refreshing the page
function mirrorToLocalStorage() {
  console.log('saving items to local storage');
  localStorage.setItem('items', JSON.stringify(items));
}

// When you refresh page local storage is restored
function restoreFromLocalStorage() {
  console.info('restoring from ls');
  // pull the items from LS
  const lsItems = JSON.parse(localStorage.getItem('items'));
  if (lsItems.length) {
    items.push(...lsItems);
    list.dispatchEvent(new CustomEvent('itemsUpdated'));
  }
}

function deleteItem(id) {
  console.log('deleting item', id);
  // update our items array without this one
  items = items.filter(item => item.id !== id);
  list.dispatchEvent(new CustomEvent('itemsUpdated'));
}

function markAsComplete(id) {
  console.log('marking as complete');
  const itemRef = items.find(item => item.id === id);
  itemRef.complete = !itemRef.complete;
  list.dispatchEvent(new CustomEvent('itemsUpdated'));
}

shoppingForm.addEventListener('submit', handleSubmit);
list.addEventListener('itemsUpdated', displayItems);
list.addEventListener('itemsUpdated', mirrorToLocalStorage);
// Event delegation: we listen for the click on the list <ul> but then delegate the click over to the button if that is what was clicked
list.addEventListener('click', function(e) {
  const id = parseInt(e.target.value);
  if (e.target.matches('button')) {
    deleteItem(id);
  }
  if (e.target.matches('input[type="checkbox"]')) {
    markAsComplete(id);
  }
});
restoreFromLocalStorage();
