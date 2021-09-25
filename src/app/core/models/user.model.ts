import { Filterable } from '../../shared/models/filterable.model';

export class RestrictedUser implements Filterable {
  constructor(public id: string, public name: string) {
    this.id = id;
    this.name = name;
  }

  static getRestrictedUserFromJson(json): RestrictedUser {
    if (json) return new RestrictedUser(json.id, json.name);
    return new RestrictedUser('-1', 'DELETED');
  }

  getFilterableProperty() {
    return this.name;
  }
}

export interface IUser {
  id?: string;
  email: string;
  name: string;
  birthday?: string;
  phone_number?: string;
  street?: string;
  city?: string;
  postal_code?: string;
  user_state?: string;
  user_record_state?: string;
  locked?: boolean;
  email_confirmed?: boolean;
  is_active?: boolean;
  accepted?: boolean;
}
