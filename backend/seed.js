const bcrypt = require('bcryptjs');
const { db } = require('./config/firebase');

const seedData = async () => {
    try {
        console.log('Clearing existing data...');

        // Clear Users
        const usersSnapshot = await db.collection('users').get();
        if (!usersSnapshot.empty) {
            const batch = db.batch();
            usersSnapshot.docs.forEach(doc => batch.delete(doc.ref));
            await batch.commit();
            console.log('Deleted existing users.');
        }

        // Clear Tasks
        const tasksSnapshot = await db.collection('tasks').get();
        if (!tasksSnapshot.empty) {
            const batch = db.batch();
            tasksSnapshot.docs.forEach(doc => batch.delete(doc.ref));
            await batch.commit();
            console.log('Deleted existing tasks.');
        }

        // Clear Counter
        await db.collection('taskCounter').doc('tasks').delete();

        console.log('Seeding new data...');

        // 1. Create specific Admin
        const salt = await bcrypt.genSalt(10);
        const adminPass = await bcrypt.hash('Sahil@123', salt);

        await db.collection('users').add({
            fullName: 'Sahil Admin',
            email: 'sahil.l@admin.com',
            password: adminPass,
            role: 'admin',
            createdAt: new Date().toISOString()
        });
        console.log('Created Admin: sahil.l@admin.com');

        // 2. Create 5 Real Users
        const names = [
            'Rahul Sharma',
            'Priya Patel',
            'Amit Verma',
            'Sneha Gupta',
            'Vikram Singh'
        ];

        const userPass = await bcrypt.hash('User@123', salt);
        const userIds = [];

        for (const name of names) {
            const email = `${name.toLowerCase().replace(' ', '.')}@taskmanager.com`;
            const docRef = await db.collection('users').add({
                fullName: name,
                email,
                password: userPass,
                role: 'user',
                createdAt: new Date().toISOString()
            });
            userIds.push({ id: docRef.id, name, email });
            console.log(`Created User: ${email}`);
        }

        // 3. Create Sample Tasks (2 per user)
        const tasks = [
            { title: 'Market Research', desc: 'Analyze competitor pricing' },
            { title: 'UI Design', desc: 'Create mocks for mobile app' },
            { title: 'Backend API', desc: 'Implement user auth' },
            { title: 'QA Testing', desc: 'Bug hunting in staging' },
            { title: 'Client Meeting', desc: 'Discuss project roadmap' },
            { title: 'Documentation', desc: 'Write technical specs' },
            { title: 'Team Building', desc: 'Organize Friday lunch' },
            { title: 'Bug Fixes', desc: 'Resolve critical issue #404' },
            { title: 'Security Audit', desc: 'Check for JWT vulnerabilities' },
            { title: 'Optimization', desc: 'Improve page load speed' }
        ];

        for (let i = 0; i < tasks.length; i++) {
            const user = userIds[i % userIds.length];
            await db.collection('tasks').add({
                taskId: `TSK${String(i + 1).padStart(3, '0')}`,
                title: tasks[i].title,
                description: tasks[i].desc,
                status: i % 3 === 0 ? 'Pending' : (i % 3 === 1 ? 'In Progress' : 'Completed'),
                assignedUserId: user.id,
                assignedUserName: user.name,
                assignedBy: 'Sahil Admin',
                assignedByUserId: 'admin_sahil_id',
                createdAt: new Date().toISOString()
            });
        }

        // Initialize counter
        await db.collection('taskCounter').doc('tasks').set({ lastTaskNumber: 10 });

        console.log('\n--- CREDENTIALS ---');
        console.log('Admin: sahil.l@admin.com / Sahil@123');
        userIds.forEach(u => {
            console.log(`User:  ${u.email} / User@123`);
        });
        console.log('-------------------\n');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
