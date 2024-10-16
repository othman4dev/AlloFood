const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const Role = require("../models/roleModel");

module.exports = async () => {
  try {
    await User.deleteMany({});

    // Fetch roles from the database to get their ObjectIds
    const superAdminRole = await Role.findOne({ name: "superAdmin" });
    const clientRole = await Role.findOne({ name: "client" });
    const deliveryRole = await Role.findOne({ name: "delivery" });
    const managerRole = await Role.findOne({ name: "manager" });

    const users = [
        {
          name: "Manager",
          email: "manager@gmail.com",
          phone: "0123456789",
          password: await bcrypt.hash("123456", 10),
          role: managerRole._id, // Assign role ObjectId
          is_verified: false,
          lastLogin: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          date: new Date()
        },
        {
          name: "Client",
          email: "client@gmail.com",
          phone: "0123456789",
          password: await bcrypt.hash("123456", 10),
          role: clientRole._id, // Assign role ObjectId
          is_verified: true,
          lastLogin: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          date: new Date()
        },
        {
          name: "Delivery",
          email: "delivery@gmail.com",
          phone: "0123456789",
          password: await bcrypt.hash("123456", 10),
          role: deliveryRole._id, // Assign role ObjectId
          is_verified: true,
          lastLogin: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          date: new Date()
        },
        {
          name: "SuperAdmin",
          email: "superadmin@gmail.com",
          phone: "0123456789",
          password: await bcrypt.hash("123456", 10),
          role: superAdminRole._id, // Assign role ObjectId
          is_verified: true,
          lastLogin: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          date: new Date()
        },
      ];

    await User.insertMany(users);
    console.log('Users seeded successfully');
  } catch (error) {
    console.error('Error seeding users:', error);
  }
};