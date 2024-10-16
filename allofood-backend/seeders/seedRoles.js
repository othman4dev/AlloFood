const Role = require('../models/roleModel'); 

module.exports = async () => {
  try {
    await Role.deleteMany({});
    const roles = [
        { name: 'superAdmin' },
        { name: 'client' },
        { name: 'delivery' },
        { name: 'manager' }
    ];
    for (let role of roles) {
      await Role.create( role );
    }
    console.log('Roles seeded successfully');
  } catch (error) {
    console.error('Error seeding roles:', error);
  }
};