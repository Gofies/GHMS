/**
 * @swagger
 * /api/v1/patient/auth/signup:
 *   post:
 *     summary: Register a new patient
 *     tags:
 *       - Patient Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - surname
 *               - email
 *               - password
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *                 description: The first name of the patient
 *               surname:
 *                 type: string
 *                 description: The surname of the patient
 *               email:
 *                 type: string
 *                 description: The email of the patient
 *               password:
 *                 type: string
 *                 description: The password for the patient's account
 *               phone:
 *                 type: string
 *                 description: The phone number of the patient
 *               gender:
 *                 type: string
 *                 description: The gender of the patient
 *               birthdate:
 *                 type: string
 *                 format: date
 *                 description: The birthdate of the patient
 *               nationality:
 *                 type: string
 *                 description: The nationality of the patient
 *     responses:
 *       201:
 *         description: Patient registered successfully
 *       400:
 *         description: Invalid input
 *       409:
 *         description: Email already exists
 */



/**
 * @swagger
 * /api/v1/patient/auth/change-password:
 *   put:
 *     summary: Change the password for the logged-in patient
 *     tags:
 *       - Patient Authentication
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 description: The current password of the patient
 *               newPassword:
 *                 type: string
 *                 description: The new password to set for the patient
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid input (e.g., incorrect current password)
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Patient not found
 */

