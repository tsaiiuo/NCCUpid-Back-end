const User = require("../models/userModel");
const Matchs = require("../models/matchModel");
const bcrypt = require("bcrypt");
module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const matchs = [];
    const friends = [];
    const user = await User.findOne({ username });
    if (!user)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.json({
        msg: "Incorrect Username or Password1",
        status: false,
      });

    const match = await Matchs.findOne({ owner: user._id });

    for (let i = 0; i < match.matchs.length; i++) {
      if (!match.matchs[i].comfirm) {
        matchs.push(
          await User.findOne({
            _id: match.matchs[i].match,
          }).select([
            "email",
            "username",
            "avatarImage",
            "_id",
            "habits",
            "hates",
            "positive",
            "major",
            "age",
            "gender",
            "gangs",
            "home",
          ])
        );
      }
    }

    for (let i = 0; i < match.friends.length; i++) {
      friends.push(
        await User.findOne({
          _id: match.friends[i].friend,
        }).select(["email", "username", "avatarImage", "_id"])
      );
    }
    delete user.password;

    return res.json({ status: true, user, matchs: matchs, friends });
  } catch (ex) {
    next(ex);
  }
};

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
      return res.json({ msg: "Username already used", status: false });
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "Email already used", status: false });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    // const users = await User.find({ _id: { $ne: req.params.id } }).select([
    //   "email",
    //   "username",
    //   "avatarImage",
    //   "_id",
    // ]);
    const friends = [];
    const match = await Matchs.findOne({ owner: req.params.id });
    for (let i = 0; i < match.friends.length; i++) {
      friends.push(
        await User.findOne({
          _id: match.friends[i].friend,
        }).select(["email", "username", "avatarImage", "_id"])
      );
    }

    return res.json(friends);
  } catch (ex) {
    next(ex);
  }
};

module.exports.getOneUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
      "habits",
      "hates",
      "positive",
      "major",
      "age",
      "gender",
    ]);
    return res.json(user);
  } catch (ex) {
    next(ex);
  }
};

module.exports.setIntro = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { age, home, major, gang, habit, hate, positive, gender } = req.body;
    const user = await User.findOne({ _id: userId });
    for (let i = 0; i < gang.length; i++) {
      user.gangs.push(gang[i]);
    }
    for (let i = 0; i < habit.length; i++) {
      user.habits.push(habit[i]);
    }
    for (let i = 0; i < hate.length; i++) {
      user.hates.push(hate[i]);
    }
    user.isIntroSet = true;
    user.age = age;
    user.home = home;
    user.major = major;
    user.positive = positive;
    user.gender = gender;

    user.save();
    return res.json({
      isSet: user.isIntroSet,
      age: user.age,
      home: user.home,
    });
  } catch (ex) {
    next(ex);
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      { new: true }
    );
    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (ex) {
    next(ex);
  }
};

module.exports.logOut = (req, res, next) => {
  try {
    if (!req.params.id) return res.json({ msg: "User id is required " });
    onlineUsers.delete(req.params.id);
    return res.status(200).send();
  } catch (ex) {
    next(ex);
  }
};
