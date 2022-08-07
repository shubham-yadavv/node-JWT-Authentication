const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./model/user.model');
const jwt = require('jsonwebtoken');

const secret = 'asdfg;lkjh';

mongoose.connect('mongodb+srv://shubham:1234@backend.xh5qinh.mongodb.net/?retryWrites=true&w=majority')
//mongoose.connect('mongodb://localhost:27017/authentication')
    .then(() => {
        console.log('Connected to MongoDB');
    }
    ).catch(err => {
        console.log('Error connecting to MongoDB: ', err.message);
    }
    );


const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());


app.post('/api/change-password', async (req, res) => {
	const { token, newpassword: plainTextPassword } = req.body

	if (!plainTextPassword || typeof plainTextPassword !== 'string') {
		return res.json({ status: 'error', error: 'Invalid password' })
	}

	if (plainTextPassword.length < 5) {
		return res.json({
			status: 'error',
			error: 'Password too small. Should be atleast 6 characters'
		})
	}

	try {
		const user = jwt.verify(token, secret)

		const _id = user.id

		const password = await bcrypt.hash(plainTextPassword, 10)

		await User.updateOne(
			{ _id },
			{
				$set: { password }
			}
		)
		res.json({ status: 'ok' })
	} catch (error) {
		console.log(error)
		res.json({ status: 'error', error: ';))' })
	}
})

app.post('/api/login', async (req, res) => {

    const { username, password } = req.body;

    const user = await User.findOne({ username }).lean();
    if (!user) {
        return res.status(400).send('User not found');
    }


    if (bcrypt.compare(password, user.password)) {
        const token = jwt.sign({
            _id: user._id,
            username: user.username
        }, secret);

        return res.json({ status: 'ok', data: token });


    }

    res.json({ status: 'error', data: 'Invalid password' });


})

app.post('/api/register', async (req, res) => {
    console.log(req.body);

    const { username, password: plainTextPassword } = req.body;

    const password = await bcrypt.hash(plainTextPassword, 10)

    try {
        const response = await User.create({
            username,
            password
        })
        console.log('User created successfully: ', response)
    } catch (error) {
        console.log('Error creating user: ', error)
    }

    res.send('User created successfully')

}
);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
}
);