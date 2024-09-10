import { IUser } from './users.interface';
import { UserModel } from './users.model';

interface UserQuery {
  id?: string;
  email?: string;
}

const createUserInToDB = async (data: any) => {
  try {
    // Create the user in the database
    const result = await UserModel.create(data);
    return result;
  } catch (error) {
    throw error;
  }
};

const getAUserInToDB = async (id: string, email: string) => {
  const searchCriteria: any = {};

  // Add search criteria based on provided query
  if (id) {
    searchCriteria._id = id;
  } else if (email) {
    searchCriteria.email = email;
  }

  // Find the user by either ID or email, excluding the password hash and other sensitive fields
  const result = await UserModel.findOne(searchCriteria).select(
    '-passwordHash -isDelete -isActive -__v -createdAt -updatedAt',
  );
  return result;
};
const updateAUserInToDB = async (id: string, data: Partial<IUser>) => {
  try {
    // Exclude fields that should not be updated
    const sensitiveFields = [
      'role',
      'isActive',
      'lastLogin',
      'isDelete',
      'createdAt',
      'updatedAt',
    ];

    const updateData = Object.fromEntries(
      Object.entries(data).filter(([key]) => !sensitiveFields.includes(key)),
    );

    // Find and update the user //! For updateOne we can user email if we use  findByOneAndUpdate
    const updatedUser = await UserModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
      select: '-passwordHash -role -isDelete -createdAt -updatedAt', // Exclude sensitive fields
    });

    // Return null if the user is not found
    if (!updatedUser) {
      throw new Error('User not found');
    }

    return updatedUser;
  } catch (error) {
    throw error; // Re-throw the error to be handled by the controller
  }
};
//! this route only for admin

const getAllUsersInToDB = async (
  filter: any,
  sort: any,
  page: number,
  limit: number,
) => {
  const skip = (page - 1) * limit;

  // Prepare the query with filter, sort, pagination, and limit
  const query = UserModel.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean(); // Use .lean() to get plain JavaScript objects instead of Mongoose documents

  // Get the total count of documents that match the filter
  const total = await UserModel.countDocuments(filter);

  // Execute the query to get the data
  const result = await query.exec();

  // Return the data and the total count
  return { data: result, total };
};

//! this route only for admin
const deleteAUserInToDB = async (id: string) => {
  try {
    // Use findByIdAndUpdate to directly search and update the user
    const deletedUser = await UserModel.findByIdAndUpdate(
      id,
      { $set: { isDelete: true } }, // Mark as deleted (true)
      { new: true },
    );

    // If user not found, return null or throw an error
    if (!deletedUser) {
      return null;
    }

    // Return the updated user
    return deletedUser;
  } catch (error) {
    throw new Error('Failed to update user deletion status');
  }
};

export const UserService = {
  createUserInToDB,
  getAUserInToDB,
  updateAUserInToDB,
  getAllUsersInToDB,
  deleteAUserInToDB,
};
