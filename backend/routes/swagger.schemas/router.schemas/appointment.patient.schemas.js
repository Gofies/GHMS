/**
 * @swagger
 * /api/v1/patient/appointments:
 *   get:
 *     summary: Retrieve all appointments for the patient
 *     tags:
 *       - Patient Appointments
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of appointments for the patient
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
 * /api/v1/patient/appointments:
 *   post:
 *     summary: Create a new appointment for the patient
 *     tags:
 *       - Patient Appointments
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - doctorId
 *               - date
 *               - time
 *             properties:
 *               doctorId:
 *                 type: string
 *                 description: The ID of the doctor for the appointment
 *               date:
 *                 type: string
 *                 format: date
 *                 description: The date of the appointment
 *               time:
 *                 type: string
 *                 description: The time of the appointment
 *               reason:
 *                 type: string
 *                 description: The reason for the appointment (optional)
 *     responses:
 *       201:
 *         description: Appointment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */


/**
 * @swagger
 * /api/v1/patient/appointments/{id}:
 *   delete:
 *     summary: Cancel a specific appointment for the patient
 *     tags:
 *       - Patient Appointments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the appointment to be canceled
 *     responses:
 *       204:
 *         description: Appointment canceled successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Appointment not found
 */

/**
 * @swagger
 * /api/v1/patient/appointments/hospital-by-polyclinic:
 *   get:
 *     summary: Retrieve hospitals by polyclinic for the patient
 *     tags:
 *       - Patient Appointments
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of hospitals by polyclinic for the patient
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Hospital'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

