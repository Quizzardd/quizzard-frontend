import React from 'react';

interface IMainLayout {
  props?: React.ReactNode;
}

const MainLayout: React.FC<IMainLayout> = ({ props }) => {
  return <div className="bg-white p-4"></div>;
};

export default MainLayout;
