import axios from 'axios';
import { Constants } from '../helpers/Constants';
import AuthService from './AuthService';

export default class ApiService {
  private authService: AuthService;
  private userTemp: any;

  constructor(userTemp: any) {
    this.authService = new AuthService();
    this.userTemp = userTemp;
  }

  public callApi(): Promise<any> {
    return this.authService.getUser().then(user => {
      user = user ? user : this.userTemp;
      if (user && user.access_token) {
        return this._callApi(user.access_token).catch(error => {
          if (error.response.status === 401) {
            return this.authService.renewToken().then(renewedUser => {
              return this._callApi(renewedUser.access_token);
            });
          }
          throw error;
        });
      } else if (user) {
        return this.authService.renewToken().then(renewedUser => {
          return this._callApi(renewedUser.access_token);
        });
      } else {
        throw new Error('user is not logged in');
      }
    });
  }

  private _callApi(token: string) {
    const headers = {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token
    };

    return axios.get(Constants.apiRoot + 'test', { headers });
  }
}
