/**
 * @swagger
 * /api/v1/patient/upcoming-appointments:
 *   get:
 *     summary: Retrieve upcoming appointments for the patient
 *     tags:
 *       - Patient Appointments
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of upcoming appointments for the patient
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /api/v1/patient/recent-appointments:
 *   get:
 *     summary: Retrieve recent appointments for the patient
 *     tags:
 *       - Patient Appointments
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of recent appointments for the patient
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */