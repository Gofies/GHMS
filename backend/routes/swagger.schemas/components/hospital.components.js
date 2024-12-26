/**
 * @swagger
 * components:
 *   schemas:
 *     Hospital:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique ID of the hospital
 *         name:
 *           type: string
 *           description: The name of the hospital
 *         address:
 *           type: string
 *           description: The address of the hospital
 *         establishmentdate:
 *           type: string
 *           format: date
 *           description: The date the hospital was established
 *         phone:
 *           type: string
 *           description: The phone number of the hospital
 *         email:
 *           type: string
 *           description: The email address of the hospital
 *         polyclinics:
 *           type: array
 *           items:
 *             type: string
 *           description: A list of polyclinic IDs associated with the hospital
 *         doctors:
 *           type: array
 *           items:
 *             type: string
 *           description: A list of doctor IDs working at the hospital
 *         labTechnicians:
 *           type: array
 *           items:
 *             type: string
 *           description: A list of lab technician IDs working at the hospital
 *         itTechnicians:
 *           type: array
 *           items:
 *             type: string
 *           description: A list of IT technician IDs working at the hospital
 *         appointments:
 *           type: array
 *           items:
 *             type: string
 *           description: A list of appointment IDs associated with the hospital
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the hospital was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the hospital information was last updated
 *       required:
 *         - name
 *         - address
 *         - establishmentdate
 *         - phone
 *         - email
 *         - polyclinics
 *         - doctors
 *         - labTechnicians
 *         - itTechnicians
 *         - appointments
 */
