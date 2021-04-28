import React from 'react';

export const AppConfigContext = React.createContext(null);

export const useAppConfig = () => {
  const context = React.useContext(AppConfigContext);

  if (!context) {
    // eslint-disable-next-line no-console
    console.warn(
      `The \`useAppConfig\` hook must be used inside the <AppConfigContext.Provider> component's context.`,
    );
  }

  return context;
};

export const withAppConfig = (WrappedComponent) => {
  const WrappedField = (props) => {
    const config = useAppConfig();

    return <WrappedComponent appConfig={config} {...props} />;
  };

  return WrappedField;
};
