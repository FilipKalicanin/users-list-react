import React from 'react';
import { EditPen } from './icons/EditPen';
import { TrashCan } from './icons/TrashCan';

const FORM_STATES = {
  EDIT: 'edit',
  NEW: 'new'
};

export class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      secondName: '',
      id: '',
      usersList: [],
      formState: FORM_STATES.NEW,
    };

    this.onInput = this.onInput.bind(this);
    this.addUser = this.addUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.editUser = this.editUser.bind(this);
  }

  onInput(event) {
    event.preventDefault();
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  }

  componentDidUpdate(previousProps, previousState, snapShot) {
    if (previousState.usersList !== this.state.usersList) {
      localStorage.setItem('listOfActiveUsers', JSON.stringify(this.state.usersList))
    }
  }


  componentDidMount() {

    if (JSON.parse(localStorage.getItem('listOfActiveUsers'))) {

      const usersFromStorage = JSON.parse(localStorage.getItem('listOfActiveUsers'));

      if (usersFromStorage.length > 0) {
        this.setState({ usersList: usersFromStorage });
      }
    }
  }

  addUser(event) {
    event.preventDefault();

    if (this.state.formState === FORM_STATES.NEW) {

      let checkedListForIDValidation = [...this.state.usersList];
      checkedListForIDValidation = checkedListForIDValidation.filter(user => user.id === this.state.id);

      const users = [...this.state.usersList];

      if (this.state.firstName.trim() === '' || this.state.secondName.trim() === '' || this.state.id.trim() === '') {
        alert('Form fields cannot be empty :)');
      } else if (/[^A-Za-z\d]/.test(this.state.firstName.trim()) && /[^A-Za-z\d]/.test(this.state.secondName.trim())) {
        alert('First and Last name cannot contain special characters.')
      } else if (/\D/.test(this.state.id)) {
        alert('ID field must include numbers only in length of 9 caracters.');
      } else if (this.state.id.length !== 9) {
        alert('ID field has to include 9 characters.');
      } else if(checkedListForIDValidation.length > 0) {
        alert('ID has to be unique.');
      } else {
        users.push({ firstName: this.state.firstName, secondName: this.state.secondName, id: this.state.id });
      }

      this.setState({
        usersList: users,
        firstName: '',
        secondName: '',
        id: ''
      });

    } else {

      const userList = [...this.state.usersList];
      userList.forEach(user => {
        if (this.state.id === user.id) {
          user.firstName = this.state.firstName;
          user.secondName = this.state.secondName;
          user.id = this.state.id;
        }
      })

      this.setState({
        usersList: userList,
        firstName: '',
        secondName: '',
        id: '',
        formState: FORM_STATES.NEW
      });
    }

  }

  deleteUser(event, id) {
    event.preventDefault();

    let usersListForDelete = [...this.state.usersList];
    usersListForDelete = usersListForDelete.filter(user => user.id !== id);

    this.setState({
      usersList: usersListForDelete
    });
  }

  editUser(event, id) {
    event.preventDefault();

    const userForEdit = this.state;

    userForEdit.usersList.forEach(user => {
      if (id === user.id) {
        userForEdit.firstName = user.firstName;
        userForEdit.secondName = user.secondName;
        userForEdit.id = user.id;
      }
    });

    this.setState({
      formState: FORM_STATES.EDIT,
      state: userForEdit
    });
  }

  render() {
    return (
      <div className="container-main">

        <div className="container-form">
          <form onSubmit={this.addUser} className="form">
            <div>
              <label className="form-label">First Name:</label>
              <input type='text' placeholder="Eg. Jack" name="firstName" value={this.state.firstName} onChange={this.onInput} className="form-input" />
            </div>
            <div>
              <label className="form-label">Second Name:</label>
              <input type="text" placeholder="Eg. Jackson" name="secondName" value={this.state.secondName} onChange={this.onInput} className="form-input" />
            </div>
            <div>
              <label className="form-label">ID: (9 digits)</label>
              <input type="text" placeholder="Eg. 000000000" name="id" value={this.state.id} onChange={this.onInput} disabled={this.state.formState === FORM_STATES.EDIT} className="form-input" />
            </div>
            <input type="submit" className="form-button" value={this.state.formState === FORM_STATES.NEW ? 'Submit' : 'Confirm'} />
          </form>
        </div>

        <div className="container-user">
          {this.state.usersList.map(user => {
            return (
              <div key={user.id} className="user">
                <div className="user-data">
                  <label className="user-data-label">First name:</label>
                  <span className="user-data-span">{user.firstName}</span>
                </div>

                <div className="user-data">
                  <label className="user-data-label">Second name:</label>
                  <span className="user-data-span">{user.secondName}</span>
                </div>

                <div className="user-data">
                  <label className="user-data-label">ID:</label>
                  <span className="user-data-span">{user.id}</span>
                </div>

                <div className="user-buttons">
                  <button onClick={(event) => this.deleteUser(event, user.id)} className="user-button-delete"><TrashCan /></button>
                  <button onClick={(event) => this.editUser(event, user.id)} className="user-button-edit"><EditPen /></button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    );
  }
}