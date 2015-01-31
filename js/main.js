var userList = ObjectStore();
var addUserForm = document.querySelector('.new-user-form');
var searchBar = document.querySelector('.search-bar');
var azButton = document.querySelector('.a-z');
var zaButton = document.querySelector('.z-a');

refreshList();

addUserForm.addEventListener('submit', function (e) {
  e.stopPropagation();
  e.preventDefault();
  createUser();
})

searchBar.addEventListener('keyup', function () {
  searchUsers(document.querySelector('.search-bar').value.trim());
})

azButton.addEventListener('click', function() {
  orderAscending();
})

zaButton.addEventListener('click', function() {
  orderDescending();
})

  //--------------------------------//
 // Here be sorting functionality! //
//--------------------------------//

function orderAscending() {
  var userArray = userList.query();
  userArray.sort( function (a, b) {
    if (a.fullName() > b.fullName()) {
      return 1;
    }
    if (a.fullName() < b.fullName()) {
      return -1;
    }
    return 0;
  })

  clearList();

  for (var i = 0; i < userArray.length; ++i) {
    document.querySelector('.user-list').appendChild(newUserListing(userArray[i]));
  }
}

function orderDescending() {
  var userArray = userList.query();
  userArray.sort( function (a, b) {
    if (b.fullName() > a.fullName()) {
      return 1;
    }
    if (b.fullName() < a.fullName()) {
      return -1;
    }
    return 0;
  })

  clearList();

  for (var i = 0; i < userArray.length; ++i) {
    document.querySelector('.user-list').appendChild(newUserListing(userArray[i]));
  }
}

  //---------------------------------//
 // Below lies search functionality //
//---------------------------------//

function searchUsers (str) {
  str = str.toLowerCase();
  var userArray = userList.query();
  clearList();

  for(var i = 0; i < userArray.length; ++i) {
    if (userArray[i].email.indexOf(str) >= 0 || userArray[i].fullName().indexOf(str) >= 0 ) {
      document.querySelector('.user-list').appendChild(newUserListing(userArray[i]));
    }
  }
}

function clearList() {
  while (document.querySelector('.user-list').firstChild) {
    document.querySelector('.user-list').removeChild(document.querySelector('.user-list').firstChild);
  }
}

  //--------------------------------------//
 // Below lies user-adding functionality //
//--------------------------------------//

function createUser () {
  var newUser = User({ firstName: document.querySelector('.first-name-input').value.toLowerCase().trim(),
                          lastName: document.querySelector('.last-name-input').value.toLowerCase().trim(),
                          email: document.querySelector('.email-input').value.toLowerCase().trim() });
  if (userList.add(newUser)) {
    document.querySelector('.user-list').appendChild(newUserListing(newUser));
  } else {
    alert('User already exists, silly!');
  }
  resetUserInput();
}

function resetUserInput() {
  document.querySelector('.first-name-input').value = '';
  document.querySelector('.last-name-input').value = '';
  document.querySelector('.email-input').value = '';
}

function newUserListing(user) {
  var userListingContainer = newUserListingContainer();
  var userListingName = newUserListingName(user);
  var userListingEmail = newUserListingEmail(user);
  var deleteButton = newDeleteButton(user);
  userListingContainer.appendChild(deleteButton);
  userListingContainer.appendChild(userListingName);
  userListingContainer.appendChild(userListingEmail);
  return userListingContainer;
}

function newUserListingContainer() {
  var shellDiv = document.createElement('div');
  var classAtt = document.createAttribute('class');
  classAtt.value = 'user-listing-container';
  shellDiv.setAttributeNode(classAtt);
  return shellDiv;
}

function newUserListingName(user) {
  var userListingName = document.createElement('span');
  var classAtt = document.createAttribute('class');
  classAtt.value = 'user-listing-name';
  userListingName.setAttributeNode(classAtt);
  userListingName.textContent = user.fullName();
  return userListingName;
}

function newUserListingEmail(user) {
  var userListingEmail = document.createElement('a');
  var classAtt = document.createAttribute('class');
  var hrefAtt = document.createAttribute('href');
  classAtt.value = 'user-listing-email';
  hrefAtt.value = 'mailto:' + user.email;
  userListingEmail.setAttributeNode(classAtt);
  userListingEmail.setAttributeNode(hrefAtt);
  userListingEmail.textContent = user.email;
  return userListingEmail;
}

function refreshList() {
  userArray = userList.query();
  clearList();
  for (var i = 0; i < userArray.length; ++i) {
    document.querySelector('.user-list').appendChild(newUserListing(userArray[i]));
  }

  if (userArray === null || userArray.length <=0) {
    document.querySelector('.no-users').className += ' .visible';
  }
}

function newDeleteButton (user) {
  var deleteButton = document.createElement('button');
  var classAtt = document.createAttribute('class');
  classAtt.value = 'delete';
  deleteButton.setAttributeNode(classAtt);
  deleteButton.textContent = 'x';

  deleteButton.addEventListener('click', function () {
    userList.remove(user);
    refreshList();
  })

  return deleteButton;
}
