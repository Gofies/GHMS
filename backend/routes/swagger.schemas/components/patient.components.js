/**
 * @swagger
 * components:
 *   schemas:
 *     Patient:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique ID of the patient
 *         name:
 *           type: string
 *           description: The patient's first name
 *         surname:
 *           type: string
 *           description: The patient's last name
 *         gender:
 *           type: string
 *           description: The patient's gender
 *         email:
 *           type: string
 *           description: The patient's email address
 *         password:
 *           type: string
 *           description: The patient's password (encrypted)
 *         phone:
 *           type: string
 *           description: The patient's phone number
 *         emergencycontact:
 *           type: string
 *           description: The patient's emergency contact number
 *         birthdate:
 *           type: string
 *           format: date
 *           description: The patient's birthdate
 *         nationality:
 *           type: string
 *           description: The patient's nationality
 *         address:
 *           type: string
 *           description: The patient's address
 *         labtests:
 *           type: array
 *           items:
 *             type: string
 *           description: A list of lab test IDs associated with the patient
 *         appointments:
 *           type: array
 *           items:
 *             type: string
 *           description: A list of appointment IDs associated with the patient
 *         prescriptions:
 *           type: array
 *           items:
 *             type: string
 *           description: A list of prescription IDs associated with the patient
 *         diagnoses:
 *           type: array
 *           items:
 *             type: string
 *           description: A list of diagnosis IDs associated with the patient
 *         family:
 *           type: array
 *           items:
 *             type: string
 *           description: A list of family member IDs (patients) associated with the patient
 *         weight:
 *           type: number
 *           description: The patient's weight
 *         height:
 *           type: number
 *           description: The patient's height
 *         bloodpressure:
 *           type: string
 *           description: The patient's blood pressure
 *         bloodsugar:
 *           type: number
 *           description: The patient's blood sugar level
 *         bloodtype:
 *           type: string
 *           description: The patient's blood type
 *         allergies:
 *           type: array
 *           items:
 *             type: string
 *           description: A list of allergies the patient has
 *         heartrate:
 *           type: number
 *           description: The patient's heart rate
 *         role:
 *           type: string
 *           description: The patient's role (e.g., "patient", "admin")
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the patient record was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the patient record was last updated
 *       required:
 *         - name
 *         - surname
 *         - gender
 *         - email
 *         - password
 *         - phone
 *         - birthdate
 *         - nationality
 *         - role
 */
