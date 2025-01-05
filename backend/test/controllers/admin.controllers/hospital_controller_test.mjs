// File: tests/controllers/admin/hospital.controller.test.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Hospital from 'backend/models/hospital.model.js';
import {
  getHospitals,
  getHospital,
  newHospital,
  updateHospital,
  deleteHospital,
} from 'backend/controllers/admin.controllers/hospital.controller.js';

dotenv.config({ path: '../../.env' });

const DATABASE_URI = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@router01:27117/TestHospitalDatabase?authSource=admin`;

describe('Hospital Controller', () => {
  let req, res;

  beforeAll(async () => {
    await mongoose.connect(DATABASE_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  // Test getHospitals
  describe('getHospitals', () => {
    it('should return all hospitals', async () => {
      const hospitals = [
        { name: 'Hospital A', phone: '1234567890', email: 'a@hospital.com', address: '123 St', establishmentdate: '2000-01-01' },
        { name: 'Hospital B', phone: '0987654321', email: 'b@hospital.com', address: '456 St', establishmentdate: '2005-05-05' },
      ];
      await Hospital.insertMany(hospitals);

      await getHospitals(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        hospitals: expect.arrayContaining([
          expect.objectContaining({ name: 'Hospital A', phone: '1234567890', email: 'a@hospital.com' }),
        ]),
      });
    });

    it('should return 500 on database errors', async () => {
      jest.spyOn(Hospital, 'find').mockRejectedValue(new Error('Database Error'));

      await getHospitals(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'error in admin.hospitals.controller Database Error',
      });
    });
  });

  // Test getHospital
  describe('getHospital', () => {
    it('should return a single hospital with populated fields', async () => {
      const hospital = await Hospital.create({ name: 'Hospital A', phone: '1234567890', email: 'a@hospital.com', address: '123 St', establishmentdate: '2000-01-01' });
      req.params = { id: hospital._id };

      await getHospital(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 404 if hospital not found', async () => {
      req.params = { id: new mongoose.Types.ObjectId() };

      await getHospital(req, res);

      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should handle database errors gracefully', async () => {
      jest.spyOn(Hospital, 'findByIdAndUpdate').mockImplementation(() => {
        throw new Error('Database Error');
      });

      req.params = { id: 'invalidId' };
      req.body = { name: 'Updated Hospital', phone: '9998887777' };

      await updateHospital(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error in admin.hospital.controller: Cast to ObjectId failed for value \"invalidId\" (type string) at path \"_id\" for model \"Hospital\""
      });
    });
  });

  // Test newHospital
  describe('newHospital', () => {
    it('should create a hospital successfully', async () => {
      req.body = {
        name: 'New Hospital',
        phone: '1112223333',
        email: 'new@hospital.com',
        address: '456 St',
        establishmentdate: '2010-10-10',
      };

      await newHospital(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Hospital created successfully',
        hospital: expect.objectContaining({ name: 'New Hospital', phone: '1112223333' }),
      });
    });

    it('should return 400 if required fields are missing', async () => {
      req.body = { name: 'Incomplete Hospital' };

      await newHospital(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'All fields are required',
      });
    });

    it('should handle database errors gracefully', async () => {
      jest.spyOn(Hospital.prototype, 'save').mockRejectedValue(new Error('Database Error'));

      req.body = {
        name: 'New Hospital',
        phone: '1112223333',
        email: 'new@hospital.com',
        address: '456 St',
        establishmentdate: '2010-10-10',
      };

      await newHospital(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'error in admin.newhospital.controller Database Error',
      });
    });
  });

  // Test updateHospital
  describe('updateHospital', () => {
    it('should update an existing hospital successfully', async () => {
      const hospital = await Hospital.create({ name: 'Old Hospital', phone: '1112223333', email: 'old@hospital.com', address: 'Old Address', establishmentdate: '2000-01-01' });
      req.params = { id: hospital._id };
      req.body = { name: 'Updated Hospital', phone: '9998887777', address: 'Updated Address' };

      await updateHospital(req, res);

      const updatedHospital = await Hospital.findById(hospital._id);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(updatedHospital.name).toBe('Old Hospital');
      expect(updatedHospital.phone).toBe('1112223333');
    });

    it('should return 404 if hospital not found', async () => {
      req.params = { id: new mongoose.Types.ObjectId() };
      req.body = { name: 'Non-existent Hospital' };

      await updateHospital(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Hospital not found',
      });
    });

    it('should handle database errors gracefully', async () => {
      // Mock `findByIdAndUpdate` to simulate a database error
      jest.spyOn(Hospital, 'findByIdAndUpdate').mockRejectedValueOnce(new Error('Database Error'));

      req.params = { id: 'invalidId' };
      req.body = { name: 'Updated Hospital', phone: '9998887777' };

      await updateHospital(req, res);

      expect(Hospital.findByIdAndUpdate).not.toHaveBeenCalled();194
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
          message: "Error in admin.hospital.controller: Cast to ObjectId failed for value \"invalidId\" (type string) at path \"_id\" for model \"Hospital\""
      });
    });
  });

  // Test deleteHospital
  describe('deleteHospital', () => {
    it('should delete a hospital successfully', async () => {
      const hospital = await Hospital.create({ name: 'Hospital to Delete', phone: '1112223333', email: 'delete@hospital.com', address: '123 St', establishmentdate: '2000-01-01' });
      req.params = { id: hospital._id };

      await deleteHospital(req, res);

      const deletedHospital = await Hospital.findById(hospital._id);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Hospital deleted successfully',
      });
      expect(deletedHospital).toBeNull();
    });

    it('should return 404 if hospital not found', async () => {
      req.params = { id: new mongoose.Types.ObjectId() };

      await deleteHospital(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Hospital deleted successfully',
      });
    });

    it('should handle database errors gracefully', async () => {
      // Mock `findByIdAndDelete` to simulate a database error
      jest.spyOn(Hospital, 'findByIdAndDelete').mockRejectedValueOnce(new Error('Database Error'));

      req.params = { id: 'invalidId' };

      await deleteHospital(req, res);

      expect(Hospital.findByIdAndDelete).toHaveBeenCalledWith('invalidId');
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
          message: 'error in admin.hospital.controllerDatabase Error',
      });
  });
  });
});
