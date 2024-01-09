import db from '../models/index';
import CRUDService from '../services/CRUDService';

let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll();
        return res.render('homepage.ejs', {
            data: JSON.stringify(data)
        });
    } catch (error) {
        console.error(error);
    }   

}

let getCRUD = (req, res) => {
    return res.render('crud.ejs')
}

let postCRUD = async(req, res) => {
    let message = await CRUDService.createNewUser(req.body);
    console.log(message);
    return res.send('postCRUD form server'); 
}

let displayGetCRUD = async (req, res) => {
    let data = await CRUDService.getAllUser();
    console.log('--------------------------------');
    console.log(data);
    console.log('--------------------------------');
    
    return res.render('display-crud.ejs', {
        dataTable: data
    })
}

let getEditCRUD = async (req, res) => {
    let userId = req.query.id;
    if(userId){
        let userData = await CRUDService.getUserInfoById(userId);
        return res.render('editCRUD.ejs', {
            user: userData
        });

    }else{
        return res.send('users not found');
    }
}

let putCRUD = async (req, res) => {
    let data = req.body;//lay tat ca input editCRUD.ejs
    let allUsers = await CRUDService.updateUserData(data); //lay lai tat ca danh sach moi
    return res.render('display-crud.ejs', {
        dataTable: allUsers
    });
}

let deleteCRUD = async (req, res) => {
    let id = req.query.id;
    if(id){
        await CRUDService.deleteUserById(id);
        return res.send('Delete auser succeed')
    }else{
        return res.send('users not found')
    }
    
}

module.exports = {
    getHomePage: getHomePage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    displayGetCRUD: displayGetCRUD,
    getEditCRUD: getEditCRUD,
    putCRUD: putCRUD,
    deleteCRUD: deleteCRUD,
}