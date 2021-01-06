import { getUserByEmail, addUser } from '../../services/userService.js';
import { bcryptHash, bcryptCompare, validate, required, isEmail, minLength  } from '../../deps.js';


const getData = async (request, session) => {
  const user = await session.get('user');
  const data = {
    email: "",
    errors: null,
    user: user
  };

  if (request) {
    const body = request.body();
    const params = await body.value;
    data.email = params.get("email");
  }

  return data;
};

const showRegistrationForm = async ({ render, session }) => {
  render('register.ejs', await getData(null, session));
}

const postRegistrationForm = async({ request, render, response, session }) => {
  const body = request.body();
  const params = await body.value;
  const data = await getData(request, session);
  
  const email = params.get('email');
  const password = params.get('password');
  const verification = params.get('verification');

  const validationRules = {
    email: [required, isEmail],
    password: [required, minLength(4)]
  };
  
  const messages = {
    messages: {
      'email.isEmail': `'${email}' is not an email`,
      'password.minLength': 'Password should be at least 4 characters long'
    }
  };

  const [passes, errors] = await validate({ email, password }, validationRules, messages);

  if (!passes) {
    data.errors = errors;
  }

  if (password !== verification) {
    if (!data.errors) {
      data.errors = {};
    }
    data.errors.password = { match: 'The entered passwords did not match' };
  }

  const existingUsers = await getUserByEmail(email);
  if (existingUsers) {
    if (!data.errors) {
      data.errors = {};
    }
    if (!data.errors.email) {
      data.errors.email = {};
    }

    data.errors.email.isUnique = 'The email is already reserved.';
  }

  if (!data.errors) {
    const hash = await bcryptHash(password);
    await addUser(email, hash);

    // Also log the user in.
    const user = await getUserByEmail(email);
    await session.set('authenticated', true);
    await session.set('user', {
        id: user.id,
        email: user.email
    });

    response.redirect('/behavior/summary');
    return;
  }

  response.status = 400;
  render('register.ejs', data);
};

const showLoginForm = async ({ render, response, session }) => {
  const authenticated = await session.get('authenticated');
  if (authenticated) {
    response.redirect('/behavior/summary');
  }
  render('login.ejs', { message: null, user: null });
}

const showErrorOnLogin = (render, response) => {
  response.status = 401;
  render('login.ejs', { message: 'Email or password was incorrect.', user: null });
}

const postLoginForm = async ({ request, render, response, session }) => {
  const body = request.body();
  const params = await body.value;

  const email = params.get('email');
  const password = params.get('password');

  // check if the email exists in the database
  const user = await getUserByEmail(email);
  if (!user) {
    showErrorOnLogin(render, response);
    return;
  }

  const hash = user.password;

  const passwordCorrect = await bcryptCompare(password, hash);
  if (!passwordCorrect) {
    showErrorOnLogin(render, response);
    return;
  }

  await session.set('authenticated', true);
  await session.set('user', {
      id: user.id,
      email: user.email
  });
  response.redirect('/behavior/summary');
}

const handleLogout = async ({ response, session }) => {
  await session.set('authenticated', false);
  await session.set('user', null);
  response.redirect('/');
}

export { showRegistrationForm, postRegistrationForm, showLoginForm, postLoginForm, handleLogout }