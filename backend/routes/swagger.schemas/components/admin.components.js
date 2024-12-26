/**
 * @swagger
 * components:
 *   schemas:
 *     Admin:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique ID of the admin
 *         name:
 *           type: string
 *           description: The admin's first name
 *         surname:
 *           type: string
 *           description: The admin's last name
 *         email:
 *           type: string
 *           description: The admin's email address
 *         password:
 *           type: string
 *           description: The admin's password (encrypted)
 *         phone:
 *           type: string
 *           description: The admin's phone number
 *         role:
 *           type: string
 *           description: The admin's role (e.g., "superadmin", "admin")
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the admin was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the admin was last updated
 *       required:
 *         - name
 *         - surname
 *         - email
 *         - password
 *         - phone
 *         - role
 */
