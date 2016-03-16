// filter
function as_location_string () {
  'ngInject';
  return function(address) {

    if (address.city === 0) {
      return address.city_state;
    }
    if (!address.addressline) {
      return 'Não tem endereço.';
    }

    var out = address.addressline + ', ';
    if (address.addressnumber) {
      out += address.addressnumber + ' - ';
    }
    if (address.addressline2) {
      out += address.addressline2 + ' - ';
    }
    if (address.neighborhood) {
      out += address.neighborhood + ' - ';
    }
    if (address.city_state) {
      out += address.city_state;
    }
    if (address.zipcode) {
      out += ' - ' + address.zipcode;
    }
    return out;
  };
};

export default as_location_string;
