/**
 * @swagger
 * components:
 *   schemas:
 *     Polyclinic:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique ID of the polyclinic
 *         name:
 *           type: string
 *           description: The name of the polyclinic
 *         hospital:
 *           type: string
 *           description: The ID of the hospital that the polyclinic belongs to
 *         doctors:
 *           type: array
 *           items:
 *             type: string
 *           description: A list of doctor IDs associated with the polyclinic
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the polyclinic record was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the polyclinic record was last updated
 *       required:
 *         - name
 *         - hospital
 */
