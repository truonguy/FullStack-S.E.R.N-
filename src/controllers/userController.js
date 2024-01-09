import userService from "../services/userService";
let handleLogin =async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    if(!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing inputs parameter!'
        })
    }

    let userData = await userService.handleUserLogin(email, password);

    //check email exits
    //compare password
    //return userInfor
    //access_token: JWT json web token
    return res.status(200).json({
        errCode: userData.errCode,
        errMessage: userData.errMessage,
        user: userData.user ? userData.user : {}
    })
}

let handleGetAllUsers = async (req, res) => {
    let id = req.query.id; //ALL, id
    let users = await userService.getAllUsers(id);
    // console.log(users)
    return res.status(200).json ({
        errCode: 0,
        errMessage: 'OK',
        users
    })
}

let handleCreateUser = async (req, res) => {
    let message = await userService.createNewUser(req.body);
    return res.status(200).json(message);
}


let handleDeleteUser = async (req, res) => {
    if(!req.body.id){
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required parameter'
        })  
    }
    let message = await userService.deleteUser(req.body.id);
    return res.status(200).json(message);
}

let handleEditUser =async (req, res) => {
    let data = req.body;//lay tat ca input editCRUD.ejs
    let message = await userService.updateUserData(data); //lay lai tat ca danh sach moi
    return res.status(200).json(message);
   
}

module.exports = {
    handleLogin: handleLogin,
    handleGetAllUsers, handleGetAllUsers,
    handleCreateUser: handleCreateUser,
    handleDeleteUser:handleDeleteUser,
    handleEditUser: handleEditUser

}