import { where } from "sequelize";
import db from "../models/index";
import bcrypt from 'bcrypt';

const salt = bcrypt.genSaltSync(10);
let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
        let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (error) {
            reject(error);
        }
    })
}

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};

            let isExists = await checkUserEmail(email);
            if (isExists) {
                let user = await db.User.findOne({
                    attributes: ['email', 'roleid', 'password'],
                    where: { email: email },
                    raw: true
                });
                if (user) {
                    // Compare password
        
                    let check = await bcrypt.compare(password, user.password); // Compare provided password with hashed password in the database
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = "OK";
                        delete user.password;
                        userData.user = user;
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = "Wrong password";
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = `User not found`;
                }
            } else {
                userData.errCode = 1;
                userData.errMessage = `Email does not exist in the system. Please try another email!`;
            }
            resolve(userData);
        } catch (error) {
            reject(error);
        }
    });
};


let checkUserEmail =(userEmail) => {
    return new Promise(async(resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail}
            })
            if (user) {
                resolve(true);
            }else{
                resolve(false);
            }
        } catch (error) {
            reject(error);
        }
    })
}

let getAllUsers = (userId) => {
    return new Promise( async(resolve, reject) => {
        try {
            let users = '';
            if(userId == 'ALL'){
                users = await db.User.findAll({
                    attributes:{
                        exclude: ['password']
                    }
                    
                });
            }
            if(userId && userId !== 'ALL'){
                users = await db.User.findOne({
                    where: {id: userId}
                })
            }
            resolve(users);
        } catch (error) {
            reject(error)
        }
    })

}


let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //check email is exist???
            let check = await checkUserEmail(data.email);
            if (check === true) {
                resolve({
                    errCode: 1,
                    message: 'Your email is already in used. Plz try another email!'
                });
            }
            else {
                let hashPasswordFromBcrypt = await hashUserPassword(data.password);
                await db.User.create({
                    email: data.email,
                    password: hashPasswordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phoneNumber: data.phoneNumber,
                    gender: data.gender === "1" ? true : false,
                    roleId: data.roleId,
                })
                resolve({
                    errCode: 0,
                    message: 'Ok'
                });
            }
        } catch (e) {
            reject(e);
        }
    })
}

let deleteUser = (userId) => {
    return new Promise(async(resolve, reject) => {
        let foundUser = await db.User.findOne({
            where: {id: userId}
        })
        if(!foundUser){
            resolve({errCode:2,
                    errMessage: `User isn't exist in database`
            })
        }

        await db.User.destroy({
            where: {id: userId}
        })

        resolve({
            errCode: 0,
            errMessage: `User deleted successfully`
        })
    })
}

let updateUserData = (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            if(!data){
                return resolve({
                    errCode:2,
                    errMessage: 'missing required parameter'
                })
            }
            let user = await db.User.findOne({
                where: {id: data.id},
                raw: false
            })
            if(user)
            {
                user.firstName = data.firstName,
                user.lastName = data.lastName,
                user.address = data.address
                await user.save();

                resolve({
                    errCode: 0,
                    errMessage: 'Update successful'
                });
            }else{
                resolve({
                    errCode: 1,
                    errMessage: "user not found"
                });
            }
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    updateUserData: updateUserData
}