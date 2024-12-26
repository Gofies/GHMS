/**
 * @swagger
 * components:
 *   schemas:
 *     Doctor:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique ID of the doctor
 *         name:
 *           type: string
 *           description: The doctor's first name
 *         surname:
 *           type: string
 *           description: The doctor's last name
 *         title:
 *           type: string
 *           description: The doctor's title (e.g., "Prof. Dr.")
 *         email:
 *           type: string
 *           description: The doctor's email address
 *         password:
 *           type: string
 *           description: The doctor's password (encrypted)
 *         birthdate:
 *           type: string
 *           format: date
 *           description: The doctor's birthdate
 *         phone:
 *           type: string
 *           description: The doctor's phone number
 *         jobstartdate:
 *           type: string
 *           format: date
 *           description: The doctor's job start date
 *         degree:
 *           type: string
 *           description: The doctor's academic degree (e.g., "Doctorate")
 *         specialization:
 *           type: string
 *           description: The doctor's specialization (e.g., "Cardiology")
 *         hospital:
 *           type: string
 *           description: The ID of the hospital where the doctor works
 *         polyclinic:
 *           type: string
 *           description: The ID of the polyclinic where the doctor works (if applicable)
 *         appointments:
 *           type: array
 *           items:
 *             type: string
 *           description: A list of appointment IDs associated with the doctor
 *         role:
 *           type: string
 *           description: The doctor's role (e.g., "admin", "doctor")
 *         schedule:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 description: The specific date for the doctor's schedule
 *               timeSlots:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     time:
 *                       type: string
 *                       description: The time slot for the doctor (e.g., "08:00")
 *                     isFree:
 *                       type: boolean
 *                       description: Whether the time slot is available or not
 *           description: A schedule array for the doctor over the next 14 days
 *     DoctorCreate:
 *       type: object
 *       required:
 *         - name
 *         - surname
 *         - title
 *         - email
 *         - password
 *         - birthdate
 *         - phone
 *         - jobstartdate
 *         - degree
 *         - specialization
 *         - role
 *       properties:
 *         name:
 *           type: string
 *         surname:
 *           type: string
 *         title:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         birthdate:
 *           type: string
 *           format: date
 *         phone:
 *           type: string
 *         jobstartdate:
 *           type: string
 *           format: date
 *         degree:
 *           type: string
 *         specialization:
 *           type: string
 *         hospital:
 *           type: string
 *         polyclinic:
 *           type: string
 *         appointments:
 *           type: array
 *           items:
 *             type: string
 *         role:
 *           type: string
 *         schedule:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *               timeSlots:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     time:
 *                       type: string
 *                     isFree:
 *                       type: boolean
 */