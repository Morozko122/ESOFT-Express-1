const users = require('../users')
const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    NOT_FOUND: 404
};

const getAllUsers = (req, res) => {
    res.status(HTTP_STATUS.OK).send(users);
};

const getUser = (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find(user => user.id === id);
    user ? res.status(HTTP_STATUS.OK).send(user) : res.status(HTTP_STATUS.NOT_FOUND).send({ error: 'Данный пользователь не найден / Given user not found' });
};

const validateUserData = (name, email, age) => {
    if (!name || typeof name !== 'string' || name.trim() === '') {
        return 'Недопустимое имя / Invalid name';
    }
    if (!email || typeof email !== 'string' || email.trim() === '' || !/\S+@\S+\.\S+/.test(email)) {
        return 'Недопустимый адрес электронной почты / Invalid email';
    }
    if (age === undefined || typeof age !== 'number' || age <= 0) {
        return 'Недопустимый возраст / Invalid age';
    }
    return null;
};

const addNewUser = (req, res) => {
    const { name, email, age } = req.body;
    const error = validateUserData(name, email, age);
    if (error) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ error });
    }
    const newUser = { id: users.length + 1, name, email, age };
    users.push(newUser);
    res.status(HTTP_STATUS.CREATED).json(newUser);
};

const updateUserInfoById = (req, res) => {
    const id = parseInt(req.params.id);
    const { name, email, age } = req.body;

    const error = validateUserData(name, email, age);
    if (error) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ error });
    }

    const user = users.find(user => user.id === id);

    if (user) {
        user.name = name;
        user.email = email;
        user.age = age;
        res.status(HTTP_STATUS.OK).send(user)
    }
    else {
        res.status(HTTP_STATUS.NOT_FOUND).send({ error: 'Данный пользователь не найден / Given user not found' })
    }
};

const deleteUserById = (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.findIndex(user => user.id === id);
    if (user >= 0) {
        users.splice(user, 1)
        res.status(HTTP_STATUS.OK).send(users);
    }
    else {
        res.status(HTTP_STATUS.NOT_FOUND).send({ error: 'Данный пользователь не найден / Given user not found' })
    }
};

const getUsersOlderThenGiven = (req, res) => {
    const age = parseInt(req.params.age);
    const usrs = users.filter(user => user.age > age);
    console.log(usrs);
    if (usrs.length > 0) {
        res.status(HTTP_STATUS.OK).json(usrs);
    }
    else {
        res.status(HTTP_STATUS.NOT_FOUND).send({ error: 'Не найдено / Not found' });
    }
};

const getUsersByEmailDomain = (req, res) => {
    const domain = req.params.domain;

    if (!domain || typeof domain !== 'string' || !domain.includes('.')) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: 'Некорректный домен / Invalid domain' });
    }

    const regex = new RegExp(`@${domain}$`, 'i');

    const filteredUsers = users.filter(user => regex.test(user.email));

    if (filteredUsers.length > 0) {
        res.status(HTTP_STATUS.OK).json(filteredUsers);
    } else {
        res.status(HTTP_STATUS.NOT_FOUND).send({ error: 'Пользователи с таким доменом не найдены / Users with given domain not found' });
    }

};

const getUsersSorted = (req, res) => {
    const sortedUsers = users.slice().sort((first , second) => first.name.localeCompare(second.name));
    res.status(HTTP_STATUS.OK).json(sortedUsers);
};

module.exports = {
    getAllUsers,
    getUser,
    addNewUser,
    updateUserInfoById,
    deleteUserById,
    getUsersOlderThenGiven,
    getUsersByEmailDomain,
    getUsersSorted
};
