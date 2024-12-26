/**
 * @swagger
 * /api/v1/doctor/patient/{patientId}/prescriptions:
 *   post:
 *     summary: Create a new prescription for a specific patient
 *     tags:
 *       - Doctor Patients
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: patientId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the patient
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - medicine
 *               - status
 *             properties:
 *               medicine:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - name
 *                     - quantity
 *                     - time
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: The name of the medicine
 *                     quantity:
 *                       type: string
 *                       description: The quantity of the medicine
 *                     time:
 *                       type: string
 *                       description: The time when the medicine should be taken
 *                     form:
 *                       type: string
 *                       description: The form of the medicine (optional)
 *               status:
 *                 type: string
 *                 description: The status of the prescription (e.g., active, completed)
 *     responses:
 *       201:
 *         description: Prescription created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Prescription'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v1/doctor/patient/{patientId}/prescriptions/{prescriptionId}:
 *   put:
 *     summary: Update an existing prescription for a specific patient
 *     tags:
 *       - Doctor Patients
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: patientId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the patient
 *       - name: prescriptionId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the prescription
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - medicine
 *               - status
 *             properties:
 *               medicine:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - name
 *                     - quantity
 *                     - time
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: The name of the medicine
 *                     quantity:
 *                       type: string
 *                       description: The quantity of the medicine
 *                     time:
 *                       type: string
 *                       description: The time when the medicine should be taken
 *                     form:
 *                       type: string
 *                       description: The form of the medicine (optional)
 *               status:
 *                 type: string
 *                 description: The status of the prescription (e.g., active, completed)
 *     responses:
 *       200:
 *         description: Prescription updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Prescription'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Prescription or patient not found
 */

/**
 * @swagger
 * /api/v1/doctor/patient/{patientId}/prescriptions/{prescriptionId}:
 *   delete:
 *     summary: Delete a prescription for a specific patient
 *     tags:
 *       - Doctor Patients
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: patientId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the patient
 *       - name: prescriptionId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the prescription to be deleted
 *     responses:
 *       204:
 *         description: Prescription deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Prescription or patient not found
 */



/**
 * @swagger
 * /api/v1/doctor/patient/{patientId}/prescriptions:
 *   get:
 *     summary: Retrieve prescriptions for a specific patient
 *     tags:
 *       - Doctor Patients
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: patientId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the patient
 *     responses:
 *       200:
 *         description: A list of prescriptions for the patient
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Prescription'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Patient not found
 */

/**
 * @swagger
 * /api/v1/doctor/patient/{patientId}/family-history:
 *   get:
 *     summary: Retrieve family history for a specific patient
 *     tags:
 *       - Doctor Patients
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: patientId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the patient
 *     responses:
 *       200:
 *         description: A list of family history for the patient
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FamilyHistory'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Patient not found
 */

/**
 * @swagger
 * /api/v1/doctor/patient/{patientId}/diagnosis-history:
 *   get:
 *     summary: Retrieve diagnosis history for a specific patient
 *     tags:
 *       - Doctor Patients
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: patientId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the patient
 *     responses:
 *       200:
 *         description: A list of diagnosis history for the patient
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Diagnosis'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Patient not found
 */


/**
 * @swagger
 * /api/v1/doctor/patient/{patientId}/appointment-history:
 *   get:
 *     summary: Retrieve appointment history for a specific patient
 *     tags:
 *       - Doctor Patients
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: patientId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the patient
 *     responses:
 *       200:
 *         description: A list of appointment history for the patient
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Patient not found
 */

/**
 * @swagger
 * /api/v1/doctor/patient:
 *   get:
 *     summary: Retrieve a list of patients
 *     tags:
 *       - Doctor Patients
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of patients
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Patient'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */