/**
 * @swagger
 * components:
 *   schemas:
 *     LabTest:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique ID of the lab test
 *         patient:
 *           type: string
 *           description: The ID of the patient associated with the lab test
 *         doctor:
 *           type: string
 *           description: The ID of the doctor who ordered the lab test
 *         hospital:
 *           type: string
 *           description: The ID of the hospital where the lab test was performed
 *         polyclinic:
 *           type: string
 *           description: The ID of the polyclinic where the lab test was performed
 *         testtype:
 *           type: string
 *           description: The type of the test (e.g., "doctor", "lab", "radiology")
 *         resultdate:
 *           type: string
 *           format: date
 *           description: The date when the lab test result was available
 *         result:
 *           type: string
 *           description: The result of the lab test
 *         status:
 *           type: string
 *           description: The status of the lab test (e.g., "completed", "pending")
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the lab test record was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the lab test record was last updated
 *       required:
 *         - patient
 *         - doctor
 *         - hospital
 *         - polyclinic
 *         - testtype
 *         - resultdate
 *         - result
 *         - status
 */
