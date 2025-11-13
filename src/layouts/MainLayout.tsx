import React from 'react';

interface IMainLayout {
  children?: React.ReactNode;
}

const MainLayout: React.FC<IMainLayout> = ({ children }) => {
  return <div className="bg-white p-4">{children}</div>;
};

export default MainLayout;
