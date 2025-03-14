import { getAllRoles } from '../../../lib/db-admin'; 

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const roles = await getAllRoles();
            res.status(200).json(roles);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch roles' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}