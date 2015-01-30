// User constructs a new user object. For more details, see
// https://github.com/tiy-durham-fe-2015/curriculum/tree/master/assignments/user_mgmt
function User(spec) {
  validateSpec(spec);

  return {

    firstName: spec.firstName,
    lastName: spec.lastName,
    email: spec.email,

    fullName: function() {
      return this.firstName + ' ' + this.lastName;
    },

    equal: function(otherUser) {
      return this.email === otherUser.email;
    }

  }
}

//**************************//
function validateSpec(spec) {
  if (!spec) {
    throw 'no user info submitted';
  }

  if (!spec.firstName || spec.firstName.trim() === '') {
    throw 'no first name submitted';
  }

  if (!spec.lastName || spec.lastName.trim() === '') {
    throw 'no last name submitted';
  }

  if (!spec.email || spec.email.trim() === '') {
    throw 'no email submitted';
  }
}
