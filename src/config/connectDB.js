const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('zauzia', 'root', null, {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
  port: 3307,
  password: '',
  logging: false
});

let connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Kết nối thành công đến cơ sở dữ liệu.');
  } catch (error) {
    console.error('Không thể kết nối đến cơ sở dữ liệu:', error);
  }
}

module.exports = connectDB;
