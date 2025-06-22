const enc = require("bcryptjs")
const User = require("../models/User")

exports.signup = async (req, res) => {
    const { name, username, email, password } = req.body

    if (!name || !username || !email || !password) {
        return res.status(400).json({
            error: "All fields are required"
        })
    }

    try {
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        })

        if (existingUser) {
            return res.status(409).json({
                error: "User with this email or username already exists"
            })
        }

        const hashedPassword = await enc.hash(password, 10)

        const newUser = new User({
            name,
            username,
            email,
            password: hashedPassword
        })

        await newUser.save()

        res.status(201).json({
            message: "User registered successfully"
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Server error" })
    }
}

exports.login = async (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        return res.status(400).json({
            error: "Username and password are required"
        })
    }

    try {
        const user = await User.findOne({ username })

        if (!user) {
            return res.status(404).json({
                error: "User not found"
            })
        }

        const isPasswordValid = await enc.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({
                error: "Invalid password"
            })
        }

        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                username: user.username
            }
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Server error" })
    }
}
