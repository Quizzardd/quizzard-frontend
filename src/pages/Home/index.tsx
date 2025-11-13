import React from 'react';

interface IHome {
  props?: React.ReactNode;
}

const Home: React.FC<IHome> = ({ props }) => {
  return <div className="bg-white p-4"></div>;
};

export default Home;
