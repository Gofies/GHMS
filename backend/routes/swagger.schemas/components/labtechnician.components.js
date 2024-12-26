/**
 * @swagger
 * components:
 *   schemas:
 *     LabTechnician:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique ID of the lab technician
 *         name:
 *           type: string
 *           description: The lab technician's first name
 *         surname:
 *           type: string
 *           description: The lab technician's last name
 *         title:
 *           type: string
 *           description: The lab technician's title (e.g., "Dr.", "Mr.")
 *         email:
 *           type: string
 *           description: The lab technician's email address
 *         birthdate:
 *           type: string
 *           format: date
 *           description: The lab technician's birthdate
 *         phone:
 *           type: string
 *           description: The lab technician's phone number
 *         jobstartdate:
 *           type: string
 *           format: date
 *           description: The lab technician's job start date
 *         specialization:
 *           type: string
 *           description: The lab technician's specialization (e.g., "Pathology", "Clinical Chemistry")
 *         certificates:
 *           type: array
 *           items:
 *             type: string
 *           description: A list of certificates held by the lab technician
 *         hospital:
 *           type: string
 *           description: The ID of the hospital where the lab technician works
 *         role:
 *           type: string
 *           description: The lab technician's role (e.g., "Lab Technician", "Senior Lab Technician")
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the lab technician was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the lab technician was last updated
 *       required:
 *         - name
 *         - surname
 *         - title
 *         - email
 *         - birthdate
 *         - phone
 *         - jobstartdate
 *         - specialization
 *         - certificates
 *         - role
 */
