/**
 * @swagger
 * /api/v1/patient/medical-record/lab-tests:
 *   get:
 *     summary: Retrieve lab tests for the patient
 *     tags:
 *       - Patient Medical Records
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of lab tests for the patient
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LabTest'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/patient/medical-record/other-tests:
 *   get:
 *     summary: Retrieve other tests for the patient
 *     tags:
 *       - Patient Medical Records
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of other tests for the patient
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OtherTest'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/patient/medical-record/diagnoses:
 *   get:
 *     summary: Retrieve diagnoses for the patient
 *     tags:
 *       - Patient Medical Records
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of diagnoses for the patient
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Diagnosis'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */