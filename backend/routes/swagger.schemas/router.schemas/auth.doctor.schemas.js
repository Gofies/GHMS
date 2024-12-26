/**
 * @swagger
 * /api/v1/doctor/auth/change-password:
 *   put:
 *     summary: Change the password for the logged-in user
 *     tags:
 *       - Users
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
 *                 description: The user's current password
 *               newPassword:
 *                 type: string
 *                 description: The new password to be set
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid input (e.g., incorrect current password)
 *       401:
 *         description: Unauthorized (e.g., invalid token)
 *       500:
 *         description: Internal server error
 */