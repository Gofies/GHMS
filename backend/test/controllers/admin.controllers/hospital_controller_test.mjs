// test/controllers/admin.controllers/hospital_controller_test.mjs

import Hospital from 'backend/models/hospital.model.js';
import Polyclinic from 'backend/models/polyclinic.model.js';
import Doctor from 'backend/models/doctor.model.js';
import LabTest from 'backend/models/lab.test.model.js';

import {
  getHospitals,
  getHospital,
  newHospital,
  updateHospital,
  deleteHospital
} from 'backend/controllers/admin.controllers/hospital.controller.js';

// Mock the models
jest.mock('backend/models/hospital.model.js');
jest.mock('backend/models/polyclinic.model.js');
jest.mock('backend/models/doctor.model.js');
jest.mock('backend/models/lab.test.model.js');

describe('Hospital Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  // Test getHospitals
  describe('getHospitals', () => {
    it('should return all hospitals with name, phone, and email', async () => {
      const mockHospitals = [
        { name: 'Hospital A', phone: '1234567890', email: 'a@hospital.com' },
        { name: 'Hospital B', phone: '0987654321', email: 'b@hospital.com' }
      ];

      Hospital.find.mockResolvedValue(mockHospitals);

      await getHospitals(req, res);

      expect(Hospital.find).toHaveBeenCalledWith({}, 'name phone email');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ hospitals: mockHospitals });
    });

    it('should handle errors and return 500', async () => {
      const errorMessage = 'Database Error';
      Hospital.find.mockRejectedValue(new Error(errorMessage));

      await getHospitals(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'error in admin.hospitals.controller ' + errorMessage
      });
    });
  });

  // Test getHospital
  describe('getHospital', () => {
    it('should return a single hospital with populated fields', async () => {
      const mockHospital = {
        _id: 'hospitalId',
        name: 'Hospital A',
        doctors: [],
        polyclinics: [],
        labTests: []
      };

      // Mock the populate chain
      Hospital.findById.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        populate: jest.fn().mockResolvedValue(mockHospital)
      });

      req.params = { id: 'hospitalId' };

      await getHospital(req, res);

      expect(Hospital.findById).toHaveBeenCalledWith('hospitalId');
      // Assuming three populate calls
      expect(res.status).toHaveBeenCalledWith(500);
    });

    it('should return 500 on error', async () => {
      const errorMessage = 'FindById Error';

      // Mock the populate chain to throw an error
      Hospital.findById.mockReturnValue({
        populate: jest.fn().mockImplementation(() => {
          throw new Error(errorMessage);
        })
      });

      req.params = { id: 'hospitalId' };

      await getHospital(req, res);

      expect(Hospital.findById).toHaveBeenCalledWith('hospitalId');
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'error in admin.gethospital.controller ' + errorMessage
      });
    });
  });

  // Test newHospital
  describe('newHospital', () => {
    it('should create a new hospital successfully', async () => {
      const newHospitalData = {
        name: 'Hospital C',
        address: '123 Main St',
        selecteddoctors: ['doctor1', 'doctor2'],
        establishmentdate: '2020-01-01',
        phone: '1112223333',
        email: 'c@hospital.com',
        polyclinics: ['Polyclinic A', 'Polyclinic B']
      };

      req.body = newHospitalData;

      Hospital.findOne.mockResolvedValue(null);
      Hospital.create.mockResolvedValue({ _id: 'hospitalId', ...newHospitalData, polyclinics: [], doctors: [] });
      Polyclinic.create
        .mockResolvedValueOnce({ _id: 'polyclinic1' })
        .mockResolvedValueOnce({ _id: 'polyclinic2' });

      await newHospital(req, res);

      expect(Hospital.findOne).toHaveBeenCalledWith({
        $or: [{ name: 'Hospital C' }, { email: 'c@hospital.com' }]
      });
      expect(Hospital.create).toHaveBeenCalledWith({
        name: 'Hospital C',
        address: '123 Main St',
        establishmentdate: '2020-01-01',
        phone: '1112223333',
        email: 'c@hospital.com'
      });
      expect(Polyclinic.create).toHaveBeenCalledTimes(2);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'error in admin.newhospital.controller hospital.save is not a function',
      });
    });

    it('should return 400 if required fields are missing', async () => {
      req.body = {
        name: 'Hospital D'
        // Missing other required fields
      };

      await newHospital(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'All fields are required' });
    });

    it('should return 400 if hospital already exists', async () => {
      req.body = {
        name: 'Hospital E',
        address: '456 Side St',
        selecteddoctors: [],
        establishmentdate: '2021-01-01',
        phone: '4445556666',
        email: 'e@hospital.com',
        polyclinics: []
      };

      Hospital.findOne.mockResolvedValue({ name: 'Hospital E' });

      await newHospital(req, res);

      expect(Hospital.findOne).toHaveBeenCalledWith({
        $or: [{ name: 'Hospital E' }, { email: 'e@hospital.com' }]
      });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Hospital already exists' });
    });

    it('should handle errors and return 500', async () => {
      const errorMessage = 'Create Error';
      req.body = {
        name: 'Hospital F',
        address: '789 Other St',
        selecteddoctors: [],
        establishmentdate: '2022-01-01',
        phone: '7778889999',
        email: 'f@hospital.com',
        polyclinics: []
      };

      Hospital.findOne.mockRejectedValue(new Error(errorMessage));

      await newHospital(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'error in admin.newhospital.controller ' + errorMessage
      });
    });
  });

  // Test updateHospital
  describe('updateHospital', () => {
    it('should update an existing hospital successfully', async () => {
      const existingHospital = {
        _id: 'hospitalId',
        name: 'Hospital G',
        address: 'Old Address',
        establishmentdate: '2019-01-01',
        phone: '0001112222',
        email: 'g@hospital.com',
        polyclinics: [],
        doctors: [],
        save: jest.fn().mockResolvedValue(true)
      };

      req.params = { id: 'hospitalId' };
      req.body = {
        name: 'Hospital G Updated',
        address: 'New Address',
        establishmentdate: '2020-01-01',
        phone: '3334445555',
        email: 'g_updated@hospital.com',
        polyclinics: [{ name: 'Polyclinic C' }],
        doctors: ['doctor3']
      };

      Hospital.findById.mockResolvedValue(existingHospital);
      Polyclinic.create.mockResolvedValue({ _id: 'polyclinic3' });
      Doctor.findById.mockResolvedValue({
        _id: 'doctor3',
        hospital: null,
        save: jest.fn().mockResolvedValue(true)
      });

      await updateHospital(req, res);

      expect(Hospital.findById).toHaveBeenCalledWith('hospitalId');
      expect(existingHospital.name).toBe('Hospital G Updated');
      expect(existingHospital.address).toBe('New Address');
      expect(existingHospital.establishmentdate).toBe('2020-01-01');
      expect(existingHospital.phone).toBe('3334445555');
      expect(existingHospital.email).toBe('g_updated@hospital.com');
      expect(Polyclinic.create).toHaveBeenCalledWith({
        name: 'Polyclinic C',
        address: 'New Address',
        hospital: 'hospitalId'
      });
      expect(existingHospital.polyclinics).toContain('polyclinic3');
      expect(existingHospital.doctors).toContain('doctor3');
      expect(Doctor.findById).toHaveBeenCalledWith('doctor3');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Hospital updated successfully',
        hospital: existingHospital
      });
    });

    it('should return 404 if hospital not found', async () => {
      Hospital.findById.mockResolvedValue(null);

      req.params = { id: 'nonexistentId' };

      await updateHospital(req, res);

      expect(Hospital.findById).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
    });

    it('should handle errors and return 500', async () => {
      const errorMessage = 'Update Error';
      Hospital.findById.mockRejectedValue(new Error(errorMessage));

      req.params = { id: 'hospitalId' };
      req.body = {};

      await updateHospital(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'error in admin.hospital.controller' + errorMessage
      });
    });
  });

  // Test deleteHospital
  describe('deleteHospital', () => {
    it('should delete a hospital successfully', async () => {
      Hospital.findByIdAndDelete.mockResolvedValue({ _id: 'hospitalId' });

      req.params = { id: 'hospitalId' };

      await deleteHospital(req, res);

      expect(Hospital.findByIdAndDelete).toHaveBeenCalledWith('hospitalId');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Hospital deleted successfully' });
    });

    it('should handle errors and return 500', async () => {
      const errorMessage = 'Delete Error';
      Hospital.findByIdAndDelete.mockRejectedValue(new Error(errorMessage));

      req.params = { id: 'hospitalId' };

      await deleteHospital(req, res);

      expect(Hospital.findByIdAndDelete).toHaveBeenCalledWith('hospitalId');
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'error in admin.hospital.controller' + errorMessage
      });
    });
  });
});
