/**
 * @swagger
 * components:
 *   schemas:
 *     Treatment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique ID of the treatment
 *         patient:
 *           type: string
 *           description: The ID of the patient undergoing the treatment
 *         doctor:
 *           type: string
 *           description: The ID of the doctor administering the treatment
 *         hospital:
 *           type: string
 *           description: The ID of the hospital where the treatment is being performed
 *         polyclinic:
 *           type: string
 *           description: The polyclinic where the treatment is being administered
 *         diagnosis:
 *           type: string
 *           description: The diagnosis related to the treatment
 *         prescription:
 *           type: string
 *           description: The ID of the prescription associated with the treatment
 *         treatmentdetails:
 *           type: string
 *           description: Detailed description of the treatment
 *         treatmentoutcome:
 *           type: string
 *           description: The outcome of the treatment
 *         time:
 *           type: string
 *           description: The time when the treatment was administered
 *         status:
 *           type: string
 *           description: The status of the treatment (e.g., "completed", "pending")
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the treatment record was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the treatment record was last updated
 *       required:
 *         - patient
 *         - doctor
 *         - hospital
 *         - polyclinic
 *         - diagnosis
 *         - prescription
 *         - treatmentdetails
 *         - treatmentoutcome
 *         - time
 *         - status
 */
