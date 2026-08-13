import React from 'react';
import { Image } from 'react-native';

const SearchIcon = ({ size = 20, color = '#666', style }) => {
  return (
    <Image
      source={require('../assets/search-icon.png')}
      style={[
        {
          width: size,
          height: size,
          tintColor: color,
          resizeMode: 'contain',
        },
        style,
      ]}
    />
  );
};

export default SearchIcon;
