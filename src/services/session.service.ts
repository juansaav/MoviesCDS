import jwt from 'jsonwebtoken'; 
import { randomBytes } from 'crypto';
import argon2 from 'argon2';
import { IUser, IUserInputDTO } from '../interfaces'; 
import { UserService } from '../services'; 
import { UserDA } from '../da'; 
import config from '../config';
 
export default class SessionService {
  constructor(private userda: UserDA ) { }

  
  public async SignIn(email: string, password: string): Promise<{ user: IUser; token: string }> {

        const userService = new UserService(this.userda);

        // User from db
	    const user = await userService.GetUser(email);
	    
	    // Check exists
	    if (!user) {
	      throw new Error('User not registered');
	    } 

	    // Verify password using salt
	    const validPassword = await argon2.verify(user.password, password);
	    if (validPassword) {

	      // Valid password
	      console.log('Password is valid');

	      // Generate token
	      console.log('Generate JWT');
	      const token = this.generateToken(user);

          // Delete sensible data
          Reflect.deleteProperty(user, 'password');
          Reflect.deleteProperty(user, 'salt');

	      // Return user and token 
	      return { user, token };
	    } else {
	      throw new Error('Invalid Password');
	    }
  }

  private generateToken(user) {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);
 
    console.log(`Sign JWT for userId: ${user._id}`);
    return jwt.sign(
      {
        _id: user._id, // We are gonna use this in the middleware 'isAuth'
        role: user.role,
        name: user.name,
        exp: exp.getTime() / 1000,
      },
      config.JWT_SECRET
    );
  }i
}