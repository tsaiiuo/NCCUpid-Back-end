const Matchs = require("../models/matchModel");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");

module.exports.getAllMatchs = async (req, res, next) => {
  try {
    const users = await Matchs.findOne({ owner: req.body.ownerID });
    var num = 0;
    if (users.matchs.length > 1) {
      num = Math.round(Math.random() * (users.matchs.length - 1));
    }

    const match = await User.findOne({ _id: users.matchs[num].match });
    return res.json({ status: true, match });
  } catch (ex) {
    next(ex);
  }
};

module.exports.createMatch = async (req, res, next) => {
  const userID = req.userID;
  const users = [];
  var status = false;
  const user = await Matchs.findOne({
    owner: userID,
  });
  if (!user) {
    return false;
  }
  //演算法 算分數
  const alluser = await User.find({});
  // console.log(alluser);
  user.matchs.forEach((match) => {
    alluser.forEach((one) => {
      if (match.match.includes(one._id)) {
        // console.log(match.match);
        // console.log(one._id);
        alluser.splice(alluser.indexOf(one), 1);
      }
    });
  });
  // console.log(alluser);
  user.matchs.push({ match: alluser[0]._id });
  user.save();
  return user;
};

module.exports.friendRequest = async (req, res, next) => {
  try {
    var status = false;
    var friendstatus = false;
    const user = await Matchs.findOne({ owner: req.body.userID });
    const friend = await Matchs.findOne({ owner: req.body.friendID });
    var time = req.body.time;
    for (let i = 0; i < user.friends.length; i++) {
      if (user.friends[i].friend.includes(req.body.friendID)) {
        return res.json({});
      }
    }
    for (let i = 0; i < user.matchs.length; i++) {
      if (user.matchs[i].match.includes(req.body.friendID)) {
        user.matchs[i].comfirm = true;
        status = true;
      }
    }
    if (status) {
      for (let i = 0; i < friend.matchs.length; i++) {
        if (
          friend.matchs[i].match.includes(req.body.userID) &&
          friend.matchs[i].comfirm === true
        ) {
          user.friends.push({ friend: friend.owner, time: time });
          friend.friends.push({ friend: user.owner, time: time });
          friendstatus = true;
          break;
        }
      }
    }

    if (status === true) {
      user.save();
    }
    if (friendstatus === true) {
      friend.save();
    }
    return res.json({});
  } catch (e) {
    return res.send(e);
  }
};

module.exports.overTime = async (req, res, next) => {
  try {
    var status = false;
    const user = await Matchs.findOne({ owner: req.body.userID });
    const friend = await Matchs.findOne({ owner: req.body.friendID });
    for (let i = 0; i < user.matchs.length; i++) {
      if (user.matchs[i].match.includes(req.body.friendID)) {
        user.matchs[i].comfirm = true;
        status = true;
      }
    }
    if (status) {
      for (let i = 0; i < friend.matchs.length; i++) {
        if (
          friend.matchs[i].match.includes(req.body.userID) &&
          friend.matchs[i].comfirm === true
        ) {
          user.friends.push({ friend: friend.owner });
          friend.friends.push({ friend: user.owner });
          user.save();
          friend.save();
          console.log(user);
          console.log(friend);
          console.log(123);
        }
      }
    } else {
      user.save();
    }
    return res.json({});
  } catch (e) {
    return res.send(e);
  }
};
module.exports.newMatch = async (req, res, next) => {
  try {
    const userID = req.body.userID;
    const user = await Matchs.create({
      owner: userID,
    });
    user.matchs.push({ match: userID, comfirm: true });
    user.save();
    this.createMatch({ userID });
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.userCheck = async (req, res, next) => {
  var check = true;
  const userID = req.userID;
  const user = await Matchs.findOne({
    owner: userID,
  });
  if (user === undefined) {
    check = false;
  }
  user.matchs.forEach((match) => {
    if (match.match.includes(userID)) {
      check = false;
    }
  });
  return check;
};
