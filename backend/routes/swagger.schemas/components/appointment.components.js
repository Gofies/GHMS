/**
 * @swagger
 * components:
 *   schemas:
 *     Appointment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique ID of the appointment
 *         patient:
 *           type: string
 *           description: The ID of the patient associated with the appointment
 *         doctor:
 *           type: string
 *           description: The ID of the doctor associated with the appointment
 *         hospital:
 *           type: string
 *           description: The ID of the hospital associated with the appointment (optional)
 *         polyclinic:
 *           type: string
 *           description: The ID of the polyclinic associated with the appointment (optional)
 *         treatment:
 *           type: array
 *           items:
 *             type: string
 *           description: A list of treatments associated with the appointment (optional)
 *         type:
 *           type: string
 *           description: The type of appointment (e.g., doctor-patient, lab test)
 *         date:
 *           type: string
 *           format: date
 *           description: The date of the appointment
 *         time:
 *           type: string
 *           description: The time of the appointment
 *         status:
 *           type: string
 *           description: The status of the appointment (e.g., confirmed, pending, cancelled)
 *         tests:
 *           type: array
 *           items:
 *             type: string
 *           description: A list of lab tests associated with the appointment (optional)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the appointment was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the appointment was last updated
 *       required:
 *         - patient
 *         - doctor
 *         - type
 *         - date
 *         - time
 *         - status
 */
