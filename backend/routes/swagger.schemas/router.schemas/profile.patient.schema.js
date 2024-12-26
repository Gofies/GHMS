/**
 * @swagger
 * /api/v1/patient/profile:
 *   get:
 *     summary: Retrieve the profile of the patient
 *     tags:
 *       - Patient Profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A profile of the patient
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: The name of the patient
 *                 surname:
 *                   type: string
 *                   description: The surname of the patient
 *                 email:
 *                   type: string
 *                   description: The email of the patient
 *                 phone:
 *                   type: string
 *                   description: The phone number of the patient
 *                 gender:
 *                   type: string
 *                   description: The gender of the patient
 *                 birthdate:
 *                   type: string
 *                   format: date
 *                   description: The birthdate of the patient
 *                 nationality:
 *                   type: string
 *                   description: The nationality of the patient
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */



/**
 * @swagger
 * /api/v1/patient/profile:
 *   put:
 *     summary: Update the profile of the patient
 *     tags:
 *       - Patient Profile
 *     security:
 *       - bearerAuth: []
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
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *                 description: The new name of the patient
 *               surname:
 *                 type: string
 *                 description: The new surname of the patient
 *               email:
 *                 type: string
 *                 description: The new email of the patient
 *               phone:
 *                 type: string
 *                 description: The new phone number of the patient
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
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */