const {
  login,
  register,
  getAllUsers,
  setAvatar,
  logOut,
  setIntro,
  getOneUser,
} = require("../controllers/userController");
const {
  newMatch,
  getAllMatchs,
  friendRequest,
} = require("../controllers/matchController");
const router = require("express").Router();

router.post("/login", login);
router.post("/register", register);
router.get("/allusers/:id", getAllUsers);
router.get("/getuser/:id", getOneUser);
router.post("/setavatar/:id", setAvatar);
router.get("/logout/:id", logOut);
router.post("/setintro/:id", setIntro);
router.post("/newmatch/", newMatch);
router.post("/getmatchs/", getAllMatchs);
router.post("/friendrequest/", friendRequest);

module.exports = router;
