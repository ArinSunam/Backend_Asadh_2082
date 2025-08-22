import { User } from "../models/User.model.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const access_token = user.generateAccessToken();
    const refresh_token = user.generateRefreshToken();
    user.refresh_token = refresh_token;
    await user.save({ validateBeforeSave: false });
    return { access_token, refresh_token };
  } catch (error) {
    res.status(500).json({
      messsage: error,
    });
  }
};

//1.take user input from body (fullname, email, password)
//2. check if user with that email exists
//3. create and save the user in db
//4. remove password and refresh token
//5. return response to frontend

const userRegister = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;
    const isExist = await User.findOne({ email });
    if (isExist) {
      return res.status(409).json({
        message: " User with the email already exists",
      });
    }

    const user = await User.create({
      fullname,
      email,
      password,
    });

    const createdUser = await User.findById(user._id).select("-password -refresh_token");

    res.status(201).json({
      message: "User registered successfully",
      data: createdUser,
    });
  } catch (error) {
    console.log("Error while registering::", error);
    res.status(500).json({
      messsage: error,
    });
  }
};

//1.take email and password from the user body
//2.verify if the user exists if exists then verify password
//3. generate access and refresh tokens
//4. save the refresh token in user db
//5. query the user and remove the refresh token and password
//6. return response with tokens and data while saving the cookies

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const { access_token, refresh_token } = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refresh_token");
    console.log("user", loggedInUser);
    const options = {
      httpOnly: true,
      secure: false,
    };

    res.cookie("access_token", access_token, options).status(200).json({
      message: "Loggedin successfully",
      data: {
        access_token,
        refresh_token,
        loggedInUser,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
};

export { userRegister, userLogin };
