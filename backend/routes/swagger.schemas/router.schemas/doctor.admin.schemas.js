/**
 * @swagger
 * /api/v1/admin/doctor/{id}:
 *   get:
 *     summary: Retrieve a single doctor by ID
 *     tags:
 *       - Doctors
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The doctor's ID
 *     responses:
 *       200:
 *         description: A doctor object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Doctor'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Doctor not found
 */

/**
 * @swagger
 * /api/v1/admin/doctor:
 *   get:
 *     summary: Retrieve a list of doctors
 *     tags:
 *       - Doctors
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of doctors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Doctor'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/admin/doctor:
 *   post:
 *     summary: Create a new doctor
 *     tags:
 *       - Doctors
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DoctorCreate'
 *     responses:
 *       201:
 *         description: Doctor created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Doctor'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */


/**
 * @swagger
 * /api/v1/admin/doctor/{id}:
 *   put:
 *     summary: Update a doctor by ID
 *     tags:
 *       - Doctors
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The doctor's ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateDoctor'
 *     responses:
 *       200:
 *         description: Doctor updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Doctor'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Doctor not found
 */


/**
 * @swagger
 * /api/v1/admin/doctor/{id}:
 *   delete:
 *     summary: Delete a doctor by ID
 *     tags:
 *       - Doctors
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The doctor's ID
 *     responses:
 *       200:
 *         description: Doctor deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Doctor not found
 */