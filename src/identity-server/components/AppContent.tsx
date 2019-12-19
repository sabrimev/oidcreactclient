import * as React from 'react';

import { ApiService } from '../services/ApiService';
import { AuthService } from '../services/AuthService';

export default class AppContent extends React.Component<any, any> {
  public authService: AuthService;
  public apiService: ApiService;
  private shouldCancel: boolean;

  constructor(props: any) {
    super(props);

    this.authService = new AuthService();
    this.apiService = new ApiService({});
    this.state = { user: {}, api: {} };
    this.shouldCancel = false;
  }

  public componentDidMount() {
    this.getUser();
  }

  public login = () => {
    this.authService.login();
  };

  public callApi = () => {
    this.apiService
      .callApi()
      .then(data => {
        this.setState({ api: data.data });
        console.log('Api return successfully data, check in section - Api response');
      })
      .catch(error => {
        console.log(error);
      });
  };

  public componentWillUnmount() {
    this.shouldCancel = true;
  }

  public renewToken = () => {
    this.authService
      .renewToken()
      .then(user => {
        console.log('Token has been sucessfully renewed. :-)');
        this.getUser();
      })
      .catch(error => {
        console.log(error);
      });
  };

  public logout = () => {
    this.authService.logout();
  };

  public getUser = async () => {
    return this.authService.getUser().then(user => {
      if (user) {
        console.log('User has been successfully loaded from store.');
        return user;
      } else {
        console.log('You are not logged in.');
      }
      return false;
/*
      if (!this.shouldCancel) {
        this.setState({ user });
      }*/
    });
  };

}
