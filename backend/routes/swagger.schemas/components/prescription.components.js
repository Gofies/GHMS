/**
 * @swagger
 * components:
 *   schemas:
 *     Prescription:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique ID of the prescription
 *         medicine:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the medicine
 *               quantity:
 *                 type: string
 *                 description: The quantity of the medicine prescribed
 *               time:
 *                 type: string
 *                 description: The time when the medicine should be taken
 *               form:
 *                 type: string
 *                 description: The form of the medicine (e.g., tablet, liquid)
 *           description: A list of medicines prescribed in the prescription
 *         status:
 *           type: string
 *           description: The status of the prescription (e.g., active, completed, expired)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the prescription was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the prescription was last updated
 *       required:
 *         - medicine
 *         - status
 */
