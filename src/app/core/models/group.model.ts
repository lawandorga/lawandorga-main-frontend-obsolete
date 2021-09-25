import { Filterable } from '../../shared/models/filterable.model';
import { RestrictedUser } from './user.model';

export class RestrictedGroup implements Filterable {
  constructor(public id: string, public name: string) {
    this.id = id;
    this.name = name;
  }

  getFilterableProperty() {
    return this.name;
  }
}

export class FullGroup extends RestrictedGroup {
  constructor(
    id: string,
    name: string,
    public creator_id: string,
    public members: RestrictedUser[],
    public visible: boolean,
    public description: string,
    public note: string
  ) {
    super(id, name);
    this.creator_id = creator_id;
    this.members = members;
    this.visible = visible;
    this.description = description;
    this.note = note;
  }
}
