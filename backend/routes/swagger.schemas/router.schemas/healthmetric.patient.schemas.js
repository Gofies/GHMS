/**
 * @swagger
 * /api/v1/patient/metrics:
 *   get:
 *     summary: Retrieve health metrics of the patient
 *     tags:
 *       - Patient Health Metrics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A patient's health metrics data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 weight:
 *                   type: number
 *                   description: The weight of the patient
 *                 height:
 *                   type: number
 *                   description: The height of the patient
 *                 bloodPressure:
 *                   type: string
 *                   description: The blood pressure of the patient
 *                 bloodSugar:
 *                   type: number
 *                   description: The blood sugar level of the patient
 *                 bloodType:
 *                   type: string
 *                   description: The blood type of the patient
 *                 heartRate:
 *                   type: number
 *                   description: The heart rate of the patient
 *                 allergies:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: List of the patient's allergies
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/patient/metrics/weight:
 *   put:
 *     summary: Update the weight of the patient
 *     tags:
 *       - Patient Health Metrics
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - weight
 *             properties:
 *               weight:
 *                 type: number
 *                 description: The new weight of the patient
 *     responses:
 *       200:
 *         description: Weight updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */


/**
 * @swagger
 * /api/v1/patient/metrics/height:
 *   put:
 *     summary: Update the height of the patient
 *     tags:
 *       - Patient Health Metrics
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - height
 *             properties:
 *               height:
 *                 type: number
 *                 description: The new height of the patient
 *     responses:
 *       200:
 *         description: Height updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */


/**
 * @swagger
 * /api/v1/patient/metrics/blood-pressure:
 *   put:
 *     summary: Update the blood pressure of the patient
 *     tags:
 *       - Patient Health Metrics
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bloodPressure
 *             properties:
 *               bloodPressure:
 *                 type: string
 *                 description: The new blood pressure of the patient
 *     responses:
 *       200:
 *         description: Blood pressure updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v1/patient/metrics/blood-sugar:
 *   put:
 *     summary: Update the blood sugar level of the patient
 *     tags:
 *       - Patient Health Metrics
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bloodSugar
 *             properties:
 *               bloodSugar:
 *                 type: number
 *                 description: The new blood sugar level of the patient
 *     responses:
 *       200:
 *         description: Blood sugar updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */


/**
 * @swagger
 * /api/v1/patient/metrics/blood-type:
 *   put:
 *     summary: Update the blood type of the patient
 *     tags:
 *       - Patient Health Metrics
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bloodType
 *             properties:
 *               bloodType:
 *                 type: string
 *                 description: The new blood type of the patient
 *     responses:
 *       200:
 *         description: Blood type updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v1/patient/metrics/heart-rate:
 *   put:
 *     summary: Update the heart rate of the patient
 *     tags:
 *       - Patient Health Metrics
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - heartRate
 *             properties:
 *               heartRate:
 *                 type: number
 *                 description: The new heart rate of the patient
 *     responses:
 *       200:
 *         description: Heart rate updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v1/patient/metrics/allergies:
 *   put:
 *     summary: Update the allergies of the patient
 *     tags:
 *       - Patient Health Metrics
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - allergies
 *             properties:
 *               allergies:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: A list of the patient's allergies
 *     responses:
 *       200:
 *         description: Allergies updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
