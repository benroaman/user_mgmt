var userList = ObjectStore();
var addUserForm = document.querySelector('.new-user-form');
var searchBar = document.querySelector('.search-bar');
var azButton = document.querySelector('.a-z');
var zaButton = document.querySelector('.z-a');
var newestFirstButton = document.querySelector('.newest-oldest');
var oldestFirstButton = document.querySelector('.oldest-newest');
var editCancelButton = document.querySelector('.edit-modal-cancel');

showNoUserNote();

addUserForm.addEventListener('submit', function (e) {
  e.stopPropagation();
  e.preventDefault();
  clearSearch();
  createUser();
})

searchBar.addEventListener('keyup', function () {
  searchUsers(document.querySelector('.search-bar').value.trim());
})

azButton.addEventListener('click', function() {
  clearSearch();
  fullNameAscending();
})

zaButton.addEventListener('click', function() {
  clearSearch();
  fullNameDescending();
})

newestFirstButton.addEventListener('click', function() {
  clearSearch();
  timestampAscending();
})

oldestFirstButton.addEventListener('click', function() {
  clearSearch();
  timestampDescending();
})

editCancelButton.addEventListener('click', function(e) {
  e.stopPropagation();
  e.preventDefault();
  document.querySelector('.edit-modal-greyout').className = 'edit-modal-greyout';
})

  //--------------------------------//
 // Here be sorting functionality! //
//--------------------------------//

function fullNameAscending() {
  var userArray = userList.query();
  userArray.sort( function (a, b) {
    if (a.fullName().toLowerCase() > b.fullName().toLowerCase()) {
      return 1;
    }
    if (a.fullName().toLowerCase() < b.fullName().toLowerCase()) {
      return -1;
    }
    return 0;
  })

  clearList();

  for (var i = 0; i < userArray.length; ++i) {
    document.querySelector('.user-list').appendChild(newUserListing(userArray[i]));
  }
}

function fullNameDescending() {
  var userArray = userList.query();
  userArray.sort( function (a, b) {
    if (b.fullName().toLowerCase() > a.fullName().toLowerCase()) {
      return 1;
    }
    if (b.fullName().toLowerCase() < a.fullName().toLowerCase()) {
      return -1;
    }
    return 0;
  })

  clearList();

  for (var i = 0; i < userArray.length; ++i) {
    document.querySelector('.user-list').appendChild(newUserListing(userArray[i]));
  }
}

function timestampAscending() {
  var userArray = userList.query();
  userArray.sort( function (a, b) {
    if (b.timestampNumber() > a.timestampNumber()) {
      return 1;
    }
    if (b.timestampNumber() < a.timestampNumber()) {
      return -1;
    }
    return 0;
  })

  clearList();

  for (var i = 0; i < userArray.length; ++i) {
    document.querySelector('.user-list').appendChild(newUserListing(userArray[i]));
  }
}

function timestampDescending() {
  var userArray = userList.query();
  userArray.sort( function (a, b) {
    if (a.timestampNumber() > b.timestampNumber()) {
      return 1;
    }
    if (a.timestampNumber() < b.timestampNumber()) {
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
      hideNoUserNote();
    }
  }
  if (!document.querySelector('.user-list').firstChild) {
    showNoUserNote();
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
  hideUserExistsNote();
  var newUser = User({ firstName: document.querySelector('.first-name-input').value.toLowerCase().trim(),
                          lastName: document.querySelector('.last-name-input').value.toLowerCase().trim(),
                          email: document.querySelector('.email-input').value.toLowerCase().trim(),
                          timestamp: new Date() });
  if (userList.add(newUser)) {
    // document.querySelector('.user-list').appendChild(newUserListing(newUser));
    refreshList();
    hideNoUserNote();
  } else {
    showUserExistsNote();
  }
  resetUserInput();
  document.querySelector('.new-user-form .new-user-input').focus();
}

function resetUserInput() {
  document.querySelector('.first-name-input').value = '';
  document.querySelector('.last-name-input').value = '';
  document.querySelector('.email-input').value = '';
}

function newUserListing(user) {
  var userListingContainer = newUserListingContainer();
  userListingContainer.appendChild(newDeleteButton(user));
  userListingContainer.appendChild(newUserListingName(user));
  userListingContainer.appendChild(newEditButton(user));
  userListingContainer.appendChild(newTimestamp(user));
  userListingContainer.appendChild(newUserListingEmail(user));
  return userListingContainer;
}

function newUserListingContainer() {
  var userListingContainer = document.createElement('div');
  userListingContainer.className = 'user-listing-container';
  return userListingContainer;
}

function newUserListingName(user) {
  var userListingName = document.createElement('span');
  userListingName.className = 'user-listing-name';
  userListingName.textContent = ' ' + user.fullName();
  return userListingName;
}

function newUserListingEmail(user) {
  var userListingEmail = document.createElement('a');
  userListingEmail.className = 'user-listing-email';
  userListingEmail.href = 'mailto:' + user.email;
  userListingEmail.textContent = user.email;
  return userListingEmail;
}

function newDeleteButton (user) {
  var deleteButton = document.createElement('div');
  deleteButton.className = 'delete';
  var deleteActual = document.createElement('button');
  deleteActual.className = 'delete-actual';
  deleteActual.textContent = 'x';
  var deleteWidget = newDeleteWidget(user);

  deleteActual.addEventListener('click', function () {
    deleteWidget.className += ' visible';
  })

  deleteButton.appendChild(deleteActual);
  deleteButton.appendChild(deleteWidget);

  return deleteButton;
}

function newDeleteWidget(user) {
  var deleteWidgetContainer = document.createElement('div');
  deleteWidgetContainer.className = 'delete-widget';
  var deleteWidgetText = document.createElement('span');
  deleteWidgetText.className = 'delete-widget-text';
  deleteWidgetText.textContent = 'delete ' + user.fullName() + '?';
  var deleteWidgetYes = newDeleteWidgetYesButton(user);
  var deleteWidgetNo = document.createElement('button');
  deleteWidgetNo.className = 'delete-widget-button delete-widget-no';
  deleteWidgetNo.textContent = 'no';

  deleteWidgetNo.addEventListener('click', function() {
    deleteWidgetContainer.className = 'delete-widget';
  })

  deleteWidgetContainer.appendChild(deleteWidgetText);
  deleteWidgetContainer.appendChild(deleteWidgetYes);
  deleteWidgetContainer.appendChild(deleteWidgetNo);

  return deleteWidgetContainer;

}

function newDeleteWidgetYesButton(user) {
  var deleteWidgetYes = document.createElement('button');
  deleteWidgetYes.className = 'delete-widget-button delete-widget-yes';
  deleteWidgetYes.textContent = 'yes';

  deleteWidgetYes.addEventListener('click', function () {
    userList.remove(user);
    refreshList();
  })

  return deleteWidgetYes;
}

function newTimestamp (user) {
  var timestamp = document.createElement('span');
  timestamp.className = 'timestamp';
  timestamp.textContent = user.timestampString();
  return timestamp;
}

function newEditButton(user) {
  var editButton = document.createElement('button');
  editButton.className = 'edit-button';
  editButton.textContent = 'edit';

  editButton.addEventListener('click', function () {
    var firstName = user.firstName;
    var lastName = user.lastName;
    var email = user.email;
    document.querySelector('.edit-modal-greyout').className += ' visible';
    document.querySelector('.edit-modal-user-name').textContent = ' ' + user.fullName();
    document.querySelector('.edit-modal-first-name').value = firstName;
    document.querySelector('.edit-modal-last-name').value = lastName;
    document.querySelector('.edit-modal-email').value = email;

    var submitButton = document.querySelector('.edit-modal-submit');
    var submitClone = submitButton.cloneNode(true);
    submitButton.parentNode.replaceChild(submitClone, submitButton);

    document.querySelector('.edit-modal-submit').addEventListener('click', function (e) {
      e.stopPropagation();
      e.preventDefault();

      var editedUser = User({firstName: document.querySelector('.edit-modal-first-name').value.trim(),
                              lastName: document.querySelector('.edit-modal-last-name').value.trim(),
                              email: document.querySelector('.edit-modal-email').value.trim(),
                              timestamp: user.timestamp,
                              })

      if (userList.replace(user, editedUser)) {
        refreshList();
        document.querySelector('.edit-modal-greyout').className = 'edit-modal-greyout';
      } else {
        alert('invalid change: email must be unique');
      }
    })

  })

  return editButton;
}

function refreshList() {
  userArray = userList.query();
  clearList();
  for (var i = 0; i < userArray.length; ++i) {
    document.querySelector('.user-list').appendChild(newUserListing(userArray[i]));
  }

  if (userArray === null || userArray.length <=0) {
    showNoUserNote();
  }
}

function showNoUserNote() {
  document.querySelector('.no-users').className += ' visible';
}

function hideNoUserNote() {
  document.querySelector('.no-users').className = 'no-users';
}

function showUserExistsNote() {
  document.querySelector('.user-exists').className += ' visible';
}

function hideUserExistsNote() {
  document.querySelector('.user-exists').className = 'user-exists';
}

function clearSearch() {
  searchBar.value = '';
  if (userList.query().length !== 0) {
  document.querySelector('.no-users').className = 'no-users';
  }
}
