/**
 * @swagger
 * components:
 *   schemas:
 *     Diagnosis:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique ID of the diagnosis
 *         condition:
 *           type: string
 *           description: The condition diagnosed
 *         description:
 *           type: string
 *           description: A detailed description of the diagnosis
 *         prescriptions:
 *           type: array
 *           items:
 *             type: string
 *           description: A list of prescription IDs associated with the diagnosis
 *         status:
 *           type: string
 *           description: The status of the diagnosis (e.g., confirmed, under observation)
 *         date:
 *           type: string
 *           format: date
 *           description: The date of the diagnosis
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the diagnosis was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the diagnosis was last updated
 *       required:
 *         - condition
 *         - description
 *         - prescriptions
 *         - status
 *         - date
 */
