import jwt from 'jsonwebtoken';

const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '15d',
    });

    const options = {
        maxAge: 15 * 24 * 60 * 60 * 1000 ,
        httpOnly: true,
        sameSite: "strict",
    };

    res.cookie('token', token, options);

    return token;
}

export default generateTokenAndSetCookie;