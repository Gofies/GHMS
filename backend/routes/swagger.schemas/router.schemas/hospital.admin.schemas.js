/**
 * @swagger
 * /api/v1/admin/hospital:
 *   get:
 *     summary: Retrieve a list of hospitals
 *     tags:
 *       - Hospitals
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of hospitals
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


/**
 * @swagger
 * /api/admin/hospital/{id}:
 *   get:
 *     summary: Retrieve a single hospital by ID
 *     tags:
 *       - Hospitals
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the hospital
 *     responses:
 *       200:
 *         description: A hospital object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hospital'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Hospital not found
 */


/**
 * @swagger
 * /api/admin/hospital:
 *   post:
 *     summary: Create a new hospital
 *     tags:
 *       - Hospitals
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Hospital'
 *     responses:
 *       201:
 *         description: Hospital created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hospital'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */



/**
 * @swagger
 * /api/admin/hospital/{id}:
 *   put:
 *     summary: Update an existing hospital
 *     tags:
 *       - Hospitals
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the hospital to be updated
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Hospital'
 *     responses:
 *       200:
 *         description: Hospital updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hospital'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Hospital not found
 */


/**
 * @swagger
 * /api/admin/hospital/{id}:
 *   delete:
 *     summary: Delete a hospital
 *     tags:
 *       - Hospitals
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the hospital to be deleted
 *     responses:
 *       204:
 *         description: Hospital deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Hospital not found
 */