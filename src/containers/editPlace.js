/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/require-default-props */
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { PLACES } from '../helpers/constants';
import { sendAuthorizedRequest } from '../helpers/api';
import { CHANGE_MESS } from '../actions/messages';
import { housesLoad } from '../actions/requestHouses';
import loadImg from '../assets/loadImg.gif';

const EditPlaceForm = () => {
  const dispatch = useDispatch();
  const userState = useSelector(state => state.users);
  const housesState = useSelector(state => state.houses);
  const message = useSelector(state => state.message);
  const history = useHistory();
  let locationType = React.createRef();
  let address = React.createRef();
  let city = React.createRef();
  let country = React.createRef();
  let dailyPrice = React.createRef();

  const { id } = useParams();
  const { places } = housesState;
  let place = false;
  if (places.places) {
    place = places.places.find(element => element.id === id);
  }

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      history.push('/');
    }
    dispatch(housesLoad());
  }, [history, userState.user.username]);

  function editPlace(placeObj) {
    try {
      const path = `${PLACES}/${place.id}`;
      const dataSent = {
        place: placeObj,
      };
      sendAuthorizedRequest('put', path, localStorage.getItem('token'), dataSent)
        .then(response => {
          if ((typeof response.data.data !== 'undefined') && response.data.data.type === 'place') {
            dispatch(housesLoad(response.data.data.id, history));
          } else {
            let errorMessage = 'Error Editing Place';
            if (typeof response.data.status !== 'undefined') {
              errorMessage = response.data.status;
            }
            dispatch({
              type: CHANGE_MESS,
              payload: errorMessage,
            });
          }
        });
    } catch (error) {
      dispatch({
        type: CHANGE_MESS,
        payload: error,
      });
    }
  }

  return (
    <div>
      { userState.isFetching
        && (
          <div data-testid="loading" className="bg-load">
            <img className="image-load" src={loadImg} alt="loadingImage" />
          </div>
        )}
      { !userState.isFetching && place
      && (
      <div className="Login">
        <Form
          onSubmit={e => {
            e.preventDefault();
            address.classList.remove('error');
            city.classList.remove('error');
            country.classList.remove('error');
            dailyPrice.classList.remove('error');
            if (!dailyPrice.value.trim()) {
              dailyPrice.classList.add('error');
            }
            if (!country.value.trim()) {
              country.classList.add('error');
            }
            if (!city.value.trim()) {
              city.classList.add('error');
            }
            if (!address.value.trim()) {
              address.classList.add('error');
              address.focus();
              return;
            }
            if (!city.value.trim()) {
              city.focus();
              return;
            }
            if (!country.value.trim()) {
              country.focus();
              return;
            }
            if (!dailyPrice.value.trim()) {
              dailyPrice.focus();
              return;
            }
            const place = {
              location_type: locationType.value,
              address: address.value,
              city: city.value,
              country: country.value,
              daily_price: dailyPrice.value,
            };
            editPlace(place);
          }}
        >
          <Form.Group size="lg">
            <Form.Label>Type Location</Form.Label>
            <Form.Control
              defaultValue={place.description.location_type}
              as="select"
              custom
              ref={self => { (locationType = self); }}
            >
              <option value="1">Rocket LaunchPad</option>
            </Form.Control>
          </Form.Group>
          <Form.Group size="lg">
            <Form.Label>Description</Form.Label>
            <Form.Control
              defaultValue={place.description.address}
              ref={self => { (address = self); }}
              placeholder="Type Description..."
            />
          </Form.Group>
          <Form.Group size="lg">
            <Form.Label>City</Form.Label>
            <Form.Control
              defaultValue={place.description.city}
              ref={self => { (city = self); }}
              placeholder="City..."
            />
          </Form.Group>
          <Form.Group size="lg">
            <Form.Label>Country</Form.Label>
            <Form.Control
              defaultValue={place.description.country}
              ref={self => { (country = self); }}
              placeholder="Country..."
            />
          </Form.Group>
          <Form.Group size="lg">
            <Form.Label>Daily Price</Form.Label>
            <Form.Control
              defaultValue={place.description.daily_price}
              type="number"
              step="0.01"
              ref={self => { (dailyPrice = self); }}
              placeholder="Daily Price..."
            />
          </Form.Group>
          <Button block size="lg" type="submit">
            Edit Place
          </Button>
        </Form>
        { message
          && (
          <div className="d-flex flex-column align-items-center mt-3 text-danger">
            <div>
              <span>
                <b>Error:</b>
                {' '}
              </span>
              <span>
                {message}
              </span>
            </div>
          </div>
          )}
      </div>
      )}
    </div>
  );
};

export default EditPlaceForm;
