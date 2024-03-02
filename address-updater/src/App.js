import React, { useState, useEffect } from 'react';
import './App.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
;

const firebaseConfig = {
  apiKey: "AIzaSyCTwf9ue4epcxxK0u1aOYgSn1q7teboUNI",
  authDomain: "address-updater-db7a9.firebaseapp.com",
  databaseURL: "https://address-updater-db7a9-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "address-updater-db7a9",
  storageBucket: "address-updater-db7a9.appspot.com",
  messagingSenderId: "1042036209139",
  appId: "1:1042036209139:web:ca3528834fca8aa8020e86"
};
;

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();

function App() {
  const [name, setName] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const addressesRef = db.ref('addresses');
    addressesRef.on('value', (snapshot) => {
      const addressesData = snapshot.val();
      if (addressesData) {
        const addressesArray = Object.entries(addressesData).map(([id, data]) => ({ id, ...data }));
        setAddresses(addressesArray);
      } else {
        setAddresses([]);
      }
    });
  }, []);

  const clearFields = () => {
    setName('');
    setStreet('');
    setCity('');
    setState('');
    setZip('');
  };

  const addAddress = () => {
    if (!name || !street || !city || !state || !zip) {
      setError('Please fill in all fields.');
      return;
    }

    const newAddress = { name, street, city, state, zip };
    if (editingIndex !== null) {
      const addressRef = db.ref(`addresses/${addresses[editingIndex].id}`);
      addressRef.update(newAddress);
      setEditingIndex(null);
    } else {
      const addressesRef = db.ref('addresses');
      addressesRef.push(newAddress);
    }
    clearFields();
    setError('');
  };

  const editAddress = (index) => {
    const addressToEdit = addresses[index];
    setName(addressToEdit.name);
    setStreet(addressToEdit.street);
    setCity(addressToEdit.city);
    setState(addressToEdit.state);
    setZip(addressToEdit.zip);
    setEditingIndex(index);
  };

  const deleteAddress = (index) => {
    const addressId = addresses[index].id;
    const addressRef = db.ref(`addresses/${addressId}`);
    addressRef.remove();
  };

  return (
    <div className="App">
      <h1>Address Updater</h1>
      <div>
        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label>Street Address:</label>
        <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} />
      </div>
      <div>
        <label>City:</label>
        <input type="text" value={city} onChange={(e) => setCity(e.target.value)} />
      </div>
      <div>
        <label>State:</label>
        <input type="text" value={state} onChange={(e) => setState(e.target.value)} />
      </div>
      <div>
        <label>Zip Code:</label>
        <input type="text" value={zip} onChange={(e) => setZip(e.target.value)} />
      </div>
      <button className='updBtn' onClick={addAddress}>{editingIndex !== null ? 'Update Address' : 'Add Address'}</button>
      {error && <p className="error">{error}</p>}
      <h2>Addresses</h2>
      <ul>
        {addresses.map((address, index) => (
          <li key={address.id}>
            <strong>Name:</strong> {address.name}, <strong>Street:</strong> {address.street}, <strong>City:</strong> {address.city}, <strong>State:</strong> {address.state}, <strong>Zip:</strong> {address.zip}
            <button className='editBtn' onClick={() => editAddress(index)}>Edit</button>
            <button className='delBtn' onClick={() => deleteAddress(index)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
