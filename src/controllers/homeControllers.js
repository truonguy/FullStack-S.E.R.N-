
let getHomePage = (req, res) => {
    return res.render("homepage.ejs");
}

// Object: {
//     key: '',
//     value: ''
// }

module.exports = {
    getHomePage: getHomePage,
}