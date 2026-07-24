import bcrypt from 'bcrypt';
import { FirestoreModelAdapter } from './MongooseToFirestore.js';

const User = new FirestoreModelAdapter('User');
export default User;
