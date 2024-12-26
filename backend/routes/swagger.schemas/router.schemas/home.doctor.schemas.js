/**
 * @swagger
 * /api/v1/doctor/:
 *   get:
 *     summary: Retrieve the doctor's home data
 *     tags:
 *       - Doctors
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A doctor's home data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 doctorId:
 *                   type: string
 *                   description: The unique ID of the doctor
 *                 name:
 *                   type: string
 *                   description: The doctor's name
 *                 appointments:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: A list of upcoming appointments
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */