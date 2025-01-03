import { getPolyclinics, newPolyclinic, updatePolyclinic, deletePolyclinic } from 'backend/controllers/admin.controllers/polyclinic.controller.js';
import Polyclinic from '../../../models/polyclinic.model.js';
import Hospital from '../../../models/hospital.model.js';
import Doctor from '../../../models/doctor.model.js';

jest.mock('../../../models/polyclinic.model.js');
jest.mock('../../../models/hospital.model.js');
jest.mock('../../../models/doctor.model.js');

describe('Polyclinic Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getPolyclinics', () => {
      it('should return polyclinics for a valid hospital ID', async () => {
          const mockHospital = {
              polyclinics: [{ name: 'Cardiology' }],
          };

          // Ensure mockResolvedValue behaves correctly
          Hospital.findById.mockImplementation(() => ({
              select: jest.fn().mockReturnThis(),
              populate: jest.fn().mockResolvedValue(mockHospital),
          }));

          const req = { params: { id: 'hospitalId123' } };
          const res = {
              status: jest.fn().mockReturnThis(),
              json: jest.fn(),
          };

          await getPolyclinics(req, res);

          expect(Hospital.findById).toHaveBeenCalledWith('hospitalId123');
          expect(res.status).toHaveBeenCalledWith(200);
      });

      it('should return a 500 error on failure', async () => {
          Hospital.findById.mockImplementation(() => ({
              select: jest.fn().mockReturnThis(),
              populate: jest.fn().mockRejectedValue(new Error('Database error')),
          }));

          const req = { params: { id: 'hospitalId123' } };
          const res = {
              status: jest.fn().mockReturnThis(),
              json: jest.fn(),
          };

          await getPolyclinics(req, res);

          expect(res.status).toHaveBeenCalledWith(500);
          expect(res.json).toHaveBeenCalledWith({
              message: 'Error in admin.polyclinic.controller: Database error',
          });
      });
    });

    describe('newPolyclinic', () => {
        it('should create a new polyclinic and associate it with a hospital', async () => {
            const mockHospital = { _id: 'hospitalId123', polyclinics: [], save: jest.fn() };
            const mockPolyclinic = { _id: 'polyclinicId123', save: jest.fn() };

            Hospital.findById.mockResolvedValue(mockHospital);
            Polyclinic.create.mockResolvedValue(mockPolyclinic);

            const req = {
                body: {
                    name: 'Cardiology',
                    hospitalId: 'hospitalId123',
                    doctorIds: ['doctorId1', 'doctorId2'],
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await newPolyclinic(req, res);

            expect(Hospital.findById).toHaveBeenCalledWith('hospitalId123');
            expect(Polyclinic.create).not.toHaveBeenCalled()
            expect(res.status).toHaveBeenCalledWith(500);
        });

        it('should return a 400 error if required fields are missing', async () => {
            const req = { body: { name: undefined, hospitalId: undefined } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await newPolyclinic(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'All required fields must be provided' });
        });
    });

    describe('updatePolyclinic', () => {
        it('should update an existing polyclinic', async () => {
            const mockPolyclinic = { name: 'Old Name', doctors: [], save: jest.fn() };
            Polyclinic.findById.mockResolvedValue(mockPolyclinic);

            const req = {
                params: { id: 'polyclinicId123' },
                body: { name: 'New Name', doctors: ['doctorId1'] },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await updatePolyclinic(req, res);

            expect(Polyclinic.findById).toHaveBeenCalledWith('polyclinicId123');
            expect(mockPolyclinic.save).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(500);
        });

        it('should return a 404 error if the polyclinic does not exist', async () => {
            Polyclinic.findById.mockResolvedValue(null);

            const req = { params: { id: 'invalidId' }, body: {} };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await updatePolyclinic(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('deletePolyclinic', () => {
        it('should delete a polyclinic', async () => {
            Polyclinic.findByIdAndDelete.mockResolvedValue(true);

            const req = { params: { id: 'polyclinicId123' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await deletePolyclinic(req, res);

            expect(Polyclinic.findByIdAndDelete).toHaveBeenCalledWith('polyclinicId123');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Polyclinic deleted successfully' });
        });

        it('should return a 500 error on failure', async () => {
            Polyclinic.findByIdAndDelete.mockRejectedValue(new Error('Database error'));

            const req = { params: { id: 'polyclinicId123' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await deletePolyclinic(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'error in admin.deletepolyclinic.controller Database error',
            });
        });
    });
});
