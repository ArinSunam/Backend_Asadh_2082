import { User } from "../models/User.model.js";

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

export { userRegister };
