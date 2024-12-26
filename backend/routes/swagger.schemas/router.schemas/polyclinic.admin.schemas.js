/**
 * @swagger
 * /api/v1/admin/polyclinic/{id}:
 *   get:
 *     summary: Retrieve a single polyclinic by ID
 *     tags:
 *       - Polyclinics
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the polyclinic
 *     responses:
 *       200:
 *         description: A polyclinic object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Polyclinic'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Polyclinic not found
 */


/**
 * @swagger
 * /api/v1/admin/polyclinic:
 *   post:
 *     summary: Create a new polyclinic
 *     tags:
 *       - Polyclinics
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PolyclinicCreate'
 *     responses:
 *       201:
 *         description: Polyclinic created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Polyclinic'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */


/**
 * @swagger
 * /api/v1/admin/polyclinic/{id}:
 *   put:
 *     summary: Update an existing polyclinic
 *     tags:
 *       - Polyclinics
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the polyclinic to be updated
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PolyclinicUpdate'
 *     responses:
 *       200:
 *         description: Polyclinic updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Polyclinic'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Polyclinic not found
 */


/**
 * @swagger
 * /api/v1/admin/polyclinics/{id}:
 *   delete:
 *     summary: Delete a polyclinic
 *     tags:
 *       - Polyclinics
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the polyclinic to be deleted
 *     responses:
 *       204:
 *         description: Polyclinic deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Polyclinic not found
 */